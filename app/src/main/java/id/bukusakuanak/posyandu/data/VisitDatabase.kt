package id.bukusakuanak.posyandu.data

import android.content.Context
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.Upsert
import androidx.room.withTransaction
import org.json.JSONArray
import org.json.JSONObject

@Entity(tableName = "children")
internal data class ChildRow(@PrimaryKey val id: String, val payload: String)

@Entity(
    tableName = "visits",
    foreignKeys = [ForeignKey(entity = ChildRow::class, parentColumns = ["id"], childColumns = ["childId"], onDelete = ForeignKey.CASCADE)],
    indices = [Index("childId")],
)
internal data class VisitRow(@PrimaryKey val id: String, val childId: String, val payload: String)

@Entity(tableName = "visit_state")
internal data class VisitState(@PrimaryKey val id: Int = 1, val selected: String?, val revision: Long)

@Dao
internal interface VisitDao {
    @Query("SELECT * FROM children ORDER BY rowid") suspend fun children(): List<ChildRow>
    @Query("SELECT * FROM visits ORDER BY rowid") suspend fun visits(): List<VisitRow>
    @Query("SELECT * FROM visit_state WHERE id = 1") suspend fun state(): VisitState?
    @Upsert suspend fun upsertChildren(rows: List<ChildRow>)
    @Upsert suspend fun upsertVisits(rows: List<VisitRow>)
    @Upsert suspend fun upsertState(state: VisitState)
    @Query("DELETE FROM visits WHERE id = :id") suspend fun deleteVisit(id: String)
    @Query("DELETE FROM children WHERE id = :id") suspend fun deleteChild(id: String)
}

@Database(entities = [ChildRow::class, VisitRow::class, VisitState::class], version = 1, exportSchema = true)
internal abstract class VisitDatabase : RoomDatabase() {
    abstract fun visits(): VisitDao
}

@Volatile
private var sharedVisitDatabase: VisitDatabase? = null

internal fun visitDatabase(context: Context): VisitDatabase = sharedVisitDatabase ?: synchronized(VisitDatabase::class.java) {
    sharedVisitDatabase ?: Room.databaseBuilder(context.applicationContext, VisitDatabase::class.java, "buku-saku-anak.db")
        .build().also { sharedVisitDatabase = it }
}

internal data class SavedVisits(val snapshot: VisitSnapshot, val revision: Long) {
    fun json() = JSONObject().put("revision", revision).put("state", snapshot.json())
}

internal class VisitRepository(private val database: VisitDatabase) {
    private val dao get() = database.visits()

    suspend fun load(): SavedVisits = database.withTransaction { read() }

    suspend fun save(input: JSONObject, revision: Long): SavedVisits = database.withTransaction {
        val currentRevision = dao.state()?.revision ?: 0
        if (revision != currentRevision) throw InvalidVisits("Data berubah. Muat ulang sebelum menyimpan kembali.")
        write(VisitSnapshot.parse(input), currentRevision + 1)
    }

    suspend fun previewImport(incoming: VisitSnapshot): ImportPreview = database.withTransaction {
        read().snapshot.merge(incoming)
    }

    suspend fun import(incoming: VisitSnapshot): SavedVisits = database.withTransaction {
        val current = read()
        val result = current.snapshot.merge(incoming)
        if (result.addedChildren == 0 && result.addedVisits == 0) current
        else write(result.merged, current.revision + 1)
    }

    private suspend fun read(): SavedVisits {
        val current = dao.state()
        val stored = JSONObject()
            .put("version", 1)
            .put("selected", current?.selected ?: JSONObject.NULL)
            .put("children", JSONArray(dao.children().map { JSONObject(it.payload) }))
            .put("visits", JSONArray(dao.visits().map { JSONObject(it.payload) }))
        return SavedVisits(VisitSnapshot.parse(stored), current?.revision ?: 0)
    }

    private suspend fun write(snapshot: VisitSnapshot, revision: Long): SavedVisits {
        val oldChildren = dao.children().associateBy(ChildRow::id)
        val oldVisits = dao.visits().associateBy(VisitRow::id)
        val children = snapshot.children.map { (id, value) -> ChildRow(id, value.toString()) }
        val visits = snapshot.visits.map { (id, value) -> VisitRow(id, value.getString("childId"), value.toString()) }

        dao.upsertChildren(children.filter { oldChildren[it.id] != it })
        dao.upsertVisits(visits.filter { oldVisits[it.id] != it })
        for (id in oldVisits.keys - snapshot.visits.keys) dao.deleteVisit(id)
        for (id in oldChildren.keys - snapshot.children.keys) dao.deleteChild(id)
        dao.upsertState(VisitState(selected = snapshot.selected, revision = revision))
        return SavedVisits(snapshot, revision)
    }
}

package id.bukusakuanak.posyandu.data

import androidx.room.Room
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import kotlinx.coroutines.runBlocking
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.fail
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class VisitRepositoryDeviceTest {
    @Test
    fun storedVisitRejectsStaleOrInvalidWrites() = runBlocking {
        val context = InstrumentationRegistry.getInstrumentation().targetContext
        val database = Room.inMemoryDatabaseBuilder(context, VisitDatabase::class.java).build()
        try {
            val repository = VisitRepository(database)
            val data = JSONObject("""
                {"version":1,"selected":"v","children":[{"id":"c","name":"DEMO","birthDate":"2025-01-01","sex":"f"}],
                "visits":[{"id":"v","childId":"c","examDate":"2025-10-01","measures":
                {"weight":8.5,"height":70,"head":44,"arm":12,"position":"length","oedema":false}}]}
            """.trimIndent())
            val first = repository.save(data, repository.load().revision)
            assertEquals(1L, first.revision)
            assertEquals(setOf("v"), repository.load().snapshot.visits.keys)

            try {
                repository.save(data, 0L)
                fail("Revisi lama semestinya ditolak.")
            } catch (_: InvalidVisits) {
                assertEquals(1L, repository.load().revision)
            }

            data.getJSONArray("visits").getJSONObject(0).put("childId", "hilang")
            try {
                repository.save(data, 1L)
                fail("Relasi anak yang rusak semestinya ditolak.")
            } catch (_: InvalidVisits) {
                val stored = repository.load()
                assertEquals(1L, stored.revision)
                assertEquals("c", stored.snapshot.visits.getValue("v").getString("childId"))
            }
        } finally {
            database.close()
        }
    }
}

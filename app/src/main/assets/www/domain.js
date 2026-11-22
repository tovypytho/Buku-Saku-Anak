/* Extracted from the inspected HTML. Keep the reference versions with fixtures. */
const GROWTH_REFERENCE = (typeof module !== 'undefined' && module.exports)
  ? require('./clinical-data.js').growth : bukuSakuData.growth;
    function parseDate(s) {
      if (!s) return null;
      const m = s.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!m) return null;
      const y = parseInt(m[1], 10), mon = parseInt(m[2], 10), d = parseInt(m[3], 10);
      const dt = new Date(Date.UTC(y, mon - 1, d));
      if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mon - 1 || dt.getUTCDate() !== d) return null;
      return { y, m: mon, d };
    }
    function formatDateId(s) {
      const p = parseDate(s);
      if (!p) return s;
      const dt = new Date(Date.UTC(p.y, p.m - 1, p.d));
      return dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
    }
    function addMonths(dt, n) {
      const tot = dt.y * 12 + (dt.m - 1) + n;
      const targetY = Math.floor(tot / 12), targetM = (tot % 12) + 1;
      const maxDays = new Date(Date.UTC(targetY, targetM, 0)).getUTCDate();
      return { y: targetY, m: targetM, d: Math.min(dt.d, maxDays) };
    }
    function diffDays(d1, d2) {
      return Math.round((Date.UTC(d2.y, d2.m - 1, d2.d) - Date.UTC(d1.y, d1.m - 1, d1.d)) / 86400000);
    }
    function calculateAge(profile) {
      if (!profile) return null;
      const birth = parseDate(profile.birthDate);
      const exam = parseDate(profile.examDate);
      if (!birth || !exam) return null;
      const dDiff = diffDays(birth, exam);
      if (dDiff < 0) return null;
      if (dDiff === 0) return { fullMonths: 0, chartAge: 0, display: '0 hari (lahir)' };
      let fullMonths = 0;
      while (true) {
        const nextDate = addMonths(birth, fullMonths + 1);
        if (diffDays(nextDate, exam) >= 0) fullMonths++;
        else break;
      }
      const dThis = addMonths(birth, fullMonths);
      const dNext = addMonths(birth, fullMonths + 1);
      const remDays = diffDays(dThis, exam);
      const intervalDays = diffDays(dThis, dNext);
      const chartAge = fullMonths + (intervalDays > 0 ? remDays / intervalDays : 0);
      const parts = [];
      if (fullMonths === 0) {
        const weeks = Math.floor(remDays / 7);
        const days = remDays % 7;
        if (weeks > 0) parts.push(`${weeks} minggu`);
        if (days > 0) parts.push(`${days} hari`);
      } else {
        const years = Math.floor(fullMonths / 12);
        const months = fullMonths % 12;
        if (years > 0) parts.push(`${years} tahun`);
        if (months > 0) parts.push(`${months} bulan`);
        if (remDays > 0) parts.push(`${remDays} hari`);
      }
      return { fullMonths, chartAge, display: parts.join(' ') };
    }

    const GROWTH_INDICATORS = {
      wfa: ['BB/U', 'kg'],
      length: ['PB/TB menurut umur', 'cm'],
      proportion: ['BB menurut PB/TB', 'kg'],
      bmi: ['IMT/U', 'kg/m²'],
      hcfa: ['Lingkar kepala/U', 'cm'],
      arm: ['LiLA', 'cm']
    };
    const GROWTH_CHECK_LIMITS = { wfa: [-6, 5], length: [-6, 6], proportion: [-5, 5], bmi: [-5, 5], hcfa: [-5, 5] };

    function growthCurveValue(row, z) {
      const [, l, m, s] = row;
      return l === 0 ? m * Math.exp(s * z) : m * Math.pow(1 + l * s * z, 1 / l);
    }

    function growthZScore(row, value, restricted) {
      const [, l, m, s] = row;
      const base = l === 0 ? Math.log(value / m) / s : Math.expm1(l * Math.log(value / m)) / (l * s);
      if (!restricted || Math.abs(base) <= 3) return base;
      const direction = Math.sign(base);
      const edge = growthCurveValue(row, direction * 3);
      const neighbor = growthCurveValue(row, direction * 2);
      return direction * 3 + (value - edge) / Math.abs(edge - neighbor);
    }

    function growthCategory(indicator, rawZ) {
      const z = Math.round(rawZ * 1e10) / 1e10;
      if (indicator === 'hcfa') return z < -2 ? 'Di bawah −2 SD' : z > 2 ? 'Di atas +2 SD' : 'Dalam rentang −2 hingga +2 SD';
      if (indicator === 'length') return z < -3 ? 'Sangat pendek' : z < -2 ? 'Pendek' : z > 3 ? 'Tinggi' : 'Normal';
      if (indicator === 'wfa') return z < -3 ? 'Berat badan sangat kurang' : z < -2 ? 'Berat badan kurang' : z > 1 ? 'Risiko berat badan lebih' : 'Berat badan normal';
      if (z < -3) return 'Gizi buruk';
      if (z < -2) return 'Gizi kurang';
      if (z <= 1) return 'Gizi baik';
      if (z <= 2) return 'Berisiko gizi lebih';
      return z <= 3 ? 'Gizi lebih' : 'Obesitas';
    }

    function calculateGrowth(child, visit) {
      const age = calculateAge({ birthDate: child.birthDate, examDate: visit.examDate });
      const months = age?.fullMonths ?? Infinity;
      const usedPosition = months <= 24 ? 'length' : 'height';
      const measurements = visit.measures;
      const corrected = measurements.height === null || !measurements.position ? null :
        Math.round((measurements.height + (measurements.position === usedPosition ? 0 : usedPosition === 'length' ? 0.7 : -0.7)) * 100) / 100;
      const standing = usedPosition === 'height';
      const hasWeight = measurements.weight !== null;
      const bmi = hasWeight && corrected > 0 ? measurements.weight / (corrected / 100) ** 2 : null;
      const indexes = {
        wfa: { ref: 'wfa', x: months, value: measurements.weight },
        length: { ref: standing ? 'hfa' : 'lfa', x: months, value: corrected },
        proportion: { ref: standing ? 'wfh' : 'wfl', x: corrected, value: hasWeight ? measurements.weight : null },
        bmi: { ref: standing ? 'bfah' : 'bfal', x: months, value: bmi },
        hcfa: { ref: 'hcfa', x: months, value: measurements.head },
        arm: { ref: 'arm', x: Date.parse(visit.examDate) / 86400000, value: measurements.arm }
      };

      for (const [key, info] of Object.entries(indexes)) {
        info.label = key === 'length' ? (standing ? 'TB/U' : 'PB/U') :
          key === 'proportion' ? (standing ? 'BB/TB' : 'BB/PB') : GROWTH_INDICATORS[key][0];
        info.unit = GROWTH_INDICATORS[key][1];
        info.rows = key === 'arm' ? [] : GROWTH_REFERENCE[info.ref][child.sex] ?? [];
        if (info.value === null || info.x === null) {
          info.status = 'Belum diukur';
          continue;
        }
        info.restricted = ['wfa', 'proportion', 'bmi'].includes(key);
        if (key === 'arm') {
          info.status = months < 6 || months > 59 ? 'Ukuran tercatat · acuan penapisan 6–59 bulan' :
            info.value < 11.5 ? 'Di bawah 11,5 cm' : info.value < 12.5 ? '11,5 hingga kurang dari 12,5 cm' : '12,5 cm atau lebih';
          continue;
        }
        const min = info.rows[0]?.[0];
        const max = info.rows.at(-1)?.[0];
        if (months > 60 || info.x < min || info.x > max || !info.rows.length) {
          info.status = 'Di luar cakupan tabel rujukan';
          continue;
        }
        if (measurements.oedema && info.restricted) {
          info.status = 'Berat tidak dinilai saat edema tercatat';
          continue;
        }
        const row = info.rows[key === 'proportion' ? Math.round((info.x + 1e-10) * 10) - Math.round(min * 10) : info.x - min];
        const z = growthZScore(row, info.value, info.restricted);
        const [lo, hi] = GROWTH_CHECK_LIMITS[key];
        if (!Number.isFinite(z) || z < lo || z > hi) {
          info.status = 'Periksa kembali ukuran atau usia';
          continue;
        }
        info.z = z;
        info.status = growthCategory(key, z);
      }
      return { age, indexes, corrected, usedPosition };
    }

    function interpretDenverRecap(findings) {
      const delays = findings.filter(finding => finding.position === 'delay');
      const cautions = findings.filter(finding => finding.position === 'caution');
      const refusedDelays = delays.filter(finding => finding.response === 'R').length;
      const refusedCautions = cautions.filter(finding => finding.response === 'R').length;
      const counts = { delays: delays.length, cautions: cautions.length };

      if (refusedDelays > 0 || refusedCautions >= 2) {
        const reasons = [];
        if (refusedDelays > 0) reasons.push(`${refusedDelays} penolakan pada butir yang seluruhnya di kiri garis umur`);
        if (refusedCautions >= 2) reasons.push(`${refusedCautions} penolakan pada butir di rentang P75–P90`);
        return { ...counts, category: 'Untestable', reason: `${reasons.join(' dan ')}.` };
      }
      if (counts.delays > 0 || counts.cautions >= 2) {
        return {
          ...counts,
          category: 'Suspect',
          reason: 'Terdapat minimal satu Delay atau dua Caution.'
        };
      }
      return {
        ...counts,
        category: 'Normal',
        reason: 'Tidak ada Delay dan jumlah Caution maksimal satu.'
      };
    }

    function kpspClassification(score) {
      return score >= 9 ? 'S' : score >= 7 ? 'M' : 'P';
    }

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { parseDate, formatDateId, calculateAge, calculateGrowth, growthCurveValue, growthZScore, growthCategory, kpspClassification, interpretDenverRecap };
}

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 엑셀 파일 읽기
const workbook = XLSX.readFile('../전국초중등학교위치표준데이터-20260109.xls');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// JSON으로 변환 (header: 1로 모든 행을 배열로)
const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// 빈 행 건너뛰고 첫 번째 데이터 행이 헤더
const nonEmptyRows = rawData.filter(row => row.length > 0);
const headers = nonEmptyRows[0];
console.log('헤더:', headers);

// 데이터 행들 (헤더 제외)
const dataRows = nonEmptyRows.slice(1);
console.log(`총 ${dataRows.length}개 학교 데이터`);
console.log('첫 번째 데이터:', dataRows[0]);

// 헤더 인덱스 찾기
const findIndex = (name) => headers.findIndex(h => h && String(h).includes(name));

const schoolIdIdx = findIndex('학교ID');
const schoolNameIdx = findIndex('학교명');
const schoolTypeIdx = findIndex('학교급');
const foundationTypeIdx = findIndex('설립형태');
const operationStatusIdx = findIndex('운영상태');
const jibunAddressIdx = findIndex('지번주소');
const roadAddressIdx = findIndex('도로명주소');
const sidoOfficeIdx = findIndex('시도교육청명');
const localOfficeIdx = findIndex('교육지원청명');
const latIdx = findIndex('위도');
const lngIdx = findIndex('경도');

console.log('인덱스:', { schoolIdIdx, schoolNameIdx, schoolTypeIdx, latIdx, lngIdx });

// 데이터 변환
const schools = dataRows.map((row, index) => {
  const lat = parseFloat(row[latIdx]);
  const lng = parseFloat(row[lngIdx]);

  if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

  return {
    schoolId: row[schoolIdIdx] || String(index + 1),
    schoolName: row[schoolNameIdx] || '',
    schoolType: row[schoolTypeIdx] || '',
    foundationType: row[foundationTypeIdx] || '',
    operationStatus: row[operationStatusIdx] || '',
    roadAddress: row[roadAddressIdx] || '',
    jibunAddress: row[jibunAddressIdx] || '',
    latitude: lat,
    longitude: lng,
    sidoOffice: row[sidoOfficeIdx] || '',
    localOffice: row[localOfficeIdx] || '',
  };
}).filter(school => school !== null && school.schoolName);

console.log(`유효한 학교 데이터: ${schools.length}개`);

// 학교급별 통계
const stats = {
  elementary: schools.filter(s => s.schoolType && s.schoolType.includes('초등')).length,
  middle: schools.filter(s => s.schoolType && s.schoolType.includes('중학')).length,
  high: schools.filter(s => s.schoolType && s.schoolType.includes('고등')).length,
};
console.log('학교급별 통계:', stats);

// 샘플 데이터
console.log('샘플 데이터:', schools.slice(0, 3));

// JSON 파일로 저장
const outputPath = path.join('src', 'data', 'schools.json');
fs.writeFileSync(outputPath, JSON.stringify(schools, null, 2), 'utf-8');
console.log(`저장 완료: ${outputPath}`);

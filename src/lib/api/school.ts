/**
 * 전국초중등학교위치 정적 데이터 기반 API
 * 데이터 출처: 전국초중등학교위치표준데이터 (data.go.kr)
 *
 * API 서버 접속 불가로 엑셀 데이터를 JSON으로 변환하여 사용
 */

import schoolsData from "@/data/schools.json";

export interface SchoolData {
  schoolId: string;
  schoolName: string;
  schoolType: string; // 초등학교, 중학교, 고등학교
  foundationType: string; // 공립, 사립
  operationStatus: string; // 운영
  roadAddress: string;
  jibunAddress: string;
  latitude: number;
  longitude: number;
  sidoOffice: string; // 시도교육청명
  localOffice: string; // 교육지원청명
}

export interface NearbySchool extends SchoolData {
  distance: number; // km
  walkingTime: number; // 분
}

// 타입 캐스팅
const schools: SchoolData[] = schoolsData as SchoolData[];

/**
 * 좌표 기반 주변 학교 검색
 * @param latitude 중심 위도
 * @param longitude 중심 경도
 * @param radiusKm 반경 (km), 기본값 1.5km
 * @param limit 최대 결과 수, 기본값 10
 * @param schoolType 학교 유형 필터 (초등학교, 중학교, 고등학교)
 */
export function getNearbySchools(
  latitude: number,
  longitude: number,
  radiusKm: number = 1.5,
  limit: number = 10,
  schoolType?: string
): NearbySchool[] {
  let filteredSchools = schools;

  // 학교 유형 필터
  if (schoolType) {
    filteredSchools = schools.filter((s) => s.schoolType.includes(schoolType));
  }

  return filteredSchools
    .map((school) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        school.latitude,
        school.longitude
      );

      return {
        ...school,
        distance,
        walkingTime: distanceToWalkingTime(distance),
      };
    })
    .filter((school) => school.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

/**
 * 시도 기반 학교 목록 조회
 * @param sidoName 시도 이름 (예: "경기")
 * @param schoolType 학교 유형 필터
 */
export function getSchoolsBySido(
  sidoName: string,
  schoolType?: string
): SchoolData[] {
  let filtered = schools.filter(
    (s) => s.sidoOffice.includes(sidoName) || s.roadAddress.includes(sidoName)
  );

  if (schoolType) {
    filtered = filtered.filter((s) => s.schoolType.includes(schoolType));
  }

  return filtered;
}

/**
 * 학교 유형별 통계
 */
export function getSchoolStats(): {
  total: number;
  elementary: number;
  middle: number;
  high: number;
} {
  return {
    total: schools.length,
    elementary: schools.filter((s) => s.schoolType.includes("초등")).length,
    middle: schools.filter((s) => s.schoolType.includes("중학")).length,
    high: schools.filter((s) => s.schoolType.includes("고등")).length,
  };
}

/**
 * 두 좌표 사이의 거리 계산 (Haversine 공식)
 * @returns 거리 (km)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 지구 반경 (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * 거리를 도보 시간으로 변환 (평균 보행 속도: 4km/h)
 * @param distanceKm 거리 (km)
 * @returns 도보 시간 (분)
 */
export function distanceToWalkingTime(distanceKm: number): number {
  return Math.round((distanceKm / 4) * 60);
}

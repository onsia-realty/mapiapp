/**
 * 지하철역 정보 API
 * 데이터 출처: 전국도시철도역사정보 표준데이터 (data.go.kr)
 */

import subwayStationsData from "@/data/subway-stations.json";

export interface SubwayStation {
  stationId: string;
  stationName: string;
  lineId: string;
  lineName: string;
  englishName: string;
  isTransfer: boolean;
  transferLines: string | null;
  latitude: number;
  longitude: number;
  operator: string;
  address: string;
  phone: string;
}

// 타입 캐스팅
const subwayStations: SubwayStation[] = subwayStationsData as SubwayStation[];

/**
 * 좌표 기반 주변 지하철역 검색
 * @param latitude 위도
 * @param longitude 경도
 * @param radiusKm 반경 (km, 기본값 2)
 * @param limit 최대 결과 수 (기본값 5)
 */
export function getNearbySubwayStations(
  latitude: number,
  longitude: number,
  radiusKm: number = 2,
  limit: number = 5
): Array<SubwayStation & { distance: number; walkingTime: number }> {
  return subwayStations
    .map((station) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        station.latitude,
        station.longitude
      );
      return {
        ...station,
        distance,
        walkingTime: distanceToWalkingTime(distance),
      };
    })
    .filter((station) => station.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

/**
 * 역명으로 검색
 * @param name 역명 (부분 일치)
 */
export function searchStationsByName(name: string): SubwayStation[] {
  const searchTerm = name.toLowerCase();
  return subwayStations.filter(
    (station) =>
      station.stationName.toLowerCase().includes(searchTerm) ||
      station.englishName.toLowerCase().includes(searchTerm)
  );
}

/**
 * 노선별 역 목록 조회
 * @param lineName 노선명 (예: "1호선", "2호선")
 */
export function getStationsByLine(lineName: string): SubwayStation[] {
  return subwayStations.filter((station) =>
    station.lineName.includes(lineName)
  );
}

/**
 * 노선 색상 반환
 */
export function getLineColor(lineName: string): string {
  const lineColors: { [key: string]: string } = {
    "1호선": "#0052A4",
    "2호선": "#00A84D",
    "3호선": "#EF7C1C",
    "4호선": "#00A5DE",
    "5호선": "#996CAC",
    "6호선": "#CD7C2F",
    "7호선": "#747F00",
    "8호선": "#E6186C",
    "9호선": "#BDB092",
    경의중앙선: "#77C4A3",
    분당선: "#F5A200",
    경춘선: "#0C8E72",
    신분당선: "#D4003B",
    공항철도: "#0090D2",
    경강선: "#003DA5",
    서해선: "#8FC31F",
    수인분당선: "#F5A200",
    우이신설선: "#B7C452",
    신림선: "#6789CA",
    김포골드라인: "#AD8605",
    용인경전철: "#509F22",
    의정부경전철: "#FDA600",
    // 부산
    "부산1호선": "#F06A00",
    "부산2호선": "#81BF48",
    "부산3호선": "#BB8C00",
    "부산4호선": "#217DCB",
    부산김해경전철: "#8E67B0",
    // 대구
    "대구1호선": "#D93F5C",
    "대구2호선": "#00AA80",
    "대구3호선": "#FFB100",
    // 광주
    "광주1호선": "#009088",
    // 대전
    "대전1호선": "#007448",
  };

  // 노선명에서 색상 찾기
  for (const [key, color] of Object.entries(lineColors)) {
    if (lineName.includes(key) || key.includes(lineName)) {
      return color;
    }
  }

  return "#666666"; // 기본 색상
}

/**
 * 노선 번호 추출 (예: "1호선" -> "1")
 */
export function getLineNumber(lineName: string): string {
  const match = lineName.match(/(\d+)호선/);
  if (match) return match[1];

  // 특수 노선
  const specialLines: { [key: string]: string } = {
    경의중앙: "K",
    분당: "B",
    경춘: "C",
    신분당: "S",
    공항철도: "A",
    경강: "G",
    서해: "W",
    수인분당: "SB",
    우이신설: "U",
    신림: "SL",
    김포골드라인: "GF",
    용인경전철: "Y",
    의정부경전철: "UI",
  };

  for (const [key, value] of Object.entries(specialLines)) {
    if (lineName.includes(key)) {
      return value;
    }
  }

  return "";
}

/**
 * 두 좌표 사이의 거리 계산 (Haversine 공식)
 * @returns 거리 (km)
 */
function calculateDistance(
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
function distanceToWalkingTime(distanceKm: number): number {
  return Math.round((distanceKm / 4) * 60);
}

/**
 * 전체 역 수 반환
 */
export function getTotalStationCount(): number {
  return subwayStations.length;
}

/**
 * 운영기관 목록 반환
 */
export function getOperators(): string[] {
  return [...new Set(subwayStations.map((s) => s.operator))];
}

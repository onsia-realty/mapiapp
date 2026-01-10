/**
 * 전국버스정류장위치정보 API
 * https://www.data.go.kr/data/15067528/fileData.do
 *
 * Base URL: https://api.odcloud.kr/api
 * 엔드포인트: /15067528/v1/uddi:f74b9799-9db1-4754-a5d0-b66e2ae705f3
 */

const API_BASE_URL =
  "https://api.odcloud.kr/api/15067528/v1/uddi:f74b9799-9db1-4754-a5d0-b66e2ae705f3";

export interface BusStopData {
  정류장번호: string;
  정류장명: string;
  위도: string;
  경도: string;
  도시명: string;
  도시코드: number;
  관리도시명: string;
  모바일단축번호: number;
  정보수집일: string;
}

export interface BusStopApiResponse {
  currentCount: number;
  data: BusStopData[];
  matchCount: number;
  page: number;
  perPage: number;
  totalCount: number;
}

export interface NearbyBusStop {
  stationId: string;
  stationName: string;
  latitude: number;
  longitude: number;
  cityName: string;
  mobileNumber: number;
  distance: number; // km
  walkingTime: number; // 분
}

/**
 * 도시명으로 버스 정류장 조회 (조건 검색 사용)
 * @param cityName 도시명 (예: "용인")
 * @param page 페이지 번호
 * @param perPage 페이지당 결과 수
 */
export async function getBusStopsByCity(
  cityName: string,
  page: number = 1,
  perPage: number = 1000
): Promise<BusStopData[]> {
  const apiKey = process.env.DATA_GO_KR_API_KEY;

  if (!apiKey) {
    console.error("DATA_GO_KR_API_KEY 환경변수가 설정되지 않았습니다.");
    return [];
  }

  // odcloud API의 조건 검색 사용 (cond[필드명::LIKE]=값)
  const url = `${API_BASE_URL}?page=${page}&perPage=${perPage}&cond[도시명::LIKE]=${encodeURIComponent(cityName)}&serviceKey=${apiKey}`;

  try {
    console.log(`🚌 버스정류장 API 호출: ${cityName}, page=${page}, perPage=${perPage}`);

    const response = await fetch(url);
    const data: BusStopApiResponse = await response.json();

    console.log(`🚌 버스정류장 API 응답: ${data.currentCount}개 (전체: ${data.matchCount || data.totalCount})`);

    return data.data || [];
  } catch (error) {
    console.error("버스정류장 API 호출 오류:", error);
    return [];
  }
}

/**
 * 좌표 기반 주변 버스 정류장 검색
 * @param latitude 중심 위도
 * @param longitude 중심 경도
 * @param busStops 버스 정류장 목록
 * @param radiusKm 반경 (km)
 * @param limit 최대 결과 수
 */
export function filterBusStopsByDistance(
  latitude: number,
  longitude: number,
  busStops: BusStopData[],
  radiusKm: number = 0.5,
  limit: number = 5
): NearbyBusStop[] {
  return busStops
    .map((stop) => {
      const stopLat = parseFloat(stop.위도);
      const stopLng = parseFloat(stop.경도);

      if (isNaN(stopLat) || isNaN(stopLng)) {
        return null;
      }

      const distance = calculateDistance(latitude, longitude, stopLat, stopLng);

      return {
        stationId: stop.정류장번호,
        stationName: stop.정류장명,
        latitude: stopLat,
        longitude: stopLng,
        cityName: stop.도시명,
        mobileNumber: stop.모바일단축번호,
        distance,
        walkingTime: distanceToWalkingTime(distance),
      };
    })
    .filter(
      (stop): stop is NearbyBusStop => stop !== null && stop.distance <= radiusKm
    )
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

/**
 * 주소에서 도시명 추출
 */
export function extractCityFromAddress(address: string): string {
  // "경기도 용인시 처인구 양지면" -> "용인"
  const parts = address.split(" ");

  for (const part of parts) {
    if (part.endsWith("시") || part.endsWith("군")) {
      return part.replace(/시$|군$/, "");
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
export function distanceToWalkingTime(distanceKm: number): number {
  return Math.round((distanceKm / 4) * 60);
}

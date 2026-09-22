import { NextRequest, NextResponse } from "next/server";
import {
  getBusStopsByCity,
  filterBusStopsByDistance,
  extractCityFromAddress,
  NearbyBusStop,
} from "@/lib/api/bus";

export interface BusApiResponse {
  success: boolean;
  data: NearbyBusStop[];
  message?: string;
}

/**
 * 좌표 기반 주변 버스 정류장 조회 API
 *
 * GET /api/bus?lat={latitude}&lng={longitude}&address={address}&radius={radius}&limit={limit}
 *
 * @param lat - 위도 (필수)
 * @param lng - 경도 (필수)
 * @param address - 주소 (도시 추출용, 필수)
 * @param radius - 반경 km (선택, 기본값 0.5)
 * @param limit - 최대 결과 수 (선택, 기본값 5)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const address = searchParams.get("address");
  const radius = parseFloat(searchParams.get("radius") || "0.5");
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  if (!lat || !lng || !address) {
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "lat, lng, address 파라미터가 필요합니다.",
      },
      { status: 400 }
    );
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "유효하지 않은 좌표입니다.",
      },
      { status: 400 }
    );
  }

  try {
    // 주소에서 도시명 추출
    const cityName = extractCityFromAddress(address);
    console.log(`🚌 버스정류장 검색: ${cityName}, 좌표: (${latitude}, ${longitude}), 반경: ${radius}km`);

    // 해당 도시의 버스 정류장 조회 (API에서 1000개씩)
    const busStops = await getBusStopsByCity(cityName, 1, 5000);

    // 반경 내 정류장 필터링
    const nearbyStops = filterBusStopsByDistance(
      latitude,
      longitude,
      busStops,
      radius,
      limit
    );

    const response: BusApiResponse = {
      success: true,
      data: nearbyStops,
    };

    console.log(`✅ 주변 버스정류장 ${response.data.length}개 검색 완료`);

    return NextResponse.json(response);
  } catch (error) {
    console.error("버스정류장 API 에러:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "버스정류장 정보를 가져오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

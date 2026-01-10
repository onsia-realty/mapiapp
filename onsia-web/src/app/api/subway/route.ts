import { NextRequest, NextResponse } from "next/server";
import {
  getNearbySubwayStations,
  searchStationsByName,
  getLineColor,
  getLineNumber,
} from "@/lib/api/subway";

export interface NearbySubwayStation {
  stationId: string;
  stationName: string;
  lineName: string;
  lineNumber: string;
  lineColor: string;
  isTransfer: boolean;
  transferLines: string | null;
  distance: number; // km
  walkingTime: number; // 분
  address: string;
}

export interface SubwayApiResponse {
  success: boolean;
  data: NearbySubwayStation[];
  message?: string;
}

/**
 * 좌표 기반 주변 지하철역 조회 API
 *
 * GET /api/subway?lat={latitude}&lng={longitude}&radius={radius}&limit={limit}
 *
 * @param lat - 위도 (필수)
 * @param lng - 경도 (필수)
 * @param radius - 반경 km (선택, 기본값 2)
 * @param limit - 최대 결과 수 (선택, 기본값 5)
 * @param search - 역명 검색 (선택, lat/lng 대신 사용)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = parseFloat(searchParams.get("radius") || "2");
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const search = searchParams.get("search");

  // 역명 검색 모드
  if (search) {
    const stations = searchStationsByName(search);
    const response: SubwayApiResponse = {
      success: true,
      data: stations.slice(0, limit).map((station) => ({
        stationId: station.stationId,
        stationName: station.stationName,
        lineName: station.lineName,
        lineNumber: getLineNumber(station.lineName),
        lineColor: getLineColor(station.lineName),
        isTransfer: station.isTransfer,
        transferLines: station.transferLines,
        distance: 0,
        walkingTime: 0,
        address: station.address,
      })),
    };
    return NextResponse.json(response);
  }

  // 좌표 기반 검색 모드
  if (!lat || !lng) {
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "lat, lng 파라미터가 필요합니다. 또는 search 파라미터로 역명 검색이 가능합니다.",
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

  console.log(`🚇 지하철역 검색: 좌표 (${latitude}, ${longitude}), 반경: ${radius}km`);

  const nearbyStations = getNearbySubwayStations(latitude, longitude, radius, limit);

  const response: SubwayApiResponse = {
    success: true,
    data: nearbyStations.map((station) => ({
      stationId: station.stationId,
      stationName: station.stationName,
      lineName: station.lineName,
      lineNumber: getLineNumber(station.lineName),
      lineColor: getLineColor(station.lineName),
      isTransfer: station.isTransfer,
      transferLines: station.transferLines,
      distance: Math.round(station.distance * 1000) / 1000, // 소수점 3자리
      walkingTime: station.walkingTime,
      address: station.address,
    })),
  };

  console.log(`✅ 주변 지하철역 ${response.data.length}개 검색 완료`);

  return NextResponse.json(response);
}

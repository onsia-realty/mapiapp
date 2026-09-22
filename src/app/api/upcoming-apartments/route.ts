/**
 * 주변 입주예정 아파트 조회 API
 * GET /api/upcoming-apartments?region={region}&excludeId={excludeId}&limit={limit}
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getNearbyUpcomingApartments,
  getRegionCodeFromAddress,
  UpcomingApartment,
} from "@/lib/api/upcoming-apartments";

export interface UpcomingApartmentsResponse {
  success: boolean;
  data: UpcomingApartment[];
  message?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const region = searchParams.get("region") || "";
  const address = searchParams.get("address") || "";
  const excludeId = searchParams.get("excludeId") || undefined;
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  // 지역코드 결정 (region 파라미터 우선, 없으면 address에서 추출)
  let regionCode = region;
  if (!regionCode && address) {
    regionCode = getRegionCodeFromAddress(address);
  }

  if (!regionCode) {
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "region 또는 address 파라미터가 필요합니다.",
      },
      { status: 400 }
    );
  }

  try {
    console.log(`🏠 입주예정 아파트 조회: 지역코드=${regionCode}, 주소=${address}, 제외=${excludeId}`);

    // 주소 필터를 추가하여 시/구 단위로 정밀 필터링
    const apartments = await getNearbyUpcomingApartments(
      regionCode,
      address, // 주소 기반 필터 추가
      excludeId,
      limit
    );

    return NextResponse.json({
      success: true,
      data: apartments,
    });
  } catch (error) {
    console.error("입주예정 아파트 API 에러:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "입주예정 아파트 정보를 불러오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

/**
 * 아파트 순위 API
 * GET /api/apartment-ranking?address={address}&limit={limit}
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getApartmentRanking,
  ApartmentRankingResult,
} from "@/lib/api/apartment-ranking";

export interface ApartmentRankingResponse {
  success: boolean;
  data: ApartmentRankingResult | null;
  message?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address") || "";
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  if (!address) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "address 파라미터가 필요합니다.",
      },
      { status: 400 }
    );
  }

  try {
    console.log(`📊 아파트 순위 조회: 주소=${address}`);

    const result = await getApartmentRanking(address, limit);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("아파트 순위 API 에러:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "아파트 순위 정보를 불러오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

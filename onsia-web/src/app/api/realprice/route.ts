/**
 * 실거래가 조회 API
 * GET /api/realprice?address={address}&yearMonth={yearMonth}
 */

import { NextRequest, NextResponse } from "next/server";
import { getNearbyRealPrice, calculateAveragePrice } from "@/lib/api/realprice";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const address = searchParams.get("address");
    const yearMonth = searchParams.get("yearMonth") || undefined;

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error: "주소는 필수 파라미터입니다.",
        },
        { status: 400 }
      );
    }

    // 실거래가 API 호출
    const prices = await getNearbyRealPrice(address, yearMonth);

    // 평균 시세 계산
    const averagePrice = calculateAveragePrice(prices);

    return NextResponse.json({
      success: true,
      data: {
        prices: prices,
        averagePrice: averagePrice,
        total: prices.length,
      },
    });
  } catch (error) {
    console.error("실거래가 조회 에러:", error);
    return NextResponse.json(
      {
        success: false,
        error: "실거래가 정보를 불러오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

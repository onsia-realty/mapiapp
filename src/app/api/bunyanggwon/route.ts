/**
 * 분양권 목록 조회 API
 * GET /api/bunyanggwon
 */

import { NextRequest, NextResponse } from "next/server";
import { getApplyHomeList } from "@/lib/api/applyhome";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 쿼리 파라미터 추출
    const params = {
      region: searchParams.get("region") || undefined,
      houseType: searchParams.get("houseType") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      numOfRows: searchParams.get("numOfRows")
        ? parseInt(searchParams.get("numOfRows")!, 10)
        : undefined,
      pageNo: searchParams.get("pageNo")
        ? parseInt(searchParams.get("pageNo")!, 10)
        : undefined,
    };

    // 청약홈 API 호출
    const data = await getApplyHomeList(params);

    return NextResponse.json({
      success: true,
      data: data,
      total: data.length,
    });
  } catch (error) {
    console.error("분양권 목록 조회 에러:", error);
    return NextResponse.json(
      {
        success: false,
        error: "분양권 목록을 불러오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

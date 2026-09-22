/**
 * 분양권 상세 조회 API
 * GET /api/bunyanggwon/[id]
 */

import { NextRequest, NextResponse } from "next/server";
import { getApplyHomeDetail } from "@/lib/api/applyhome";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 청약홈 API 호출
    const data = await getApplyHomeDetail(id);

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "해당 분양권 정보를 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("분양권 상세 조회 에러:", error);
    return NextResponse.json(
      {
        success: false,
        error: "분양권 상세 정보를 불러오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

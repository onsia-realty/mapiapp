/**
 * 특별공급 신청현황 (유형별) 조회 API
 * GET /api/special-supply?id={주택관리번호}
 */

import { NextRequest, NextResponse } from "next/server";
import { getSpecialSupplyStatus } from "@/lib/api/applyhome-competition";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id (주택관리번호) 파라미터가 필요합니다." },
        { status: 400 }
      );
    }

    const data = await getSpecialSupplyStatus(id);

    if (!data) {
      return NextResponse.json(
        { success: false, error: "특별공급 신청현황을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("특별공급 신청현황 조회 에러:", error);
    return NextResponse.json(
      { success: false, error: "특별공급 신청현황을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

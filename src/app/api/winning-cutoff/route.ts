/**
 * 당첨 가점(커트라인) 조회 API
 * GET /api/winning-cutoff?id={주택관리번호}
 */

import { NextRequest, NextResponse } from "next/server";
import { getWinningCutoff } from "@/lib/api/applyhome-winner";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id (주택관리번호) 파라미터가 필요합니다." },
        { status: 400 }
      );
    }

    const data = await getWinningCutoff(id);

    if (!data) {
      return NextResponse.json(
        { success: false, error: "당첨 가점 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("당첨 커트라인 조회 에러:", error);
    return NextResponse.json(
      { success: false, error: "당첨 커트라인을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 공장등록 필지정보 조회 API
 * GET /api/factory-land?fctryNm=&adres=&crmnNm=&prdcArtcl=&pageNo=&numOfRows=
 */

import { NextRequest, NextResponse } from "next/server";
import { searchFactoryLand } from "@/lib/api/factory-land";

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;

    const result = await searchFactoryLand({
      fctryNm: sp.get("fctryNm") || undefined,
      adres: sp.get("adres") || undefined,
      crmnNm: sp.get("crmnNm") || undefined,
      prdcArtcl: sp.get("prdcArtcl") || undefined,
      pageNo: sp.get("pageNo") ? parseInt(sp.get("pageNo")!, 10) : undefined,
      numOfRows: sp.get("numOfRows")
        ? parseInt(sp.get("numOfRows")!, 10)
        : undefined,
      type: sp.get("type") === "json" ? "json" : "xml",
    });

    return NextResponse.json({
      success: true,
      data: result.items,
      total: result.items.length,
    });
  } catch (error) {
    console.error("공장등록 필지정보 조회 에러:", error);
    return NextResponse.json(
      { success: false, error: "필지정보를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

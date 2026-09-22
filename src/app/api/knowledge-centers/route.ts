/**
 * 지식산업센터 목록 조회 API
 * GET /api/knowledge-centers?sido=&sigungu=&saleType=&buildStatus=&keyword=&limit=&offset=
 */

import { NextRequest, NextResponse } from "next/server";
import {
  listKnowledgeCenters,
  getKnowledgeCentersMeta,
} from "@/lib/api/knowledge-centers";
import type { KnowledgeCenterFilter } from "@/lib/api/knowledge-centers";

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const saleType = sp.get("saleType") || undefined;
    const buildStatus = sp.get("buildStatus") || undefined;

    const filter: KnowledgeCenterFilter = {
      sido: sp.get("sido") || undefined,
      sigungu: sp.get("sigungu") || undefined,
      saleType:
        saleType === "분양" || saleType === "분양/임대" || saleType === "all"
          ? saleType
          : undefined,
      buildStatus:
        buildStatus === "건축완료" ||
        buildStatus === "건축중" ||
        buildStatus === "미착공" ||
        buildStatus === "all"
          ? buildStatus
          : undefined,
      keyword: sp.get("keyword") || undefined,
      limit: sp.get("limit") ? parseInt(sp.get("limit")!, 10) : undefined,
      offset: sp.get("offset") ? parseInt(sp.get("offset")!, 10) : undefined,
    };

    const { centers, total } = listKnowledgeCenters(filter);
    const { meta } = getKnowledgeCentersMeta();

    return NextResponse.json({
      success: true,
      data: centers,
      total,
      meta: {
        source: meta.source,
        sourceUrl: meta.sourceUrl,
        referenceDate: meta.referenceDate,
      },
    });
  } catch (error) {
    console.error("지식산업센터 조회 에러:", error);
    return NextResponse.json(
      { success: false, error: "지식산업센터 정보를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

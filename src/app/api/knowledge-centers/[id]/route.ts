/**
 * 지식산업센터 단건 조회 API
 * GET /api/knowledge-centers/[id]
 */

import { NextRequest, NextResponse } from "next/server";
import { getKnowledgeCenter } from "@/lib/api/knowledge-centers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const center = getKnowledgeCenter(id);

  if (!center) {
    return NextResponse.json(
      { success: false, error: "지식산업센터를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: center });
}

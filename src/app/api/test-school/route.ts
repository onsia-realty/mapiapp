import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.DATA_GO_KR_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key not found" });
  }

  const url = `https://api.data.go.kr/openapi/tn_pubr_public_elesch_mskul_lc_api?serviceKey=${apiKey}&pageNo=1&numOfRows=3&type=json&cddcNm=서울특별시교육청`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    return NextResponse.json({
      url: url.replace(apiKey, '***'),
      status: response.status,
      rawResponse: text.substring(0, 2000),
    });
  } catch (error) {
    return NextResponse.json({
      error: String(error),
    });
  }
}

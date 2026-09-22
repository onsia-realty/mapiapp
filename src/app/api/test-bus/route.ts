import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.DATA_GO_KR_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key not found" });
  }

  // 조건 검색으로 용인시 데이터 요청
  const cond = encodeURIComponent('도시명::경기도 용인시');
  const url = `https://api.odcloud.kr/api/15067528/v1/uddi:f74b9799-9db1-4754-a5d0-b66e2ae705f3?page=1&perPage=100&cond[도시명::LIKE]=용인&serviceKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // 경기도 데이터만 필터링
    const gyeonggiData = data.data?.filter((stop: { 도시명: string }) =>
      stop.도시명?.includes("경기도")
    );

    // 용인 데이터 확인
    const yonginData = data.data?.filter((stop: { 도시명: string }) =>
      stop.도시명?.includes("용인")
    );

    return NextResponse.json({
      totalCount: data.totalCount,
      currentCount: data.currentCount,
      gyeonggiCount: gyeonggiData?.length || 0,
      yonginCount: yonginData?.length || 0,
      sample: data.data?.slice(0, 5),
      gyeonggiSample: gyeonggiData?.slice(0, 3),
    });
  } catch (error) {
    return NextResponse.json({
      error: String(error),
    });
  }
}

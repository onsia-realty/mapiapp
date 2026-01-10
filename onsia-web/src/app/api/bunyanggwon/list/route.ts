/**
 * 분양권 목록 API
 * 청약홈 API에서 서울/경기 아파트 목록 조회
 */

import { NextRequest, NextResponse } from "next/server";

interface CheongakItem {
  HOUSE_MANAGE_NO: string;
  HOUSE_NM: string;
  HSSPLY_ADRES: string;
  SUBSCRPT_AREA_CODE_NM: string;
  TOT_SUPLY_HSHLDCO: number;
  MVN_PREARNGE_YM: string;
  CNSTRCT_ENTRPS_NM: string;
  HMPG_ADRES: string;
  RCEPT_BGNDE: string;
  RCEPT_ENDDE: string;
  PBLANC_NO: string;
}

interface BunyanggwonListItem {
  id: string;
  apiId: string;
  propertyName: string;
  address: string;
  region: string;
  district: string;
  totalUnits: number;
  moveInDate: string;
  builder: string;
  homepageUrl: string;
  applicationStart: string;
  applicationEnd: string;
}

// 환경변수에서 API 키 가져오기
function getApiKey(): string {
  const apiKey = process.env.DATA_GO_KR_API_KEY;
  if (!apiKey) {
    throw new Error("DATA_GO_KR_API_KEY 환경변수가 설정되지 않았습니다");
  }
  return apiKey;
}

// 주소에서 구/시 추출
function extractDistrict(address: string): string {
  // "서울특별시 강남구 역삼동" -> "강남구"
  // "경기도 용인시 수지구" -> "용인시 수지구"
  const match = address.match(/(?:서울특별시|경기도|인천광역시)\s+(\S+)/);
  return match ? match[1] : "";
}

// 입주예정월 포맷 변환 (202901 -> 2029년 1월)
function formatMoveInDate(ym: string): string {
  if (!ym || ym.length < 6) return "";
  const year = ym.substring(0, 4);
  const month = parseInt(ym.substring(4, 6), 10);
  return `${year}년 ${month}월`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region") || "경기"; // 기본: 경기
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("perPage") || "20", 10);

    const apiKey = getApiKey();

    // 청약홈 API 호출
    const apiUrl = new URL(
      "https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail"
    );
    apiUrl.searchParams.set("page", page.toString());
    apiUrl.searchParams.set("perPage", perPage.toString());
    apiUrl.searchParams.set("cond[SUBSCRPT_AREA_CODE_NM::EQ]", region);
    apiUrl.searchParams.set("serviceKey", apiKey);

    console.log(`📋 분양권 목록 API 호출: ${region} (page: ${page})`);

    const response = await fetch(apiUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`청약홈 API 오류: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      return NextResponse.json({
        success: true,
        data: [],
        totalCount: 0,
        message: "조회된 데이터가 없습니다",
      });
    }

    // 데이터 변환
    const items: BunyanggwonListItem[] = data.data.map(
      (item: CheongakItem, index: number) => ({
        id: `BUN${String(index + 1).padStart(3, "0")}`,
        apiId: item.HOUSE_MANAGE_NO,
        propertyName: item.HOUSE_NM,
        address: item.HSSPLY_ADRES,
        region: item.SUBSCRPT_AREA_CODE_NM,
        district: extractDistrict(item.HSSPLY_ADRES),
        totalUnits: item.TOT_SUPLY_HSHLDCO || 0,
        moveInDate: formatMoveInDate(item.MVN_PREARNGE_YM),
        builder: item.CNSTRCT_ENTRPS_NM || "",
        homepageUrl: item.HMPG_ADRES || "",
        applicationStart: item.RCEPT_BGNDE || "",
        applicationEnd: item.RCEPT_ENDDE || "",
      })
    );

    console.log(`✅ 분양권 목록 ${items.length}건 조회 완료`);

    return NextResponse.json({
      success: true,
      data: items,
      totalCount: data.matchCount || items.length,
      page,
      perPage,
    });
  } catch (error) {
    console.error("❌ 분양권 목록 API 에러:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "분양권 목록 조회 중 오류가 발생했습니다",
        data: [],
      },
      { status: 500 }
    );
  }
}

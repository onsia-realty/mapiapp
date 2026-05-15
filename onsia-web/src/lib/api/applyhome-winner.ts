/**
 * 청약홈 당첨 가점 정보 조회 API (커트라인)
 * 공공데이터포털: 한국부동산원_청약홈 청약접수 경쟁률 및 특별공급 신청현황 조회 서비스
 * 데이터 ID: 15098905
 * 엔드포인트: ApplyhomeInfoCmpetRtSvc/v1/getAptLttotPblancScore
 */

import { WinningCutoffData, WinningCutoffByType } from "@/types/api";

const getApiKey = () => process.env.DATA_GO_KR_API_KEY || "";
const BASE_URL = "https://api.odcloud.kr/api/ApplyhomeInfoCmpetRtSvc/v1";

const RESIDE_SECD_MAP: Record<string, "해당지역" | "기타경기" | "기타지역"> = {
  "01": "해당지역",
  "02": "기타지역",
  "03": "기타경기",
};

/**
 * 주택관리번호로 당첨 가점(커트라인) 조회
 * @param houseManageNo 주택관리번호 (예: "2025000123")
 * @returns 주택형 × 거주지역별 가점 정보
 */
export async function getWinningCutoff(
  houseManageNo: string
): Promise<WinningCutoffData | null> {
  try {
    const queryParams = new URLSearchParams({
      page: "1",
      perPage: "100",
      serviceKey: getApiKey(),
    });
    queryParams.append("cond[HOUSE_MANAGE_NO::EQ]", houseManageNo);

    console.log("🎯 당첨 커트라인 API 호출:", { houseManageNo });

    const response = await fetch(
      `${BASE_URL}/getAptLttotPblancScore?${queryParams.toString()}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error("당첨 커트라인 API 응답 실패:", response.status);
      return null;
    }

    const data = await response.json();
    const items: any[] = data.data || [];

    if (items.length === 0) {
      console.log("⚠️ 당첨 가점 정보 없음:", houseManageNo);
      return null;
    }

    const scoresByType: WinningCutoffByType[] = items.map((item) => ({
      houseType: item.HOUSE_TY || "",
      residenceArea: RESIDE_SECD_MAP[item.RESIDE_SECD] || item.RESIDE_SENM || "",
      residenceCode: item.RESIDE_SECD || "",
      lowestScore: parseFloat(item.LWET_SCORE || "0") || 0,
      highestScore: parseFloat(item.TOP_SCORE || "0") || 0,
      averageScore: parseFloat(item.AVRG_SCORE || "0") || 0,
    }));

    // 전체 요약 계산 (점수 0인 항목 제외)
    const validScores = scoresByType.filter((s) => s.lowestScore > 0);
    const summary =
      validScores.length > 0
        ? {
            overallLowest: Math.min(...validScores.map((s) => s.lowestScore)),
            overallHighest: Math.max(...validScores.map((s) => s.highestScore)),
            overallAverage:
              validScores.reduce((sum, s) => sum + s.averageScore, 0) /
              validScores.length,
          }
        : undefined;

    console.log(
      `✅ 당첨 커트라인 ${scoresByType.length}건 조회 완료 (유효 ${validScores.length}건)`
    );

    return {
      houseManageNo: items[0].HOUSE_MANAGE_NO || houseManageNo,
      pblancNo: items[0].PBLANC_NO || "",
      scoresByType,
      summary,
    };
  } catch (error) {
    console.error("❌ 당첨 커트라인 조회 에러:", error);
    return null;
  }
}

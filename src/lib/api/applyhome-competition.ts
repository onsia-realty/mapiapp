/**
 * 청약홈 특별공급 신청현황 조회 API (유형별)
 * 공공데이터포털: 한국부동산원_청약홈 청약접수 경쟁률 및 특별공급 신청현황 조회 서비스
 * 데이터 ID: 15098905
 * 엔드포인트: ApplyhomeInfoCmpetRtSvc/v1/getAPTSpsplyReqstStus
 */

import { SpecialSupplyData, SpecialSupplyByType } from "@/types/api";

const getApiKey = () => process.env.DATA_GO_KR_API_KEY || "";
const BASE_URL = "https://api.odcloud.kr/api/ApplyhomeInfoCmpetRtSvc/v1";

const toInt = (v: any): number => {
  const n = parseInt(v ?? "0", 10);
  return Number.isFinite(n) ? n : 0;
};

/**
 * 주택관리번호로 특별공급 신청현황(유형별) 조회
 * @param houseManageNo 주택관리번호
 * @returns 주택형별 특별공급 배정 + 유형별 합계
 */
export async function getSpecialSupplyStatus(
  houseManageNo: string
): Promise<SpecialSupplyData | null> {
  try {
    const queryParams = new URLSearchParams({
      page: "1",
      perPage: "100",
      serviceKey: getApiKey(),
    });
    queryParams.append("cond[HOUSE_MANAGE_NO::EQ]", houseManageNo);

    console.log("🎁 특별공급 신청현황 API 호출:", { houseManageNo });

    const response = await fetch(
      `${BASE_URL}/getAPTSpsplyReqstStus?${queryParams.toString()}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error("특별공급 API 응답 실패:", response.status);
      return null;
    }

    const data = await response.json();
    const items: any[] = data.data || [];

    if (items.length === 0) {
      console.log("⚠️ 특별공급 신청현황 정보 없음:", houseManageNo);
      return null;
    }

    const byType: SpecialSupplyByType[] = items.map((item) => ({
      houseType: item.HOUSE_TY || "",
      totalSpecialUnits: toInt(item.SPSPLY_HSHLDCO),
      multiChild: toInt(item.MNYCH_HSHLDCO),
      newlywed: toInt(item.NWWDS_NMTW_HSHLDCO),
      firstTime: toInt(item.LFE_FRST_HSHLDCO),
      youth: toInt(item.YGMN_HSHLDCO),
      oldParents: toInt(item.OLD_PARNTS_SUPORT_HSHLDCO),
      agencyRecommend: toInt(item.INSTT_RECOMEND_HSHLDCO),
      resultName: item.SUBSCRPT_RESULT_NM || undefined,
    }));

    // 유형별 전체 합계
    const totals = byType.reduce(
      (acc, t) => ({
        multiChild: acc.multiChild + t.multiChild,
        newlywed: acc.newlywed + t.newlywed,
        firstTime: acc.firstTime + t.firstTime,
        youth: acc.youth + t.youth,
        oldParents: acc.oldParents + t.oldParents,
        agencyRecommend: acc.agencyRecommend + t.agencyRecommend,
        totalSpecialUnits: acc.totalSpecialUnits + t.totalSpecialUnits,
      }),
      {
        multiChild: 0,
        newlywed: 0,
        firstTime: 0,
        youth: 0,
        oldParents: 0,
        agencyRecommend: 0,
        totalSpecialUnits: 0,
      }
    );

    console.log(`✅ 특별공급 신청현황 ${byType.length}건 조회 완료`);

    return {
      houseManageNo: items[0].HOUSE_MANAGE_NO || houseManageNo,
      pblancNo: items[0].PBLANC_NO || "",
      byType,
      totals,
    };
  } catch (error) {
    console.error("❌ 특별공급 신청현황 조회 에러:", error);
    return null;
  }
}

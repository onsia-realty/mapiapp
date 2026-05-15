/**
 * 지식산업센터 데이터 (CSV 시드 기반)
 * 출처: 한국산업단지공단_전국지식산업센터현황 (data.go.kr 15117154)
 *
 * 변환 스크립트: scripts/convert-knowledge-centers.mjs
 * 데이터 갱신 시: 새 CSV 다운로드 → node scripts/convert-knowledge-centers.mjs <CSV경로>
 */

import knowledgeCentersData from "@/data/knowledge-centers.json";
import type { KnowledgeCenterData } from "@/types/api";

interface KnowledgeCentersJson {
  meta: {
    source: string;
    sourceUrl: string;
    referenceDate: string;
    generatedAt: string;
    totalRowsInCsv: number;
    filteredCount: number;
    filterCondition: string;
  };
  stats: {
    bySaleType: Record<string, number>;
    byBuildStatus: Record<string, number>;
    bySido: Record<string, number>;
  };
  centers: KnowledgeCenterData[];
}

const data = knowledgeCentersData as KnowledgeCentersJson;

export interface KnowledgeCenterFilter {
  sido?: string; // 시도 (예: "서울특별시")
  sigungu?: string; // 시군구 부분일치
  saleType?: "분양" | "분양/임대" | "all";
  buildStatus?: "건축완료" | "건축중" | "미착공" | "all";
  keyword?: string; // 단지명/주소 검색
  limit?: number;
  offset?: number;
}

/**
 * 지식산업센터 목록 조회 (필터링)
 */
export function listKnowledgeCenters(filter: KnowledgeCenterFilter = {}): {
  centers: KnowledgeCenterData[];
  total: number;
} {
  const { sido, sigungu, saleType, buildStatus, keyword, limit, offset } =
    filter;

  let result = data.centers;

  if (sido) {
    result = result.filter((c) => c.sido === sido);
  }
  if (sigungu) {
    result = result.filter((c) => c.sigungu.includes(sigungu));
  }
  if (saleType && saleType !== "all") {
    result = result.filter((c) => c.saleType === saleType);
  }
  if (buildStatus && buildStatus !== "all") {
    result = result.filter((c) => c.buildStatus === buildStatus);
  }
  if (keyword) {
    const kw = keyword.toLowerCase();
    result = result.filter(
      (c) =>
        c.centerName.toLowerCase().includes(kw) ||
        c.complexName.toLowerCase().includes(kw) ||
        c.roadAddress.toLowerCase().includes(kw) ||
        c.jibunAddress.toLowerCase().includes(kw)
    );
  }

  const total = result.length;

  if (typeof offset === "number" && offset > 0) {
    result = result.slice(offset);
  }
  if (typeof limit === "number" && limit > 0) {
    result = result.slice(0, limit);
  }

  return { centers: result, total };
}

/**
 * 단일 지식산업센터 조회
 */
export function getKnowledgeCenter(id: string): KnowledgeCenterData | null {
  return data.centers.find((c) => c.id === id) ?? null;
}

/**
 * 메타데이터 (출처/통계)
 */
export function getKnowledgeCentersMeta() {
  return { meta: data.meta, stats: data.stats };
}

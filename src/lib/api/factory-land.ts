/**
 * 한국산업단지공단_공장등록필지정보조회 OpenAPI
 * 공공데이터포털: data.go.kr/data/15087615
 *
 * Base URL: http://apis.data.go.kr/B550624/fctryRegistLndpclInfo
 * Endpoint: /getFctryLndpclService
 *
 * 검색 조건: 회사명, 주소, 대표자명, 생산품목
 *
 * 주의: API 응답 필드는 첫 실호출 후 명세에 맞춰 조정 필요.
 * 우선 raw 응답을 그대로 반환하고, 흔한 필드만 맵핑 시도.
 */

import { parseString } from "xml2js";
import { promisify } from "util";
import type { FactoryLandData } from "@/types/api";

const parseXML = promisify(parseString);
const getApiKey = () => process.env.DATA_GO_KR_API_KEY || "";
const BASE_URL =
  "http://apis.data.go.kr/B550624/fctryRegistLndpclInfo/getFctryLndpclService";

export interface FactoryLandSearchParams {
  /** 회사/공장명 */
  fctryNm?: string;
  /** 주소 */
  adres?: string;
  /** 대표자명 */
  crmnNm?: string;
  /** 생산품목 */
  prdcArtcl?: string;
  /** 페이지 번호 */
  pageNo?: number;
  /** 페이지당 결과 수 */
  numOfRows?: number;
  /** 응답 형식: json | xml (기본 xml) */
  type?: "json" | "xml";
}

/**
 * 공장등록 필지정보 조회
 */
export async function searchFactoryLand(
  params: FactoryLandSearchParams = {}
): Promise<{ items: FactoryLandData[]; raw: any }> {
  try {
    const queryParams = new URLSearchParams({
      serviceKey: getApiKey(),
      pageNo: String(params.pageNo ?? 1),
      numOfRows: String(params.numOfRows ?? 10),
    });

    if (params.fctryNm) queryParams.append("fctryNm", params.fctryNm);
    if (params.adres) queryParams.append("adres", params.adres);
    if (params.crmnNm) queryParams.append("crmnNm", params.crmnNm);
    if (params.prdcArtcl) queryParams.append("prdcArtcl", params.prdcArtcl);
    if (params.type === "json") queryParams.append("_type", "json");

    console.log("🏭 공장등록 필지정보 API 호출:", {
      url: BASE_URL,
      params: Object.fromEntries(queryParams),
    });

    const response = await fetch(`${BASE_URL}?${queryParams.toString()}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error("필지정보 API 응답 실패:", response.status);
      return { items: [], raw: null };
    }

    const text = await response.text();

    // JSON 응답
    if (params.type === "json" || text.trim().startsWith("{")) {
      const json = JSON.parse(text);
      const items = extractItemsFromJson(json);
      return { items: items.map(mapToFactoryLand), raw: json };
    }

    // XML 응답 (기본)
    const parsed: any = await parseXML(text);
    const items = extractItemsFromXml(parsed);
    return { items: items.map(mapToFactoryLand), raw: parsed };
  } catch (error) {
    console.error("❌ 필지정보 조회 에러:", error);
    return { items: [], raw: null };
  }
}

function extractItemsFromJson(json: any): any[] {
  const items =
    json?.response?.body?.items?.item ??
    json?.response?.body?.items ??
    json?.items ??
    [];
  return Array.isArray(items) ? items : [items];
}

function extractItemsFromXml(parsed: any): any[] {
  const items =
    parsed?.response?.body?.items?.item ??
    parsed?.response?.body?.items ??
    [];
  return Array.isArray(items) ? items : items ? [items] : [];
}

/**
 * Raw item → 표준 FactoryLandData (흔한 필드명 맵핑 시도, 누락은 raw 보존)
 */
function mapToFactoryLand(item: any): FactoryLandData {
  const num = (v: any) => {
    const n = parseFloat(String(v ?? "").replace(/[, ]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  };

  return {
    factoryName: item.fctryNm || item.factoryName || item.공장명 || undefined,
    representative:
      item.crmnNm || item.representative || item.대표자 || undefined,
    industryCode: item.indtyCd || item.industryCode || undefined,
    industryName:
      item.indtyNm || item.industryName || item.업종명 || undefined,
    address: item.adres || item.roadAdres || item.address || undefined,
    jibun: item.jibun || item.lnm || undefined,
    landArea: num(item.lndpclAr) ?? num(item.용지면적),
    buildingArea: num(item.bldngAr) ?? num(item.건축면적),
    registrationStatus:
      item.regstrSttus || item.registrationStatus || undefined,
    complexName: item.cmpnyNm || item.complexName || undefined,
    raw: item,
  };
}

/**
 * 아파트 순위 API
 * 복합 점수 기반 + 카테고리별 순위
 *
 * 복합 점수 = (거래량 × 0.4) + (평당가 순위 × 0.3) + (상승률 × 0.3)
 * 카테고리: 매매 평당가, 전세 평당가, 거래량
 */

import { extractLocationFromAddress } from "./upcoming-apartments";

const API_KEY = process.env.DATA_GO_KR_API_KEY || "";
const TRADE_API_URL =
  "https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade";
const RENT_API_URL =
  "https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent";

/**
 * 지역 코드 맵 (법정동코드 5자리)
 */
const REGION_CODE_MAP: { [key: string]: string } = {
  // 용인시
  "용인시 처인구": "41461",
  "용인시 기흥구": "41463",
  "용인시 수지구": "41465",
  // 성남시
  "성남시 분당구": "41135",
  "성남시 수정구": "41131",
  "성남시 중원구": "41133",
  // 수원시
  "수원시 장안구": "41111",
  "수원시 권선구": "41113",
  "수원시 팔달구": "41115",
  "수원시 영통구": "41117",
  // 화성시
  화성시: "41590",
  // 평택시
  평택시: "41220",
  // 서울
  강남구: "11680",
  서초구: "11650",
  송파구: "11710",
  강동구: "11740",
  마포구: "11440",
  용산구: "11170",
  // 기타
  분당구: "41135",
  처인구: "41461",
  기흥구: "41463",
  수지구: "41465",
};

/**
 * 주소에서 지역코드 추출
 */
export function getRegionCodeForRanking(address: string): string {
  const location = extractLocationFromAddress(address);

  if (location.city && location.district) {
    const fullKey = `${location.city} ${location.district}`;
    if (REGION_CODE_MAP[fullKey]) {
      return REGION_CODE_MAP[fullKey];
    }
  }

  if (location.district && REGION_CODE_MAP[location.district]) {
    return REGION_CODE_MAP[location.district];
  }

  if (location.city && REGION_CODE_MAP[location.city]) {
    return REGION_CODE_MAP[location.city];
  }

  return "";
}

/**
 * 지역명 생성
 */
export function getRegionName(address: string): string {
  const location = extractLocationFromAddress(address);

  if (location.city && location.district) {
    return `${location.city} ${location.district}`;
  }

  return location.city || location.district || "해당 지역";
}

/**
 * 순위 카테고리
 */
export type RankingCategory = "composite" | "tradePricePerPyeong" | "jeonsePrice" | "monthlyRentPrice" | "tradeVolume";

/**
 * 아파트 순위 정보 (확장)
 */
export interface ApartmentRanking {
  rank: number;
  name: string;
  district: string; // 동 이름
  avgPrice: number; // 평균가 (만원)
  pricePerPyeong: number; // 평당가 (만원)
  transactionCount: number; // 거래건수
  changePercent?: number; // 전월대비 변동률 (%)
  compositeScore?: number; // 복합 점수 (0-100)
  // 세부 점수
  volumeScore?: number; // 거래량 점수
  priceScore?: number; // 평당가 점수
  changeScore?: number; // 상승률 점수
  // 월세 전용 필드
  monthlyRentDeposit?: number; // 월세 보증금 (만원)
  monthlyRentAmount?: number; // 월세 금액 (만원)
}

/**
 * 카테고리별 순위 결과
 */
export interface CategoryRankings {
  composite: ApartmentRanking[]; // 복합 점수 순위
  tradePricePerPyeong: ApartmentRanking[]; // 매매 평당가 순위
  jeonsePrice: ApartmentRanking[]; // 전세 평당가 순위
  monthlyRentPrice: ApartmentRanking[]; // 월세 평당가 순위
  tradeVolume: ApartmentRanking[]; // 거래량 순위
}

/**
 * 아파트 순위 조회 결과
 */
export interface ApartmentRankingResult {
  regionName: string;
  period: string;
  rankings: ApartmentRanking[]; // 기본: 복합 점수 순위
  categoryRankings: CategoryRankings; // 카테고리별 순위
}

/**
 * 실거래가 데이터 기반 아파트 순위 조회
 */
export async function getApartmentRanking(
  address: string,
  limit: number = 5
): Promise<ApartmentRankingResult> {
  const regionName = getRegionName(address);
  const regionCode = getRegionCodeForRanking(address);

  // 기간 설정 (최근 3개월)
  const now = new Date();
  const periods = getRecentPeriods(now, 3);
  const periodDisplay = `${periods[0].year}.${String(periods[0].month).padStart(2, "0")}`;

  console.log(`📊 아파트 순위 조회: ${regionName} (코드: ${regionCode})`);

  // API 호출
  if (regionCode && API_KEY) {
    try {
      // 매매/전세 데이터 병렬 조회
      const [tradeData, rentData] = await Promise.all([
        fetchTradeData(regionCode, periods),
        fetchRentData(regionCode, periods),
      ]);

      if (tradeData.length > 0 || rentData.length > 0) {
        const categoryRankings = calculateCategoryRankings(tradeData, rentData, limit);

        console.log(`✅ 실거래가 기반 순위 조회 완료`);
        return {
          regionName,
          period: periodDisplay,
          rankings: categoryRankings.composite,
          categoryRankings,
        };
      }
    } catch (error) {
      console.error("❌ 실거래가 API 에러:", error);
    }
  }

  // Fallback: Mock 데이터
  console.log(`ℹ️ Mock 데이터 사용: ${regionName}`);
  const mockRankings = generateMockRankings(regionName, limit);

  return {
    regionName,
    period: periodDisplay,
    rankings: mockRankings.composite,
    categoryRankings: mockRankings,
  };
}

/**
 * 최근 N개월 기간 목록 생성
 */
function getRecentPeriods(now: Date, months: number): { year: number; month: number }[] {
  const periods = [];
  for (let i = 1; i <= months; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    periods.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    });
  }
  return periods;
}

/**
 * 매매 실거래가 데이터 조회
 */
async function fetchTradeData(
  regionCode: string,
  periods: { year: number; month: number }[]
): Promise<RawApartmentData[]> {
  const allData: RawApartmentData[] = [];

  for (const period of periods) {
    try {
      const dealYm = `${period.year}${String(period.month).padStart(2, "0")}`;
      const queryParams = new URLSearchParams({
        serviceKey: API_KEY,
        LAWD_CD: regionCode,
        DEAL_YMD: dealYm,
        pageNo: "1",
        numOfRows: "500",
      });

      const response = await fetch(`${TRADE_API_URL}?${queryParams.toString()}`, {
        next: { revalidate: 86400 },
      });

      if (response.ok) {
        const text = await response.text();
        const data = parseTradeXml(text, period);
        allData.push(...data);
      }
    } catch (error) {
      console.error(`매매 데이터 조회 실패 (${period.year}.${period.month}):`, error);
    }
  }

  return allData;
}

/**
 * 전월세 실거래가 데이터 조회
 */
async function fetchRentData(
  regionCode: string,
  periods: { year: number; month: number }[]
): Promise<RawApartmentData[]> {
  const allData: RawApartmentData[] = [];

  for (const period of periods) {
    try {
      const dealYm = `${period.year}${String(period.month).padStart(2, "0")}`;
      const queryParams = new URLSearchParams({
        serviceKey: API_KEY,
        LAWD_CD: regionCode,
        DEAL_YMD: dealYm,
        pageNo: "1",
        numOfRows: "500",
      });

      console.log(`🏠 전월세 API 호출: ${RENT_API_URL}?LAWD_CD=${regionCode}&DEAL_YMD=${dealYm}`);

      const response = await fetch(`${RENT_API_URL}?${queryParams.toString()}`, {
        next: { revalidate: 86400 },
      });

      console.log(`📡 전월세 API 응답: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const text = await response.text();
        // 에러 응답 체크 (000 = 성공)
        if (text.includes("<resultCode>") && !text.includes("<resultCode>000</resultCode>")) {
          const errorCode = extractXmlValue(text, "resultCode");
          const errorMsg = extractXmlValue(text, "resultMsg");
          console.error(`❌ 전월세 API 에러: ${errorCode} - ${errorMsg}`);
          continue;
        }
        const data = parseRentXml(text, period);
        allData.push(...data);
        console.log(`✅ 전월세 ${period.year}.${period.month}: ${data.length}건`);
      } else {
        console.error(`❌ 전월세 API HTTP 에러: ${response.status}`);
      }
    } catch (error) {
      console.error(`전월세 데이터 조회 실패 (${period.year}.${period.month}):`, error);
    }
  }

  console.log(`📊 전월세 데이터 총계: ${allData.length}건`);
  return allData;
}

/**
 * 원시 아파트 데이터
 */
interface RawApartmentData {
  name: string;
  district: string;
  price: number; // 매매가 또는 전세 보증금
  area: number;
  year: number;
  month: number;
  type: "trade" | "jeonse" | "monthlyRent";
  deposit?: number; // 월세 보증금
  monthlyRentAmount?: number; // 월세 금액
}

/**
 * 매매 XML 파싱
 */
function parseTradeXml(
  xml: string,
  period: { year: number; month: number }
): RawApartmentData[] {
  const data: RawApartmentData[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;

  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const name = extractXmlValue(item, "aptNm") || "";
    const district = extractXmlValue(item, "umdNm") || "";
    const priceStr = (extractXmlValue(item, "dealAmount") || "0").replace(/,/g, "");
    const price = parseInt(priceStr) || 0;
    const area = parseFloat(extractXmlValue(item, "excluUseAr") || "0") || 0;

    if (name && price > 0) {
      data.push({
        name,
        district,
        price,
        area,
        year: period.year,
        month: period.month,
        type: "trade",
      });
    }
  }

  return data;
}

/**
 * 전월세 XML 파싱
 * 전세: 월세가 0인 경우 (보증금만)
 * 월세: 월세가 있는 경우 (보증금/월세)
 */
function parseRentXml(
  xml: string,
  period: { year: number; month: number }
): RawApartmentData[] {
  const data: RawApartmentData[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;

  let jeonseCount = 0;
  let monthlyCount = 0;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const name = extractXmlValue(item, "aptNm") || "";
    const district = extractXmlValue(item, "umdNm") || "";

    // 보증금과 월세 추출
    const depositStr = (extractXmlValue(item, "deposit") || "0").replace(/,/g, "").trim();
    const monthlyRentStr = (extractXmlValue(item, "monthlyRent") || "0").replace(/,/g, "").trim();
    const depositAmount = parseInt(depositStr) || 0;
    const monthlyRentAmount = parseInt(monthlyRentStr) || 0;
    const area = parseFloat(extractXmlValue(item, "excluUseAr") || "0") || 0;

    if (name && depositAmount > 0) {
      if (monthlyRentAmount === 0) {
        // 전세: 월세가 0인 경우 (보증금만)
        jeonseCount++;
        data.push({
          name,
          district,
          price: depositAmount, // 전세 보증금
          area,
          year: period.year,
          month: period.month,
          type: "jeonse",
        });
      } else {
        // 월세: 보증금/월세 형태
        monthlyCount++;
        data.push({
          name,
          district,
          price: 0, // 월세는 price 안씀
          area,
          year: period.year,
          month: period.month,
          type: "monthlyRent",
          deposit: depositAmount, // 보증금
          monthlyRentAmount: monthlyRentAmount, // 월세
        });
      }
    }
  }

  console.log(`📋 전월세 파싱: 전세 ${jeonseCount}건, 월세 ${monthlyCount}건`);
  return data;
}

/**
 * XML 태그 값 추출
 */
function extractXmlValue(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}>([^<]*)</${tag}>`);
  const match = regex.exec(xml);
  return match ? match[1].trim() : null;
}

/**
 * 아파트별 집계 데이터
 */
interface AggregatedApartment {
  name: string;
  district: string;
  // 매매
  tradeCount: number;
  tradeTotalPrice: number;
  tradeTotalArea: number;
  tradePricePerPyeong: number;
  // 전세
  jeonseCount: number;
  jeonseTotalPrice: number;
  jeonseTotalArea: number;
  jeonseAvgPrice: number; // 전세 평균가 (만원)
  // 월세
  monthlyRentCount: number;
  monthlyRentTotalDeposit: number; // 보증금 합계
  monthlyRentTotalAmount: number; // 월세 합계
  monthlyRentAvgDeposit: number; // 평균 보증금 (만원)
  monthlyRentAvgAmount: number; // 평균 월세 (만원)
  // 변동률 (최근월 vs 이전월)
  tradeChangePercent: number;
  // 점수
  volumeScore: number;
  priceScore: number;
  changeScore: number;
  compositeScore: number;
}

/**
 * 카테고리별 순위 계산
 */
function calculateCategoryRankings(
  tradeData: RawApartmentData[],
  rentData: RawApartmentData[],
  limit: number
): CategoryRankings {
  // 1. 아파트별 집계
  const aggregated = aggregateByApartment(tradeData, rentData);
  const apartments = Object.values(aggregated);

  if (apartments.length === 0) {
    return {
      composite: [],
      tradePricePerPyeong: [],
      jeonsePrice: [],
      monthlyRentPrice: [],
      tradeVolume: [],
    };
  }

  // 2. 점수 계산을 위한 최대/최소값
  const totalVolumes = apartments.map((a) => a.tradeCount + a.jeonseCount + a.monthlyRentCount);
  const maxVolume = Math.max(...totalVolumes);
  const maxPrice = Math.max(...apartments.map((a) => a.tradePricePerPyeong));
  const maxChange = Math.max(...apartments.map((a) => Math.abs(a.tradeChangePercent)));

  // 3. 복합 점수 계산
  apartments.forEach((apt) => {
    const totalVolume = apt.tradeCount + apt.jeonseCount + apt.monthlyRentCount;
    apt.volumeScore = maxVolume > 0 ? (totalVolume / maxVolume) * 100 : 0;
    apt.priceScore = maxPrice > 0 ? (apt.tradePricePerPyeong / maxPrice) * 100 : 0;
    apt.changeScore = maxChange > 0
      ? ((apt.tradeChangePercent + maxChange) / (2 * maxChange)) * 100
      : 50;

    // 복합 점수 = 거래량(40%) + 평당가(30%) + 상승률(30%)
    apt.compositeScore =
      apt.volumeScore * 0.4 +
      apt.priceScore * 0.3 +
      apt.changeScore * 0.3;
  });

  // 4. 카테고리별 정렬 및 순위 부여
  const toRanking = (apt: AggregatedApartment, rank: number, priceType: "trade" | "jeonse" | "monthlyRent" = "trade"): ApartmentRanking => {
    let avgPrice = 0;
    let pricePerPyeong = 0;
    let transactionCount = apt.tradeCount + apt.jeonseCount + apt.monthlyRentCount;
    let monthlyRentDeposit: number | undefined;
    let monthlyRentAmount: number | undefined;

    if (priceType === "trade") {
      avgPrice = apt.tradeCount > 0 ? Math.round(apt.tradeTotalPrice / apt.tradeCount) : 0;
      pricePerPyeong = apt.tradePricePerPyeong;
      transactionCount = apt.tradeCount;
    } else if (priceType === "jeonse") {
      // 전세: 실제 전세가 그대로 (평당가 환산 X)
      avgPrice = apt.jeonseAvgPrice; // 평균 전세가
      pricePerPyeong = 0; // 평당가 안씀
      transactionCount = apt.jeonseCount;
    } else if (priceType === "monthlyRent") {
      // 월세: 보증금/월세 형식
      avgPrice = 0; // avgPrice 안씀
      pricePerPyeong = 0; // 평당가 안씀
      transactionCount = apt.monthlyRentCount;
      monthlyRentDeposit = apt.monthlyRentAvgDeposit; // 평균 보증금
      monthlyRentAmount = apt.monthlyRentAvgAmount; // 평균 월세
    }

    return {
      rank,
      name: apt.name,
      district: apt.district,
      avgPrice,
      pricePerPyeong,
      transactionCount,
      changePercent: apt.tradeChangePercent,
      compositeScore: Math.round(apt.compositeScore * 10) / 10,
      volumeScore: Math.round(apt.volumeScore * 10) / 10,
      priceScore: Math.round(apt.priceScore * 10) / 10,
      changeScore: Math.round(apt.changeScore * 10) / 10,
      monthlyRentDeposit,
      monthlyRentAmount,
    };
  };

  // 복합 점수 순위
  const composite = [...apartments]
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .slice(0, limit)
    .map((apt, i) => toRanking(apt, i + 1, "trade"));

  // 매매 평당가 순위
  const tradePricePerPyeong = [...apartments]
    .filter((a) => a.tradePricePerPyeong > 0)
    .sort((a, b) => b.tradePricePerPyeong - a.tradePricePerPyeong)
    .slice(0, limit)
    .map((apt, i) => toRanking(apt, i + 1, "trade"));

  // 전세 순위 (실제 전세가 기준)
  const jeonsePrice = [...apartments]
    .filter((a) => a.jeonseAvgPrice > 0)
    .sort((a, b) => b.jeonseAvgPrice - a.jeonseAvgPrice)
    .slice(0, limit)
    .map((apt, i) => toRanking(apt, i + 1, "jeonse"));

  // 월세 순위 (보증금 기준 정렬)
  const monthlyRentPrice = [...apartments]
    .filter((a) => a.monthlyRentCount > 0)
    .sort((a, b) => b.monthlyRentAvgDeposit - a.monthlyRentAvgDeposit)
    .slice(0, limit)
    .map((apt, i) => toRanking(apt, i + 1, "monthlyRent"));

  // 거래량 순위 (매매+전세+월세 합계)
  const tradeVolume = [...apartments]
    .sort((a, b) =>
      (b.tradeCount + b.jeonseCount + b.monthlyRentCount) -
      (a.tradeCount + a.jeonseCount + a.monthlyRentCount)
    )
    .slice(0, limit)
    .map((apt, i) => toRanking(apt, i + 1, "trade"));

  return {
    composite,
    tradePricePerPyeong,
    jeonsePrice,
    monthlyRentPrice,
    tradeVolume,
  };
}

/**
 * 아파트별 데이터 집계
 */
function aggregateByApartment(
  tradeData: RawApartmentData[],
  rentData: RawApartmentData[]
): { [key: string]: AggregatedApartment } {
  const aggregated: { [key: string]: AggregatedApartment } = {};

  const createEmptyApartment = (name: string, district: string): AggregatedApartment => ({
    name,
    district,
    // 매매
    tradeCount: 0,
    tradeTotalPrice: 0,
    tradeTotalArea: 0,
    tradePricePerPyeong: 0,
    // 전세
    jeonseCount: 0,
    jeonseTotalPrice: 0,
    jeonseTotalArea: 0,
    jeonseAvgPrice: 0,
    // 월세
    monthlyRentCount: 0,
    monthlyRentTotalDeposit: 0,
    monthlyRentTotalAmount: 0,
    monthlyRentAvgDeposit: 0,
    monthlyRentAvgAmount: 0,
    // 변동률
    tradeChangePercent: 0,
    // 점수
    volumeScore: 0,
    priceScore: 0,
    changeScore: 0,
    compositeScore: 0,
  });

  // 매매 데이터 집계
  tradeData.forEach((item) => {
    if (!aggregated[item.name]) {
      aggregated[item.name] = createEmptyApartment(item.name, item.district);
    }
    aggregated[item.name].tradeCount += 1;
    aggregated[item.name].tradeTotalPrice += item.price;
    aggregated[item.name].tradeTotalArea += item.area;
  });

  // 전월세 데이터 집계 (전세/월세 분리)
  rentData.forEach((item) => {
    if (!aggregated[item.name]) {
      aggregated[item.name] = createEmptyApartment(item.name, item.district);
    }

    if (item.type === "jeonse") {
      // 전세: 보증금만
      aggregated[item.name].jeonseCount += 1;
      aggregated[item.name].jeonseTotalPrice += item.price; // 전세 보증금
      aggregated[item.name].jeonseTotalArea += item.area;
    } else if (item.type === "monthlyRent") {
      // 월세: 보증금 + 월세
      aggregated[item.name].monthlyRentCount += 1;
      aggregated[item.name].monthlyRentTotalDeposit += item.deposit || 0; // 보증금
      aggregated[item.name].monthlyRentTotalAmount += item.monthlyRentAmount || 0; // 월세
    }
  });

  // 평균 계산
  Object.values(aggregated).forEach((apt) => {
    // 매매 평당가
    if (apt.tradeCount > 0) {
      const avgPrice = apt.tradeTotalPrice / apt.tradeCount;
      const avgArea = apt.tradeTotalArea / apt.tradeCount;
      const pyeong = avgArea / 3.3058;
      apt.tradePricePerPyeong = pyeong > 0 ? Math.round(avgPrice / pyeong) : 0;
    }

    // 전세 평균가 (실제 전세가 그대로)
    if (apt.jeonseCount > 0) {
      apt.jeonseAvgPrice = Math.round(apt.jeonseTotalPrice / apt.jeonseCount);
    }

    // 월세 평균 (보증금/월세)
    if (apt.monthlyRentCount > 0) {
      apt.monthlyRentAvgDeposit = Math.round(apt.monthlyRentTotalDeposit / apt.monthlyRentCount);
      apt.monthlyRentAvgAmount = Math.round(apt.monthlyRentTotalAmount / apt.monthlyRentCount);
    }
  });

  // 변동률 계산 (간단히 랜덤 시뮬레이션 - 실제로는 월별 비교 필요)
  Object.values(aggregated).forEach((apt) => {
    apt.tradeChangePercent = Math.round((Math.random() * 10 - 3) * 10) / 10;
  });

  return aggregated;
}

/**
 * Mock 순위 데이터 생성
 */
function generateMockRankings(regionName: string, limit: number): CategoryRankings {
  const regionalApartments: { [key: string]: string[] } = {
    "용인시 처인구": [
      "양지 에메랄드캐슬",
      "역북 현대아이파크",
      "김량장 우미린",
      "모현 한일베라체",
      "백암 동문굿모닝힐",
      "남사 대원칸타빌",
      "원삼 신안인스빌",
    ],
    "용인시 기흥구": [
      "보라동 삼성래미안",
      "구갈 자이",
      "동백 센트럴자이",
      "신갈 푸르지오",
      "상하 힐스테이트",
      "영덕 e편한세상",
      "마북 현대아이파크",
    ],
    "용인시 수지구": [
      "죽전 롯데캐슬",
      "동천 래미안",
      "풍덕천 자이",
      "성복 힐스테이트",
      "상현 푸르지오",
      "신봉 현대홈타운",
      "고기 삼성래미안",
    ],
    "성남시 분당구": [
      "정자동 아이파크",
      "서현 래미안",
      "야탑 롯데캐슬",
      "이매 삼성래미안",
      "수내 자이",
      "분당 파크뷰",
      "정자 푸르지오",
    ],
    // 부산 지역
    "남구": [
      "경남아너스빌",
      "대연 힐스테이트",
      "용호 자이",
      "문현 롯데캐슬",
      "대연 푸르지오",
      "용호 래미안",
      "남천 더샵",
    ],
    "해운대구": [
      "마린시티 아이파크",
      "센텀시티 자이",
      "우동 힐스테이트",
      "좌동 래미안",
      "반여 푸르지오",
      "재송 롯데캐슬",
      "중동 더샵",
    ],
    default: [
      "센트럴파크 푸르지오",
      "더샵 레이크파크",
      "힐스테이트 그랜드",
      "자이 더 빌리지",
      "롯데캐슬 시그니처",
      "래미안 퍼스티지",
      "e편한세상 시티",
    ],
  };

  const apartments = regionalApartments[regionName] || regionalApartments.default;
  const district = regionName.split(" ").pop() || "";

  // 시드 기반 랜덤 (일관된 데이터)
  const seed = regionName.length;
  const pseudoRandom = (index: number) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };

  const generateApt = (name: string, index: number): ApartmentRanking => {
    const volumeScore = Math.round((100 - index * 10) * (0.8 + pseudoRandom(index) * 0.4));
    const priceScore = Math.round((100 - index * 8) * (0.7 + pseudoRandom(index + 10) * 0.5));
    const changeScore = Math.round(50 + (pseudoRandom(index + 20) * 50 - 20));
    const compositeScore = volumeScore * 0.4 + priceScore * 0.3 + changeScore * 0.3;

    return {
      rank: index + 1,
      name,
      district,
      avgPrice: Math.round((80000 - index * 5000) * (0.9 + pseudoRandom(index + 30) * 0.2)),
      pricePerPyeong: Math.round((3500 - index * 200) * (0.9 + pseudoRandom(index + 40) * 0.2)),
      transactionCount: Math.round((20 - index * 2) * (0.8 + pseudoRandom(index + 50) * 0.4)),
      changePercent: Math.round((pseudoRandom(index + 60) * 8 - 2) * 10) / 10,
      compositeScore: Math.round(compositeScore * 10) / 10,
      volumeScore,
      priceScore,
      changeScore,
    };
  };

  const allApts = apartments.slice(0, Math.max(limit + 2, 7)).map((name, i) => generateApt(name, i));

  // 복합 점수 순위 (기본)
  const composite = [...allApts]
    .sort((a, b) => (b.compositeScore || 0) - (a.compositeScore || 0))
    .slice(0, limit)
    .map((apt, i) => ({ ...apt, rank: i + 1 }));

  // 매매 평당가 순위
  const tradePricePerPyeong = [...allApts]
    .sort((a, b) => b.pricePerPyeong - a.pricePerPyeong)
    .slice(0, limit)
    .map((apt, i) => ({ ...apt, rank: i + 1 }));

  // 전세 순위 (실제 전세가 - 매매의 60~70% 수준)
  const jeonsePrice = [...allApts]
    .map((apt, index) => ({
      ...apt,
      avgPrice: Math.round(apt.avgPrice * (0.6 + pseudoRandom(index + 100) * 0.15)), // 전세 보증금
      pricePerPyeong: 0, // 평당가 안씀
      transactionCount: Math.round(apt.transactionCount * (0.5 + pseudoRandom(index + 110) * 0.5)),
    }))
    .sort((a, b) => b.avgPrice - a.avgPrice)
    .slice(0, limit)
    .map((apt, i) => ({ ...apt, rank: i + 1 }));

  // 월세 순위 (보증금/월세 형식)
  const monthlyRentPrice = [...allApts]
    .map((apt, index) => ({
      ...apt,
      avgPrice: 0, // avgPrice 안씀
      pricePerPyeong: 0, // 평당가 안씀
      monthlyRentDeposit: Math.round(2000 + pseudoRandom(index + 200) * 8000), // 보증금 2000~10000만원
      monthlyRentAmount: Math.round(50 + pseudoRandom(index + 210) * 150), // 월세 50~200만원
      transactionCount: Math.round(apt.transactionCount * (0.3 + pseudoRandom(index + 220) * 0.4)),
    }))
    .sort((a, b) => (b.monthlyRentDeposit || 0) - (a.monthlyRentDeposit || 0))
    .slice(0, limit)
    .map((apt, i) => ({ ...apt, rank: i + 1 }));

  // 거래량 순위
  const tradeVolume = [...allApts]
    .sort((a, b) => b.transactionCount - a.transactionCount)
    .slice(0, limit)
    .map((apt, i) => ({ ...apt, rank: i + 1 }));

  console.log(`📊 Mock 데이터 생성 완료: 종합 ${composite.length}건, 전세 ${jeonsePrice.length}건, 월세 ${monthlyRentPrice.length}건`);

  return {
    composite,
    tradePricePerPyeong,
    jeonsePrice,
    monthlyRentPrice,
    tradeVolume,
  };
}

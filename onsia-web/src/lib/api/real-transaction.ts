/**
 * 국토교통부 실거래가 API 클라이언트 (상세자료)
 *
 * API 문서:
 * - 매매 상세: https://www.data.go.kr/data/15126468/openapi.do
 * - 분양권전매: https://www.data.go.kr/data/15126471/openapi.do
 * - 전월세: https://www.data.go.kr/data/15126474/openapi.do
 */

import {
  TradeTransaction,
  RentTransaction,
  TransactionApiParams,
} from '@/types/real-transaction';

const API_KEY = process.env.DATA_GO_KR_API_KEY || '';

// API 엔드포인트 (상세자료)
const APT_TRADE_DEV_API = 'https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev';
const APT_RENT_API = 'https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent';
const APT_PRESALE_API = 'https://apis.data.go.kr/1613000/RTMSDataSvcSilvTrade/getRTMSDataSvcSilvTrade'; // 분양권전매

/**
 * XML을 JSON으로 파싱 (간단한 파서)
 */
function parseXmlToJson(xml: string): any {
  // items 내의 item 배열 추출
  const itemsMatch = xml.match(/<items>([\s\S]*?)<\/items>/);
  if (!itemsMatch) {
    return { items: [] };
  }

  const itemsXml = itemsMatch[1];
  // item 태그 내부 콘텐츠만 추출
  const itemContentMatches = itemsXml.match(/<item>([\s\S]*?)<\/item>/g);
  if (!itemContentMatches) {
    return { items: [] };
  }

  const items = itemContentMatches.map(itemXml => {
    const item: Record<string, string> = {};
    // item 태그 내부 콘텐츠 추출
    const contentMatch = itemXml.match(/<item>([\s\S]*?)<\/item>/);
    if (!contentMatch) return item;

    const innerContent = contentMatch[1];
    // 모든 태그-값 쌍 추출 (중첩되지 않은 단순 태그만)
    const tagRegex = /<(\w+)>([^<]*)<\/\1>/g;
    let match;
    while ((match = tagRegex.exec(innerContent)) !== null) {
      const tagName = match[1];
      const tagValue = match[2].trim();
      item[tagName] = tagValue;
    }
    return item;
  });

  // totalCount 추출
  const totalCountMatch = xml.match(/<totalCount>(\d+)<\/totalCount>/);
  const totalCount = totalCountMatch ? parseInt(totalCountMatch[1], 10) : items.length;

  return { items, totalCount };
}

/**
 * 금액 문자열을 숫자로 변환 (쉼표 제거)
 */
function parsePrice(priceStr: string): number {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/,/g, '').trim(), 10) || 0;
}

/**
 * 금액을 한글 표기로 변환 (억/만원)
 */
function formatPrice(price: number): string {
  if (price >= 10000) {
    const eok = Math.floor(price / 10000);
    const man = price % 10000;
    if (man === 0) {
      return `${eok}억`;
    }
    return `${eok}억 ${man.toLocaleString()}`;
  }
  return `${price.toLocaleString()}`;
}

/**
 * 전용면적(㎡)을 평으로 변환
 */
function sqmToPyeong(sqm: number): number {
  return Math.round(sqm / 3.3058 * 10) / 10;
}

/**
 * 고유 ID 생성
 */
function generateId(type: string, aptName: string, dealYear: string, dealMonth: string, dealDay: string, floor: string): string {
  return `${type}-${aptName}-${dealYear}${dealMonth}${dealDay}-${floor}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 아파트 매매 실거래가 상세 조회
 */
export async function fetchAptTrades(params: TransactionApiParams): Promise<TradeTransaction[]> {
  const { lawdCd, dealYmd, pageNo = 1, numOfRows = 100 } = params;

  const url = `${APT_TRADE_DEV_API}?serviceKey=${API_KEY}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&pageNo=${pageNo}&numOfRows=${numOfRows}`;

  console.log('[RealTransaction API] 매매 상세 조회:', { lawdCd, dealYmd });

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const xmlText = await response.text();

    // 에러 체크 (000 = 성공)
    if (xmlText.includes('<resultCode>') && !xmlText.includes('<resultCode>000</resultCode>')) {
      const errorMatch = xmlText.match(/<resultMsg>(.*?)<\/resultMsg>/);
      throw new Error(`API 오류: ${errorMatch ? errorMatch[1] : 'Unknown error'}`);
    }

    const data = parseXmlToJson(xmlText);

    return data.items.map((item: any): TradeTransaction => {
      const price = parsePrice(item.dealAmount);
      const area = parseFloat(item.excluUseAr) || 0;

      return {
        id: generateId('trade', item.aptNm, item.dealYear, item.dealMonth, item.dealDay, item.floor),
        type: 'trade',
        aptName: item.aptNm || '',
        address: `${item.umdNm || ''} ${item.jibun || ''}`.trim(),
        area,
        areaInPyeong: sqmToPyeong(area),
        contractDate: `${item.dealYear}-${(item.dealMonth || '').padStart(2, '0')}-${(item.dealDay || '').padStart(2, '0')}`,
        price,
        priceFormatted: formatPrice(price),
        floor: parseInt(item.floor, 10) || 0,
        buildYear: parseInt(item.buildYear, 10) || 0,
        dong: item.aptDong || undefined,
        dealType: item.dealingGbn || undefined,
        isCanceled: item.cdealType === 'O',
      };
    });
  } catch (error) {
    console.error('[RealTransaction API] 매매 상세 조회 오류:', error);
    throw error;
  }
}

/**
 * 아파트 전월세 실거래가 조회
 */
export async function fetchAptRents(params: TransactionApiParams): Promise<RentTransaction[]> {
  const { lawdCd, dealYmd, pageNo = 1, numOfRows = 100 } = params;

  const url = `${APT_RENT_API}?serviceKey=${API_KEY}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&pageNo=${pageNo}&numOfRows=${numOfRows}`;

  console.log('[RealTransaction API] 전월세 조회:', { lawdCd, dealYmd });

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const xmlText = await response.text();

    // 에러 체크 (000 = 성공)
    if (xmlText.includes('<resultCode>') && !xmlText.includes('<resultCode>000</resultCode>')) {
      const errorMatch = xmlText.match(/<resultMsg>(.*?)<\/resultMsg>/);
      throw new Error(`API 오류: ${errorMatch ? errorMatch[1] : 'Unknown error'}`);
    }

    const data = parseXmlToJson(xmlText);

    return data.items.map((item: any): RentTransaction => {
      const deposit = parsePrice(item.deposit);
      const monthlyRent = parsePrice(item.monthlyRent);
      const area = parseFloat(item.excluUseAr) || 0;
      const isJeonse = monthlyRent === 0;
      const isRenewal = item.contractType === '갱신' || item.contractType === '재계약';

      // 가격 표시 형식: 전세는 보증금만, 월세는 보증금/월세
      let priceFormatted: string;
      if (isJeonse) {
        priceFormatted = formatPrice(deposit);
      } else {
        // 호갱노노 형식: 5,000/150 (보증금/월세)
        const depositStr = deposit >= 10000
          ? `${Math.floor(deposit / 10000)}억${deposit % 10000 > 0 ? ' ' + (deposit % 10000).toLocaleString() : ''}`
          : deposit.toLocaleString();
        priceFormatted = `${depositStr}/${monthlyRent.toLocaleString()}`;
      }

      return {
        id: generateId(isJeonse ? 'jeonse' : 'monthly', item.aptNm, item.dealYear, item.dealMonth, item.dealDay, item.floor),
        type: isJeonse ? 'jeonse' : 'monthly',
        aptName: item.aptNm || '',
        address: `${item.umdNm || ''} ${item.jibun || ''}`.trim(),
        area,
        areaInPyeong: sqmToPyeong(area),
        contractDate: `${item.dealYear}-${(item.dealMonth || '').padStart(2, '0')}-${(item.dealDay || '').padStart(2, '0')}`,
        deposit,
        depositFormatted: formatPrice(deposit),
        monthlyRent,
        monthlyRentFormatted: monthlyRent > 0 ? `${monthlyRent.toLocaleString()}만` : '',
        priceFormatted,
        floor: parseInt(item.floor, 10) || 0,
        buildYear: parseInt(item.buildYear, 10) || 0,
        contractType: item.contractType || undefined,
        isRenewal,
      };
    });
  } catch (error) {
    console.error('[RealTransaction API] 전월세 조회 오류:', error);
    throw error;
  }
}

// 분양권전매 거래 타입
export interface PresaleTransaction {
  id: string;
  type: 'presale';
  aptName: string;
  address: string;
  area: number;
  areaInPyeong: number;
  contractDate: string;
  price: number;
  priceFormatted: string;
  floor: number;
  isCanceled: boolean;
}

/**
 * 아파트 분양권전매 실거래가 조회
 */
export async function fetchAptPresales(params: TransactionApiParams): Promise<PresaleTransaction[]> {
  const { lawdCd, dealYmd, pageNo = 1, numOfRows = 100 } = params;

  // 분양권전매 API 엔드포인트
  const url = `https://apis.data.go.kr/1613000/RTMSDataSvcSilvTrade/getRTMSDataSvcSilvTrade?serviceKey=${API_KEY}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&pageNo=${pageNo}&numOfRows=${numOfRows}`;

  console.log('[RealTransaction API] 분양권전매 조회:', { lawdCd, dealYmd });

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const xmlText = await response.text();

    // 에러 체크 (000 = 성공)
    if (xmlText.includes('<resultCode>') && !xmlText.includes('<resultCode>000</resultCode>')) {
      const errorMatch = xmlText.match(/<resultMsg>(.*?)<\/resultMsg>/);
      throw new Error(`API 오류: ${errorMatch ? errorMatch[1] : 'Unknown error'}`);
    }

    const data = parseXmlToJson(xmlText);

    return data.items.map((item: any): PresaleTransaction => {
      const price = parsePrice(item.dealAmount);
      const area = parseFloat(item.excluUseAr) || 0;

      return {
        id: generateId('presale', item.aptNm, item.dealYear, item.dealMonth, item.dealDay, item.floor),
        type: 'presale',
        aptName: item.aptNm || '',
        address: `${item.umdNm || ''} ${item.jibun || ''}`.trim(),
        area,
        areaInPyeong: sqmToPyeong(area),
        contractDate: `${item.dealYear}-${(item.dealMonth || '').padStart(2, '0')}-${(item.dealDay || '').padStart(2, '0')}`,
        price,
        priceFormatted: formatPrice(price),
        floor: parseInt(item.floor, 10) || 0,
        isCanceled: item.cdealType === 'O',
      };
    });
  } catch (error) {
    console.error('[RealTransaction API] 분양권전매 조회 오류:', error);
    throw error;
  }
}

/**
 * 계약일 포맷 변환 (YY.MM.DD)
 */
export function formatContractDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${year.slice(2)}.${month}.${day}`;
}

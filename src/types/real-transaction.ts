/**
 * 국토교통부 실거래가 API 타입 정의
 * 출처: https://www.data.go.kr/data/15126469/openapi.do (매매)
 *       https://www.data.go.kr/data/15126474/openapi.do (전월세)
 */

// 아파트 매매 실거래 응답 아이템
export interface AptTradeItem {
  sggCd: string;           // 지역코드
  umdNm: string;           // 법정동
  aptNm: string;           // 단지명
  jibun: string;           // 지번
  excluUseAr: string;      // 전용면적 (㎡)
  dealYear: string;        // 거래년도
  dealMonth: string;       // 거래월
  dealDay: string;         // 거래일
  dealAmount: string;      // 거래금액 (만원, 쉼표 포함)
  floor: string;           // 층
  buildYear: string;       // 건축년도
  aptDong?: string;        // 동 (등기 완료 건만 제공)
  rgstDate?: string;       // 등기일자
  dealingGbn?: string;     // 거래유형 (중개거래, 직거래)
  slerGbn?: string;        // 매도자 구분
  buyerGbn?: string;       // 매수자 구분
  cdealType?: string;      // 해제여부 (O: 해제)
  cdealDay?: string;       // 해제사유발생일
}

// 아파트 전월세 실거래 응답 아이템
export interface AptRentItem {
  sggCd: string;           // 지역코드
  umdNm: string;           // 법정동
  aptNm: string;           // 단지명
  jibun: string;           // 지번
  excluUseAr: string;      // 전용면적 (㎡)
  dealYear: string;        // 거래년도
  dealMonth: string;       // 거래월
  dealDay: string;         // 거래일
  deposit: string;         // 보증금액 (만원, 쉼표 포함)
  monthlyRent: string;     // 월세금액 (만원) - 0이면 전세
  floor: string;           // 층
  buildYear: string;       // 건축년도
  contractType?: string;   // 계약구분 (신규, 갱신)
  contractTerm?: string;   // 계약기간
  preDeposit?: string;     // 종전 보증금
  preMonthlyRent?: string; // 종전 월세
}

// API 응답 공통 구조
export interface ApiResponse<T> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: T | T[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// 정제된 매매 거래 데이터
export interface TradeTransaction {
  id: string;
  type: 'trade';          // 매매
  aptName: string;        // 단지명
  address: string;        // 주소 (법정동 + 지번)
  area: number;           // 전용면적 (㎡)
  areaInPyeong: number;   // 전용면적 (평)
  contractDate: string;   // 계약일 (YYYY-MM-DD)
  price: number;          // 거래금액 (만원)
  priceFormatted: string; // 거래금액 (포맷팅)
  floor: number;          // 층
  buildYear: number;      // 건축년도
  dong?: string;          // 동
  dealType?: string;      // 거래유형
  isCanceled: boolean;    // 해제여부
}

// 정제된 전월세 거래 데이터
export interface RentTransaction {
  id: string;
  type: 'jeonse' | 'monthly'; // 전세 또는 월세
  aptName: string;            // 단지명
  address: string;            // 주소 (법정동 + 지번)
  area: number;               // 전용면적 (㎡)
  areaInPyeong: number;       // 전용면적 (평)
  contractDate: string;       // 계약일 (YYYY-MM-DD)
  deposit: number;            // 보증금 (만원)
  depositFormatted: string;   // 보증금 (포맷팅)
  monthlyRent: number;        // 월세 (만원) - 전세는 0
  monthlyRentFormatted: string; // 월세 (포맷팅)
  priceFormatted: string;     // 가격 표시 (전세: 보증금, 월세: 보증금/월세)
  floor: number;              // 층
  buildYear: number;          // 건축년도
  contractType?: string;      // 계약구분 (신규, 갱신/재계약)
  isRenewal: boolean;         // 갱신계약 여부
}

// 통합 거래 데이터 타입
export type Transaction = TradeTransaction | RentTransaction;

// API 요청 파라미터
export interface TransactionApiParams {
  lawdCd: string;    // 지역코드 (5자리)
  dealYmd: string;   // 계약년월 (6자리, YYYYMM)
  pageNo?: number;   // 페이지 번호
  numOfRows?: number; // 한 페이지 결과 수
}

// 법정동 코드 매핑 (주요 지역)
export const LAWD_CODE_MAP: Record<string, string> = {
  // 서울
  '서울특별시 종로구': '11110',
  '서울특별시 중구': '11140',
  '서울특별시 용산구': '11170',
  '서울특별시 성동구': '11200',
  '서울특별시 광진구': '11215',
  '서울특별시 동대문구': '11230',
  '서울특별시 중랑구': '11260',
  '서울특별시 성북구': '11290',
  '서울특별시 강북구': '11305',
  '서울특별시 도봉구': '11320',
  '서울특별시 노원구': '11350',
  '서울특별시 은평구': '11380',
  '서울특별시 서대문구': '11410',
  '서울특별시 마포구': '11440',
  '서울특별시 양천구': '11470',
  '서울특별시 강서구': '11500',
  '서울특별시 구로구': '11530',
  '서울특별시 금천구': '11545',
  '서울특별시 영등포구': '11560',
  '서울특별시 동작구': '11590',
  '서울특별시 관악구': '11620',
  '서울특별시 서초구': '11650',
  '서울특별시 강남구': '11680',
  '서울특별시 송파구': '11710',
  '서울특별시 강동구': '11740',

  // 경기도 주요 지역
  '경기도 수원시 장안구': '41111',
  '경기도 수원시 권선구': '41113',
  '경기도 수원시 팔달구': '41115',
  '경기도 수원시 영통구': '41117',
  '경기도 성남시 수정구': '41131',
  '경기도 성남시 중원구': '41133',
  '경기도 성남시 분당구': '41135',
  '경기도 용인시 처인구': '41461',
  '경기도 용인시 기흥구': '41463',
  '경기도 용인시 수지구': '41465',
  '경기도 화성시': '41590',
  '경기도 평택시': '41220',

  // 인천
  '인천광역시 중구': '28110',
  '인천광역시 동구': '28140',
  '인천광역시 미추홀구': '28177',
  '인천광역시 연수구': '28185',
  '인천광역시 남동구': '28200',
  '인천광역시 부평구': '28237',
  '인천광역시 계양구': '28245',
  '인천광역시 서구': '28260',

  // 부산
  '부산광역시 중구': '26110',
  '부산광역시 서구': '26140',
  '부산광역시 동구': '26170',
  '부산광역시 영도구': '26200',
  '부산광역시 부산진구': '26230',
  '부산광역시 동래구': '26260',
  '부산광역시 남구': '26290',
  '부산광역시 북구': '26320',
  '부산광역시 해운대구': '26350',
  '부산광역시 사하구': '26380',
  '부산광역시 금정구': '26410',
  '부산광역시 강서구': '26440',
  '부산광역시 연제구': '26470',
  '부산광역시 수영구': '26500',
  '부산광역시 사상구': '26530',
  '부산광역시 기장군': '26710',

  // 대전
  '대전광역시 동구': '30110',
  '대전광역시 중구': '30140',
  '대전광역시 서구': '30170',
  '대전광역시 유성구': '30200',
  '대전광역시 대덕구': '30230',
};

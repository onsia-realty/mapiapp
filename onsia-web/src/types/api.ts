// 청약홈 공공데이터 API 타입 정의

/**
 * 청약홈 분양정보 API 응답
 * 공공데이터포털: 한국부동산원_분양정보
 */
export interface ApplyHomeAPIResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: ApplyHomeItem[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

export interface ApplyHomeItem {
  HOUSE_MANAGE_NO: string; // 주택관리번호
  PBLANC_NO: string; // 공고번호
  HOUSE_NM: string; // 주택명
  HOUSE_SECD: string; // 주택구분코드 (01:아파트, 02:오피스텔 등)
  HOUSE_SECD_NM: string; // 주택구분명
  SUBSCRPT_AREA_CODE: string; // 공급지역코드
  SUBSCRPT_AREA_CODE_NM: string; // 공급지역명
  HSSPLY_ADRES: string; // 공급위치 주소
  TOT_SUPLY_HSHLDCO: string; // 공급규모 (총 세대수)
  RCRIT_PBLANC_DE: string; // 모집공고일
  SUBSCRPT_RCEPT_BGNDE: string; // 청약접수 시작일
  SUBSCRPT_RCEPT_ENDDE: string; // 청약접수 종료일
  PRZWNER_PRESNATN_DE: string; // 당첨자발표일
  CNTRCT_CNCLS_BGNDE: string; // 계약시작일
  CNTRCT_CNCLS_ENDDE: string; // 계약종료일
  MVNINDATE: string; // 입주예정일
  SPECLT_RDN_EARTH_AT: string; // 투기과열지구여부
  MDAT_TRGET_AREA_SECD: string; // 분양가상한제적용여부
  PBLANC_URL: string; // 공고문 URL
  BSNS_MBY_NM: string; // 사업주체명
  MDL_TELNO: string; // 문의전화번호
}

/**
 * 국토교통부 아파트 실거래가 API 응답
 */
export interface RealPriceAPIResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: RealPriceItem[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

export interface RealPriceItem {
  거래금액: string; // 거래금액 (만원)
  건축년도: string; // 건축년도
  년: string; // 거래년도
  월: string; // 거래월
  일: string; // 거래일
  아파트: string; // 아파트명
  법정동: string; // 법정동
  전용면적: string; // 전용면적(㎡)
  지번: string; // 지번
  지역코드: string; // 지역코드
  층: string; // 층
  도로명: string; // 도로명
  도로명건물본번호코드: string;
  도로명건물부번호코드: string;
  도로명시군구코드: string;
  도로명일련번호코드: string;
  도로명지상지하코드: string;
  도로명코드: string;
  법정동본번코드: string;
  법정동부번코드: string;
  법정동시군구코드: string;
  법정동읍면동코드: string;
  법정동지번코드: string;
  일련번호: string;
  거래유형: string; // 거래유형 (직거래 등)
  중개사소재지: string;
  해제사유발생일: string;
  해제여부: string;
}

/**
 * 우리 앱에서 사용할 분양권 데이터 타입
 */
export interface BunyanggwonData {
  id: string;
  propertyName: string; // 주택명
  district: string; // 지역 (구)
  address: string; // 전체 주소
  moveInDate: string; // 입주예정일
  status: "모집중" | "청약접수중" | "당첨자발표" | "계약진행중" | "마감";
  thumbnailUrl: string;

  // 청약 일정
  schedule: {
    recruitmentDate: string; // 모집공고일
    specialSupplyDate?: string; // 특별공급일
    subscriptionStartDate: string; // 청약접수시작일 (1순위)
    subscriptionEndDate: string; // 청약접수종료일 (2순위)
    winnerAnnouncementDate: string; // 당첨자발표일
    contractStartDate: string; // 계약시작일
    contractEndDate: string; // 계약종료일
  };

  // 공급 정보
  supplyInfo: {
    location: string; // 공급위치
    totalUnits: number; // 총 세대수
    builder: string; // 건설사 (시공사)
    operator: string; // 시행사
    phone: string; // 문의전화
  };

  // 평형별 분양가 정보
  priceInfo?: PriceByType[];

  // 기타
  houseType: string; // 주택구분 (아파트, 오피스텔 등)
  region: string; // 공급지역
  announcementUrl?: string; // 청약홈 공고 URL
  homepageUrl?: string; // 분양 홈페이지 URL

  // 이미지 정보 (분양 홈페이지에서 크롤링)
  images?: PropertyImages;
}

/**
 * 평형별 분양가 정보
 */
export interface PriceByType {
  type: string; // 타입명 (84A, 84B, 123 등)
  exclusiveArea: number; // 전용면적 (㎡)
  supplyArea: number; // 공급면적 (㎡)
  pyeong: number; // 평수
  price: number; // 분양가 (만원)
  totalUnits: number; // 공급세대수 (일반+특별)
  generalUnits: number; // 일반공급 세대수
  specialUnits: number; // 특별공급 세대수
}

/**
 * 주변 시세 데이터
 */
export interface NearbyPriceData {
  apartmentName: string; // 아파트명
  address: string; // 주소 (동 + 지번)
  roadAddress?: string; // 도로명주소
  jibunAddress?: string; // 지번주소
  latitude?: number; // 위도
  longitude?: number; // 경도
  operationStatus?: string; // 운영상태
  sidoOffice?: string; // 시도교육청명
  localOffice?: string; // 교육지원청명
  exclusiveArea: number; // 전용면적(㎡)
  pyeong: number; // 평수
  recentPrice: number; // 최근 거래가 (만원)
  buildYear: string; // 건축년도
  floor: string; // 층
  transactionDate: string; // 거래일
  distance?: number; // 거리 (m)
}

/**
 * 분양 홈페이지 이미지 데이터
 */
export interface PropertyImages {
  birdEyeView?: string; // 조감도
  siteLayout?: string; // 단지배치도
  premium?: string; // 프리미엄/홍보 이미지
  floorPlans: FloorPlanImage[]; // 평면도 (타입별)
  gallery?: string[]; // 추가 갤러리 이미지
}

export interface FloorPlanImage {
  type: string; // 타입명 (84A, 84B, 123 등)
  imageUrl: string; // 평면도 이미지 URL
}

/**
 * 주변 학교 데이터
 */
export interface NearbySchool {
  schoolId: string; // 학교ID
  schoolName: string; // 학교명
  schoolType: string; // 학교급구분 (초등학교, 중학교, 고등학교)
  foundationType: string; // 설립형태 (공립, 사립)
  roadAddress: string; // 도로명주소
  jibunAddress: string; // 지번주소
  latitude: number; // 위도
  longitude: number; // 경도
  operationStatus: string; // 운영상태
  sidoOffice: string; // 시도교육청명
  localOffice: string; // 교육지원청명
  distance: number; // 거리 (km)
  walkingTime: number; // 도보시간 (분)
}

/**
 * 학교 API 응답
 */
export interface SchoolsApiResponse {
  success: boolean;
  data: {
    elementary: NearbySchool[]; // 초등학교
    middle: NearbySchool[]; // 중학교
    high: NearbySchool[]; // 고등학교
    kindergarten: NearbySchool[]; // 유치원
  };
  message?: string;
}

/**
 * 주변 지하철역 데이터
 */
export interface NearbySubwayStation {
  stationId: string; // 역번호
  stationName: string; // 역사명
  lineName: string; // 노선명
  lineNumber: string; // 노선 번호 (1, 2, 3... 또는 K, B 등)
  lineColor: string; // 노선 색상 (hex)
  isTransfer: boolean; // 환승역 여부
  transferLines: string | null; // 환승 노선명
  distance: number; // 거리 (km)
  walkingTime: number; // 도보시간 (분)
  roadAddress: string; // 도로명주소
  jibunAddress: string; // 지번주소
  latitude: number; // 위도
  longitude: number; // 경도
  operationStatus: string; // 운영상태
  sidoOffice: string; // 시도교육청명
  localOffice: string; // 교육지원청명
}

/**
 * 지하철역 API 응답
 */
export interface SubwayApiResponse {
  success: boolean;
  data: NearbySubwayStation[];
  message?: string;
}

/**
 * 주변 버스 정류장 데이터
 */
export interface NearbyBusStop {
  stationId: string; // 정류장번호
  stationName: string; // 정류장명
  latitude: number; // 위도
  longitude: number; // 경도
  cityName: string; // 도시명
  mobileNumber: number; // 모바일단축번호
  distance: number; // 거리 (km)
  walkingTime: number; // 도보시간 (분)
}

/**
 * 버스 정류장 API 응답
 */
export interface BusApiResponse {
  success: boolean;
  data: NearbyBusStop[];
  message?: string;
}

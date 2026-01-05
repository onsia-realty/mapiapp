/**
 * 온시아 앱 TypeScript 타입 정의
 * @description 매물, 사용자, 구인구직 등 핵심 인터페이스 정의
 */

// ============================================
// 사용자 관련 타입
// ============================================

/** 사용자 유형 */
export type UserType = 'general' | 'broker';

/** 사용자 정보 인터페이스 */
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  userType: UserType;
  profileImage?: string;
  createdAt: string;
}

/** 로그인 요청 타입 */
export interface LoginRequest {
  email: string;
  password: string;
  userType: UserType;
}

/** 소셜 로그인 제공자 */
export type SocialProvider = 'kakao' | 'naver' | 'google' | 'apple';

// ============================================
// 매물 관련 타입
// ============================================

/** 매물 카테고리 */
export type PropertyCategory =
  | 'presale'      // 분양권전매
  | 'interestOnly' // 이자만
  | 'profitable'   // 수익형부동산
  | 'office'       // 사무실
  | 'apartment'    // 아파트
  | 'job';         // 구인구직

/** 거래 유형 */
export type DealType = 'sale' | 'rent' | 'monthly';

/** 매물 기본 정보 */
export interface Property {
  id: string;
  category: PropertyCategory;
  title: string;
  address: string;
  addressDetail?: string;
  price: number;              // 매매가/전세가
  monthlyRent?: number;       // 월세
  deposit?: number;           // 보증금
  dealType: DealType;
  images: string[];
  description: string;

  // 면적 정보
  exclusiveArea: number;      // 전용면적 (㎡)
  supplyArea?: number;        // 공급면적 (㎡)

  // 건물 정보
  floor?: number;             // 해당층
  totalFloor?: number;        // 총층
  buildingYear?: number;      // 준공년도

  // 위치 정보
  latitude: number;
  longitude: number;

  // 중개사 정보
  brokerId: string;
  brokerName: string;
  brokerPhone: string;

  // 메타 정보
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 건축물대장 정보 */
export interface BuildingLedger {
  propertyId: string;
  buildingName: string;       // 건물명
  mainUse: string;            // 주용도
  totalFloorArea: number;     // 연면적
  buildingArea: number;       // 건축면적
  landArea: number;           // 대지면적
  structure: string;          // 구조
  roofType: string;           // 지붕
  floors: string;             // 층수
  height: number;             // 높이
  approvalDate: string;       // 사용승인일
}

/** 매물 필터 옵션 */
export interface PropertyFilter {
  category?: PropertyCategory;
  dealType?: DealType;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  regions?: string[];
}

// ============================================
// 구인구직 관련 타입
// ============================================

/** 구인구직 유형 */
export type JobType = 'hiring' | 'seeking';

/** 구인구직 게시글 */
export interface Job {
  id: string;
  type: JobType;
  title: string;
  company?: string;           // 회사명 (구인 시)
  location: string;
  salary: string;             // 급여 조건
  workTime: string;           // 근무 시간
  description: string;
  requirements?: string;      // 자격 요건
  contact: string;
  contactPhone: string;
  createdAt: string;
  viewCount: number;
}

// ============================================
// 네비게이션 관련 타입
// ============================================

/** 루트 스택 네비게이션 파라미터 */
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  PropertyDetail: { propertyId: string };
  JobDetail: { jobId: string };
  Search: { keyword?: string };
  Filter: { category: PropertyCategory };
};

/** 바텀탭 네비게이션 파라미터 */
export type BottomTabParamList = {
  Home: undefined;
  Favorites: undefined;
  PropertyRegister: undefined;
  Job: undefined;
  MyPage: undefined;
};

/** 인증 스택 파라미터 */
export type AuthStackParamList = {
  Login: undefined;
  SignUp: { userType: UserType };
  FindPassword: undefined;
};

// ============================================
// API 응답 타입
// ============================================

/** API 기본 응답 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/** 페이지네이션 응답 */
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

// ============================================
// 지도 관련 타입
// ============================================

/** 지도 마커 정보 */
export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  price: string;
  category: PropertyCategory;
}

/** 지도 영역 */
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

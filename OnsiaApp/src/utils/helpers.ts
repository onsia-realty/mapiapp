/**
 * 온시아 앱 헬퍼 함수
 * @description 숫자 포맷팅, 날짜 변환, 면적 계산 등 유틸리티 함수
 */

// ============================================
// 숫자 포맷팅
// ============================================

/**
 * 숫자에 콤마 추가 (예: 1000000 → "1,000,000")
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 가격을 한글 단위로 변환 (예: 50000 → "5억", 3000 → "3천만")
 * @param price 가격 (만원 단위)
 */
export const formatPrice = (price: number): string => {
  if (price >= 10000) {
    const billion = Math.floor(price / 10000);
    const thousand = price % 10000;
    if (thousand === 0) {
      return `${billion}억`;
    }
    return `${billion}억 ${formatNumber(thousand)}만`;
  }
  return `${formatNumber(price)}만`;
};

/**
 * 가격을 원화 형식으로 변환 (예: 50000000 → "50,000,000원")
 */
export const formatWon = (price: number): string => {
  return `${formatNumber(price)}원`;
};

/**
 * 월세 형식 변환 (예: 보증금 1000만 / 월세 50만 → "1,000/50")
 */
export const formatMonthlyRent = (deposit: number, monthly: number): string => {
  return `${formatNumber(deposit)}/${formatNumber(monthly)}`;
};

// ============================================
// 면적 변환
// ============================================

/**
 * ㎡를 평으로 변환 (1평 = 3.3058㎡)
 */
export const sqmToPyeong = (sqm: number): number => {
  return Math.round((sqm / 3.3058) * 10) / 10;
};

/**
 * 평을 ㎡로 변환
 */
export const pyeongToSqm = (pyeong: number): number => {
  return Math.round(pyeong * 3.3058 * 10) / 10;
};

/**
 * 면적 표시 형식 (예: "84㎡ (25.4평)")
 */
export const formatArea = (sqm: number): string => {
  const pyeong = sqmToPyeong(sqm);
  return `${sqm}㎡ (${pyeong}평)`;
};

// ============================================
// 날짜 포맷팅
// ============================================

/**
 * 날짜를 YYYY.MM.DD 형식으로 변환
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

/**
 * 날짜를 상대적 시간으로 변환 (예: "3일 전", "1시간 전")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
  return `${Math.floor(diffDays / 365)}년 전`;
};

// ============================================
// 전화번호 포맷팅
// ============================================

/**
 * 전화번호 포맷팅 (예: "01012345678" → "010-1234-5678")
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

// ============================================
// 주소 관련
// ============================================

/**
 * 주소 축약 (예: "서울특별시 강남구 역삼동 123-45" → "강남구 역삼동")
 */
export const shortenAddress = (address: string): string => {
  // 시/도 제거
  const withoutCity = address.replace(/^(서울특별시|부산광역시|인천광역시|대구광역시|대전광역시|광주광역시|울산광역시|세종특별자치시|경기도|강원도|충청북도|충청남도|전라북도|전라남도|경상북도|경상남도|제주특별자치도)\s*/g, '');
  // 번지수 제거
  const withoutNumber = withoutCity.replace(/\s*\d+(-\d+)?$/g, '');
  return withoutNumber;
};

// ============================================
// 유효성 검사
// ============================================

/**
 * 이메일 형식 검사
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 전화번호 형식 검사
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^01[0-9]{8,9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * 비밀번호 강도 검사 (최소 8자, 영문+숫자 포함)
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

// ============================================
// 문자열 처리
// ============================================

/**
 * 텍스트 말줄임 (예: "긴 텍스트입니다..." )
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * 검색어 하이라이트를 위한 분리
 */
export const splitByKeyword = (text: string, keyword: string): string[] => {
  if (!keyword) return [text];
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.split(regex);
};

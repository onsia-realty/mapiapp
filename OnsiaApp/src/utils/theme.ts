/**
 * 온시아 앱 테마 및 스타일 상수
 * @description 화이트/블루 모던 디자인 시스템
 */

// ============================================
// 색상 팔레트
// ============================================

export const colors = {
  // 주요 색상
  primary: '#2563EB',         // 메인 블루
  primaryLight: '#3B82F6',    // 밝은 블루
  primaryDark: '#1D4ED8',     // 어두운 블루

  // 배경 색상
  background: '#FFFFFF',      // 메인 배경
  backgroundGray: '#F5F5F5',  // 회색 배경
  backgroundBlue: '#EBF4FF',  // 연한 블루 배경

  // 텍스트 색상
  textPrimary: '#1F2937',     // 주요 텍스트
  textSecondary: '#6B7280',   // 보조 텍스트
  textLight: '#9CA3AF',       // 연한 텍스트
  textWhite: '#FFFFFF',       // 흰색 텍스트

  // 상태 색상
  success: '#10B981',         // 성공/완료
  warning: '#F59E0B',         // 경고
  error: '#EF4444',           // 에러
  info: '#3B82F6',            // 정보

  // 경계선 색상
  border: '#E5E7EB',          // 기본 테두리
  borderLight: '#F3F4F6',     // 연한 테두리
  divider: '#E5E7EB',         // 구분선

  // 소셜 로그인 색상
  kakao: '#FEE500',           // 카카오 노랑
  naver: '#03C75A',           // 네이버 녹색
  google: '#FFFFFF',          // 구글 흰색
  apple: '#000000',           // 애플 검정

  // 카테고리 색상
  categoryPresale: '#8B5CF6',     // 분양권전매 - 보라
  categoryInterest: '#F59E0B',    // 이자만 - 주황
  categoryProfitable: '#10B981',  // 수익형 - 녹색
  categoryOffice: '#3B82F6',      // 사무실 - 파랑
  categoryApartment: '#EC4899',   // 아파트 - 핑크
  categoryJob: '#6366F1',         // 구인구직 - 인디고
};

// ============================================
// 폰트 크기
// ============================================

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

// ============================================
// 폰트 굵기
// ============================================

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// ============================================
// 간격 (Spacing)
// ============================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
};

// ============================================
// 둥근 모서리 (Border Radius)
// ============================================

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// ============================================
// 그림자 (Shadows)
// ============================================

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

// ============================================
// 화면 사이즈 (기준)
// ============================================

export const screenSize = {
  headerHeight: 56,
  tabBarHeight: 60,
  bottomSheetHandle: 24,
  inputHeight: 48,
  buttonHeight: 52,
};

// ============================================
// 카테고리 설정
// ============================================

export const categoryConfig = {
  presale: {
    label: '분양권전매',
    color: colors.categoryPresale,
    icon: 'home-city',
  },
  interestOnly: {
    label: '이자만',
    color: colors.categoryInterest,
    icon: 'percent',
  },
  profitable: {
    label: '수익형부동산',
    color: colors.categoryProfitable,
    icon: 'chart-line',
  },
  office: {
    label: '사무실',
    color: colors.categoryOffice,
    icon: 'office-building',
  },
  apartment: {
    label: '아파트',
    color: colors.categoryApartment,
    icon: 'home-modern',
  },
  job: {
    label: '구인구직',
    color: colors.categoryJob,
    icon: 'briefcase',
  },
};

// ============================================
// 테마 객체 (styled-components용)
// ============================================

export const theme = {
  colors,
  fontSize,
  fontWeight,
  spacing,
  borderRadius,
  shadows,
  screenSize,
  categoryConfig,
};

export type Theme = typeof theme;

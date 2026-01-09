import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind 클래스 병합 유틸리티
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 숫자에 콤마 추가 (예: 1000000 → "1,000,000")
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
 * ㎡를 평으로 변환 (1평 = 3.3058㎡)
 */
export const sqmToPyeong = (sqm: number): number => {
  return Math.round((sqm / 3.3058) * 10) / 10;
};

/**
 * 면적 표시 형식 (예: "84㎡ (25.4평)")
 */
export const formatArea = (sqm: number): string => {
  const pyeong = sqmToPyeong(sqm);
  return `${sqm}㎡ (${pyeong}평)`;
};

/**
 * 날짜를 YYYY.MM.DD 형식으로 변환
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

/**
 * 전화번호 포맷팅 (예: "01012345678" → "010-1234-5678")
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

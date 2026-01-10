"use client";

import { useState, useMemo } from "react";
import { Phone } from "lucide-react";

interface LoanCalculatorProps {
  defaultPrice: number; // 분양가 (만원)
  propertyName?: string; // 단지명
}

// 주요 은행 금리 데이터 (금융감독원 기준)
const BANK_RATES = [
  { name: "카카오뱅크", rate: 3.80, color: "#FFE600" },
  { name: "수협은행", rate: 4.06, color: "#0066B3" },
  { name: "케이뱅크", rate: 4.12, color: "#FF6B00" },
  { name: "아이엠뱅크", rate: 4.16, color: "#E31937" },
  { name: "우리은행", rate: 4.20, color: "#0072BC" },
];

// 대출기간 옵션
const LOAN_TERMS = [
  { value: 10, label: "10년" },
  { value: 20, label: "20년" },
  { value: 30, label: "30년" },
];

// 상환방식 옵션
const REPAYMENT_TYPES = [
  { value: "equal_principal_interest", label: "원리금균등" },
  { value: "equal_principal", label: "원금균등" },
];

/**
 * 금액을 한글 형식으로 변환 (억/만원)
 */
function formatKoreanCurrency(amount: number): string {
  if (amount >= 10000) {
    const eok = Math.floor(amount / 10000);
    const man = amount % 10000;
    if (man === 0) {
      return `${eok}억`;
    }
    return `${eok}억 ${man.toLocaleString()}`;
  }
  return `${amount.toLocaleString()}만원`;
}

/**
 * 원리금균등상환 월납입금 계산
 */
function calculateEqualPrincipalInterest(
  principal: number, // 원금 (만원)
  annualRate: number, // 연이율 (%)
  years: number // 대출기간 (년)
): { monthlyPayment: number; totalInterest: number } {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  if (monthlyRate === 0) {
    return {
      monthlyPayment: principal / months,
      totalInterest: 0,
    };
  }

  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalInterest: Math.round(totalInterest),
  };
}

/**
 * 원금균등상환 첫달 납입금 계산
 */
function calculateEqualPrincipal(
  principal: number, // 원금 (만원)
  annualRate: number, // 연이율 (%)
  years: number // 대출기간 (년)
): { monthlyPayment: number; totalInterest: number } {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  const principalPayment = principal / months;
  const firstMonthInterest = principal * monthlyRate;
  const firstMonthPayment = principalPayment + firstMonthInterest;

  // 총 이자 계산 (원금균등은 이자가 점점 줄어듦)
  let totalInterest = 0;
  let remaining = principal;
  for (let i = 0; i < months; i++) {
    totalInterest += remaining * monthlyRate;
    remaining -= principalPayment;
  }

  return {
    monthlyPayment: Math.round(firstMonthPayment),
    totalInterest: Math.round(totalInterest),
  };
}

export function LoanCalculator({ defaultPrice, propertyName }: LoanCalculatorProps) {
  // LTV 비율 (5% ~ 70%)
  const [ltvPercent, setLtvPercent] = useState(70);
  // 대출기간
  const [loanTerm, setLoanTerm] = useState(20);
  // 상환방식
  const [repaymentType, setRepaymentType] = useState<"equal_principal_interest" | "equal_principal">("equal_principal_interest");
  // 생애최초 여부 (0.1%p 우대)
  const [isFirstTime, setIsFirstTime] = useState(false);

  // 자본금, 대출금 계산
  const loanAmount = useMemo(() => {
    return Math.round(defaultPrice * (ltvPercent / 100));
  }, [defaultPrice, ltvPercent]);

  const downPayment = useMemo(() => {
    return defaultPrice - loanAmount;
  }, [defaultPrice, loanAmount]);

  // 기본 금리 (카카오뱅크 기준)
  const baseRate = BANK_RATES[0].rate;
  const effectiveRate = isFirstTime ? baseRate - 0.1 : baseRate;

  // 월납입금 및 총이자 계산
  const calculation = useMemo(() => {
    if (repaymentType === "equal_principal_interest") {
      return calculateEqualPrincipalInterest(loanAmount, effectiveRate, loanTerm);
    } else {
      return calculateEqualPrincipal(loanAmount, effectiveRate, loanTerm);
    }
  }, [loanAmount, effectiveRate, loanTerm, repaymentType]);

  // 은행별 월납입금 계산
  const bankPayments = useMemo(() => {
    return BANK_RATES.map((bank) => {
      const rate = isFirstTime ? bank.rate - 0.1 : bank.rate;
      const calc = repaymentType === "equal_principal_interest"
        ? calculateEqualPrincipalInterest(loanAmount, rate, loanTerm)
        : calculateEqualPrincipal(loanAmount, rate, loanTerm);
      return {
        ...bank,
        effectiveRate: rate,
        monthlyPayment: calc.monthlyPayment,
      };
    });
  }, [loanAmount, loanTerm, repaymentType, isFirstTime]);

  if (defaultPrice <= 0) {
    return null;
  }

  return (
    <div className="px-5 pt-6 pb-4">
      {/* 헤더 */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-900">대출계산기</h2>
        <p className="text-xs text-gray-500 mt-0.5">금융감독원 최저금리 기준</p>
      </div>

      {/* 분양가/대출금 슬라이더 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>자본금</span>
          <span>대출금 (LTV {ltvPercent}%)</span>
        </div>

        {/* 슬라이더 */}
        <input
          type="range"
          min={5}
          max={70}
          step={5}
          value={ltvPercent}
          onChange={(e) => setLtvPercent(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />

        <div className="flex justify-between text-sm font-semibold mt-2">
          <span className="text-gray-900">{formatKoreanCurrency(downPayment)}</span>
          <span className="text-blue-600">{formatKoreanCurrency(loanAmount)}</span>
        </div>
      </div>

      {/* 옵션 선택 */}
      <div className="space-y-3 mb-4">
        {/* 대출기간 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">대출기간</span>
          <select
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            className="text-xs border border-gray-300 rounded px-2 py-1.5 bg-white"
          >
            {LOAN_TERMS.map((term) => (
              <option key={term.value} value={term.value}>
                {term.label}
              </option>
            ))}
          </select>
        </div>

        {/* 상환방식 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">상환방식</span>
          <select
            value={repaymentType}
            onChange={(e) => setRepaymentType(e.target.value as "equal_principal_interest" | "equal_principal")}
            className="text-xs border border-gray-300 rounded px-2 py-1.5 bg-white"
          >
            {REPAYMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* 생애최초 체크박스 */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFirstTime}
              onChange={(e) => setIsFirstTime(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-xs text-gray-600">생애최초</span>
          </label>
          <span className="text-xs text-gray-400">0.1%p 우대</span>
        </div>
      </div>

      {/* 계산 결과 */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-600">월 납입금</span>
          <span className="text-lg font-bold text-blue-600">
            {calculation.monthlyPayment.toLocaleString()}만원
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">총 이자</span>
          <span className="text-sm text-gray-700">
            {formatKoreanCurrency(calculation.totalInterest)}
          </span>
        </div>
        {repaymentType === "equal_principal" && (
          <p className="text-xs text-gray-500 mt-2">
            * 원금균등상환 첫달 기준 (매월 감소)
          </p>
        )}
      </div>

      {/* 은행별 금리 비교 */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-700 mb-2">은행별 금리</h3>
        {bankPayments.slice(0, 3).map((bank) => (
          <div
            key={bank.name}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: bank.color }}
              >
                {bank.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-900">{bank.name}</p>
                <p className="text-xs text-gray-500">기준금리 {bank.rate}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-blue-600">{bank.effectiveRate.toFixed(2)}%</p>
                <p className="text-xs text-gray-500">월 {bank.monthlyPayment.toLocaleString()}만</p>
              </div>
              <button className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

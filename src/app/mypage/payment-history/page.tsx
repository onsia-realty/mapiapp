import { DemoSettingsPage } from "@/components/mypage/DemoSettingsPage";

const ROWS = [
  ["2026.09.15", "Standard 월 구독", "14,900원"],
  ["2026.08.15", "Standard 월 구독", "14,900원"],
];

export default function PaymentHistoryPage() {
  return <DemoSettingsPage title="결제 내역" eyebrow="PAYMENT HISTORY" description="최근 결제한 상품과 처리 상태를 확인합니다.">{ROWS.map(([date, name, price]) => <div key={date} className="flex items-center gap-3 border-b border-[#f0edf3] px-4 py-4 last:border-0"><div className="flex-1"><p className="text-sm font-black text-[#28222f]">{name}</p><p className="mt-1 text-[11px] text-[#8b8393]">{date} · 카드 결제</p></div><div className="text-right"><p className="text-sm font-black text-[#28222f]">{price}</p><p className="mt-1 text-[10px] font-bold text-[#6f2bd9]">결제 완료</p></div></div>)}</DemoSettingsPage>;
}

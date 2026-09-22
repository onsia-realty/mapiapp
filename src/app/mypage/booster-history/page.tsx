import { DemoSettingsPage } from "@/components/mypage/DemoSettingsPage";

export default function BoosterHistoryPage() {
  return <DemoSettingsPage title="부스터 이용 내역" eyebrow="BOOSTER HISTORY" description="상단 노출 부스터의 사용 기간과 상태를 확인합니다."><div className="p-4"><div className="rounded-2xl border border-[#eadfbd] bg-[#fffaf0] p-4"><div className="flex items-center justify-between"><p className="text-sm font-black text-[#332818]">분양권 프리미엄 부스터</p><span className="rounded-full bg-[#d7ae54]/20 px-2 py-1 text-[10px] font-black text-[#8a641a]">노출 중</span></div><p className="mt-2 text-[11px] text-[#81745f]">래미안 원베일리 · 2026.09.21 ~ 09.27</p></div></div></DemoSettingsPage>;
}

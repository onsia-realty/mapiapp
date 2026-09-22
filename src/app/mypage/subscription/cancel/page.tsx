"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { DemoSettingsPage } from "@/components/mypage/DemoSettingsPage";

export default function CancelSubscriptionPage() {
  const [confirmed, setConfirmed] = useState(false);
  const [complete, setComplete] = useState(false);
  return <DemoSettingsPage title="구독 해지" eyebrow="SUBSCRIPTION" description="현재 이용 중인 구독의 해지 조건을 확인합니다."><div className="space-y-4 p-4">{complete ? <div className="py-4 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-[#7b2ff7]" /><p className="mt-3 text-sm font-black text-[#28222f]">해지 요청이 접수되었습니다</p><p className="mt-2 text-[11px] leading-5 text-[#817987]">데모 완료 상태입니다. 실제 구독 상태나 결제 일정은 변경되지 않습니다.</p><button type="button" onClick={() => { setComplete(false); setConfirmed(false); }} className="mt-4 text-xs font-black text-[#6f2bd9]">접수 전 화면 보기</button></div> : <><div className="rounded-2xl bg-[#f7f4fa] p-4"><p className="text-sm font-black text-[#28222f]">Standard 월 구독</p><p className="mt-2 text-xs leading-5 text-[#756d7e]">해지 후에도 현재 이용 기간인 2026.10.14까지 기능을 사용할 수 있습니다.</p></div><label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e7e1eb] p-3"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#7b2ff7]" /><span className="text-[11px] leading-5 text-[#716979]">해지 후 다음 결제일부터 프리미엄 노출과 유료 기능이 종료되는 내용을 확인했습니다.</span></label><p className="text-[10px] leading-4 text-[#918897]">이 버튼은 데모 상태만 표시합니다. 실제 해지·결제 변경은 개발사 구독 API 연동 대상입니다.</p><button type="button" disabled={!confirmed} onClick={() => setComplete(true)} className="h-11 w-full rounded-xl border border-[#d9d2df] text-xs font-bold text-[#746b7c] disabled:cursor-not-allowed disabled:bg-[#f1eef3] disabled:text-[#b8b1be]">구독 해지 요청</button></>}</div></DemoSettingsPage>;
}

"use client";

import { useState } from "react";
import { CheckCircle2, CreditCard } from "lucide-react";
import { DemoSettingsPage } from "@/components/mypage/DemoSettingsPage";

export default function ChangeCardPage() {
  const [complete, setComplete] = useState(false);
  return <DemoSettingsPage title="결제 카드 변경" eyebrow="PAYMENT METHOD" description="정기 결제에 사용할 카드를 관리합니다."><div className="p-4">{complete ? <div className="py-4 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-[#7b2ff7]" /><p className="mt-3 text-sm font-black text-[#28222f]">카드 등록 준비가 완료되었습니다</p><p className="mx-auto mt-2 max-w-[280px] text-[11px] leading-5 text-[#817987]">실제 카드번호는 이 화면에서 수집하거나 저장하지 않습니다. 개발사 결제창과 PG 인증 API를 연결하면 등록이 진행됩니다.</p><button type="button" onClick={() => setComplete(false)} className="mt-4 text-xs font-black text-[#6f2bd9]">현재 카드 보기</button></div> : <><div className="flex items-center gap-3 rounded-2xl bg-[#211a2c] p-4 text-white"><CreditCard className="h-6 w-6 text-[#e1bf67]" /><div className="flex-1"><p className="text-sm font-black">신한카드 · 개인</p><p className="mt-1 text-[11px] text-white/45">**** **** **** 1458</p></div><span className="text-[10px] font-bold text-[#e1bf67]">사용 중</span></div><p className="mt-3 text-[10px] leading-4 text-[#918897]">표시된 번호는 데모용 마스킹 값입니다. 실제 결제 정보는 저장하지 않습니다.</p><button type="button" onClick={() => setComplete(true)} className="gold-fill mt-4 h-11 w-full rounded-xl text-xs font-black">개발사 결제창 연결하기</button></>}</div></DemoSettingsPage>;
}

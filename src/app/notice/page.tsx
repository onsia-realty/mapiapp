"use client";

import { useState } from "react";
import { Bell, ChevronDown, Megaphone } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";

const NOTICES = [
  { date: "2026.09.22", tag: "안내", title: "마피 1차 데모 오픈 안내", body: "분양권 전매, 이자만 매물, 구인구직과 역할별 MY 화면을 한 번에 체험할 수 있습니다." },
  { date: "2026.09.18", tag: "업데이트", title: "프리미엄 매물 노출 방식이 개선되었습니다", body: "골드 프레스티지 디자인과 가로 스크롤 카드로 핵심 매물을 더 빠르게 비교할 수 있습니다." },
  { date: "2026.09.12", tag: "점검", title: "데모 데이터 정기 점검 안내", body: "표시되는 매물과 구인 공고는 시연을 위한 샘플 데이터이며 실제 계약 정보가 아닙니다." },
];

export default function NoticePage() {
  const [open, setOpen] = useState(0);
  return <MobileLayout><PageHeader title="공지사항" /><div className="space-y-4 px-4 pb-8 pt-4"><section className="rounded-[22px] bg-[#211a2c] p-5 text-white"><Megaphone className="h-6 w-6 text-[#e4c36d]" /><h1 className="mt-4 text-xl font-black">마피 소식</h1><p className="mt-2 text-xs text-white/50">서비스 업데이트와 운영 안내를 확인하세요.</p></section><div className="overflow-hidden rounded-[20px] border border-[#ebe7ef] bg-white">{NOTICES.map((notice, index) => <article key={notice.title} className="border-b border-[#f0edf3] last:border-0"><button type="button" onClick={() => setOpen(open === index ? -1 : index)} className="flex w-full items-start gap-3 px-4 py-4 text-left"><div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f0eafd]"><Bell className="h-4 w-4 text-[#7130d0]" /></div><div className="flex-1"><div className="flex items-center gap-2"><span className="text-[10px] font-black text-[#9d7530]">{notice.tag}</span><span className="text-[10px] text-[#aaa2b2]">{notice.date}</span></div><h2 className="mt-1 text-sm font-black leading-5 text-[#28222f]">{notice.title}</h2></div><ChevronDown className={`mt-2 h-4 w-4 text-[#aaa2b2] transition ${open === index ? "rotate-180" : ""}`} /></button>{open === index && <p className="bg-[#f8f6fa] px-4 py-4 text-xs leading-5 text-[#716979]">{notice.body}</p>}</article>)}</div></div></MobileLayout>;
}

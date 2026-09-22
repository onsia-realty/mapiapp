"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, Headphones, MessageCircle, Phone } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";

const FAQS = [
  ["매물 등록은 누가 할 수 있나요?", "중개사 데모 계정으로 로그인하면 매물 등록과 등록 현황 메뉴를 확인할 수 있습니다."],
  ["분양권과 이자만 매물은 어떻게 다른가요?", "분양권 전매는 매매 조건 중심, 이자만 매물은 금융 조건과 지원 내용을 중심으로 안내합니다."],
  ["구인 공고는 어디에서 등록하나요?", "구인구직 화면의 공고 등록 버튼 또는 분양사·중개사 전용 메뉴에서 등록할 수 있습니다."],
  ["결제 기능도 체험할 수 있나요?", "1차 데모에서는 상품 선택과 완료 화면까지 확인하며 실제 결제는 발생하지 않습니다."],
];

export default function SupportPage() {
  const [open, setOpen] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <MobileLayout>
      <PageHeader title="고객센터" />
      <div className="space-y-5 px-4 pb-8 pt-4">
        <section className="rounded-[24px] bg-[#211a2c] p-5 text-white">
          <div className="gold-fill flex h-11 w-11 items-center justify-center rounded-2xl"><Headphones className="h-5 w-5" /></div>
          <h1 className="mt-4 text-xl font-black">무엇을 도와드릴까요?</h1>
          <p className="mt-2 text-xs leading-5 text-white/50">자주 묻는 질문을 확인하거나 데모 문의를 남겨보세요.</p>
          <div className="mt-4 flex gap-2 text-[11px]"><span className="rounded-full bg-white/8 px-3 py-1.5">평일 09:00–18:00</span><span className="rounded-full bg-white/8 px-3 py-1.5">점심 12:00–13:00</span></div>
        </section>

        <section>
          <h2 className="mb-3 px-1 text-lg font-black text-[#211b29]">자주 묻는 질문</h2>
          <div className="overflow-hidden rounded-[20px] border border-[#ebe7ef] bg-white">
            {FAQS.map(([question, answer], index) => (
              <div key={question} className="border-b border-[#f0edf3] last:border-0">
                <button type="button" onClick={() => setOpen(open === index ? null : index)} className="flex w-full items-center gap-3 px-4 py-4 text-left"><span className="gold-text text-xs font-black">Q</span><span className="flex-1 text-sm font-bold text-[#28222f]">{question}</span><ChevronDown className={`h-4 w-4 text-[#aaa2b2] transition ${open === index ? "rotate-180" : ""}`} /></button>
                {open === index && <p className="bg-[#f8f6fa] px-9 py-4 text-xs leading-5 text-[#716979]">{answer}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[20px] border border-[#ebe7ef] bg-white p-4">
          {submitted ? <div className="py-4 text-center"><CheckCircle2 className="mx-auto h-9 w-9 text-[#7b2ff7]" /><p className="mt-3 text-sm font-black text-[#28222f]">문의가 접수되었습니다</p><p className="mt-1 text-xs text-[#817987]">데모 접수번호 MAPI-0922</p><button type="button" onClick={() => setSubmitted(false)} className="mt-4 text-xs font-bold text-[#6f2bd9]">새 문의 작성</button></div> : <><h2 className="text-base font-black text-[#28222f]">1:1 문의</h2><p className="mt-1 text-xs text-[#817987]">문의 유형을 선택하면 데모 접수 상태를 확인할 수 있습니다.</p><div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => setSubmitted(true)} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#eee8fa] text-xs font-black text-[#6f2bd9]"><MessageCircle className="h-4 w-4" /> 채팅 문의</button><button type="button" onClick={() => setSubmitted(true)} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#211a2c] text-xs font-black text-white"><Phone className="h-4 w-4" /> 전화 문의</button></div></>}
        </section>
      </div>
    </MobileLayout>
  );
}

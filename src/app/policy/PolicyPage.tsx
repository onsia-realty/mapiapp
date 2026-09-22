import { AlertCircle } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";

export interface PolicySection { title: string; body: string }

export function PolicyPage({ title, updated = "2026.09.22", sections }: { title: string; updated?: string; sections: PolicySection[] }) {
  return <MobileLayout><PageHeader title={title} /><div className="space-y-4 px-4 pb-8 pt-4"><div className="rounded-2xl border border-[#ead9a7] bg-[#fff9e9] p-4"><div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#a97819]" /><div><p className="text-xs font-black text-[#7b5714]">개발사 전달용 샘플 문구</p><p className="mt-1 text-[11px] leading-5 text-[#8a744b]">1차 데모의 화면 구성을 위한 예시입니다. 출시 전 법률 검토와 실제 사업자 정책 반영이 필요합니다.</p></div></div></div><section className="rounded-[20px] border border-[#ebe7ef] bg-white p-5"><div className="border-b border-[#f0edf3] pb-4"><p className="gold-text text-[10px] font-black tracking-[.18em]">MAPI POLICY</p><h1 className="mt-2 text-xl font-black text-[#211b29]">{title}</h1><p className="mt-2 text-[10px] text-[#9b939f]">최종 수정일 {updated}</p></div><div className="space-y-6 pt-5">{sections.map((section, index) => <article key={section.title}><h2 className="text-sm font-black text-[#302938]">제{index + 1}조 {section.title}</h2><p className="mt-2 whitespace-pre-line text-xs leading-6 text-[#716979]">{section.body}</p></article>)}</div></section></div></MobileLayout>;
}

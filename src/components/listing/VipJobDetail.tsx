import Image from "next/image";
import Link from "next/link";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import type { JobItem } from "@/lib/vip-jobs";

export function VipJobDetail({ job }: { job: JobItem }) {
  return <MobileLayout><PageHeader title="VIP 파트너 소개" /><main className="bg-[#F4F0E8] pb-12">
    <div className="relative aspect-[4/5] bg-[#17131D]"><Image src={job.image} alt="" fill sizes="430px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6 text-white"><p className="text-xs font-bold tracking-widest text-[#E6C56D]">VIP 광고 · SAMPLE</p><h1 className="mt-4 whitespace-pre-line text-3xl font-black leading-tight">{job.title}</h1><p className="mt-4 text-sm">{job.audience} · {job.region}</p></div></div>
    <div className="space-y-6 p-5"><p className="text-xs leading-6 text-[#756D7E]">VIP 소개 화면의 예시입니다. 실제 모집 중인 공고나 결제 완료된 광고가 아니며, 사진은 분위기 연출용입니다.</p>
      <section className="border-y border-[#CFC8BD] py-6"><h2 className="text-lg font-black">함께 일할 기회</h2><dl className="mt-4 space-y-4 text-sm">{[["모집 분야", job.audience], ["활동 지역", job.region], ["보수 예시", job.pay]].map(([label, value]) => <div key={label} className="flex justify-between gap-4"><dt className="text-[#756D7E]">{label}</dt><dd className="text-right font-bold">{value}</dd></div>)}</dl></section>
      <section><h2 className="text-lg font-black">사진 너머의 현장을 보여주세요.</h2><p className="mt-3 text-sm leading-7 text-[#756D7E]">실제 공고에는 사무소·현장 소개 영상과 근무 조건, 담당자 정보를 함께 표시합니다. 영상은 공고 작성 화면에서 YouTube 링크로 등록할 수 있습니다.</p></section>
      <Link href="/jobs/write" className="block rounded-xl bg-[#211B29] p-4 text-center text-sm font-bold text-white">우리 팀 공고 작성하기</Link>
      <Link href="/jobs" className="block text-center text-sm underline">구인구직으로 돌아가기</Link>
    </div>
  </main></MobileLayout>;
}

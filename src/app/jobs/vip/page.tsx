import Link from "next/link";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";

export default function VipPage() {
  return <MobileLayout><PageHeader title="VIP 파트너 소개" /><main className="bg-[#F4F0E8] px-5 py-9">
    <p className="text-xs font-bold tracking-widest text-[#94702D]">MAPI JOBS · VIP</p>
    <h1 className="mt-4 text-3xl font-black leading-tight">우리 팀의 가치를<br />먼저 보여주세요.</h1>
    <p className="mt-5 text-sm leading-7 text-[#756D7E]">공인중개사무소와 분양현장을 소개하는 유료 광고 상품입니다. 대표 이미지와 채용 조건, 소개 영상을 공고 상세까지 연결합니다.</p>
    <ol className="mt-8 space-y-5 text-sm">{["공고와 대표 이미지 · 소개 영상 등록", "광고 상품 및 노출 기간 선택", "결제 완료 후 운영자 검수", "승인된 기간 동안 VIP 영역에 노출"].map((text, index) => <li key={text} className="border-t border-[#CFC8BD] pt-4"><span className="mr-3 text-[#94702D]">0{index + 1}</span>{text}</li>)}</ol>
    <p className="mt-8 rounded-xl bg-white p-4 text-xs leading-6 text-[#756D7E]">현재 상품 구성 미리보기입니다. VIP 가격·노출 기간은 확정 전이며 이 화면에서 결제되지 않습니다. VIP 노출은 추천 순위나 자격 인증을 의미하지 않습니다.</p>
    <Link href="/jobs/write" className="mt-6 block rounded-xl bg-[#211B29] p-4 text-center text-sm font-bold text-white">소개할 공고 작성하기</Link>
  </main></MobileLayout>;
}

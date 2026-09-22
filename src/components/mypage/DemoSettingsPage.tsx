import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";

interface DemoSettingsPageProps {
  title: string;
  eyebrow: string;
  description: string;
  children: React.ReactNode;
}

export function DemoSettingsPage({ title, eyebrow, description, children }: DemoSettingsPageProps) {
  return (
    <MobileLayout hideNav>
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-[#332b45] bg-[#17121f]/95 px-4 text-white backdrop-blur-xl">
        <Link href="/mypage/subscription" aria-label="뒤로" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/8"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-base font-black">{title}</h1>
      </header>
      <div className="px-4 py-5">
        <section className="rounded-[22px] bg-[#211a2c] p-5 text-white">
          <p className="gold-text text-[10px] font-black tracking-[.18em]">{eyebrow}</p>
          <h2 className="mt-2 text-xl font-black">{title}</h2>
          <p className="mt-2 text-xs leading-5 text-white/50">{description}</p>
        </section>
        <div className="mt-4 overflow-hidden rounded-[20px] border border-[#ebe7ef] bg-white">{children}</div>
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-[#eee9f8] px-4 py-3 text-[11px] leading-5 text-[#685e75]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#7b2ff7]" />1차 데모용 화면입니다. 실제 결제 및 변경 처리는 개발사 API 연동 단계에서 연결합니다.</div>
      </div>
    </MobileLayout>
  );
}

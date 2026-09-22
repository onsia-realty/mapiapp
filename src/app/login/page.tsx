"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Check, Lock, Mail, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { DEMO_ACCOUNTS, DemoRole, findDemoAccount, saveDemoSession } from "@/lib/demo-auth";

const ROLE_COPY: Record<DemoRole, { eyebrow: string; description: string }> = {
  broker: { eyebrow: "중개사", description: "매물·문의·구인 관리" },
  sales: { eyebrow: "분양사", description: "현장·상담·채용 관리" },
  general: { eyebrow: "일반", description: "관심 매물·문의 관리" },
};

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<DemoRole>("broker");
  const [email, setEmail] = useState(DEMO_ACCOUNTS[0].email);
  const [password, setPassword] = useState(DEMO_ACCOUNTS[0].password);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const selectAccount = (role: DemoRole) => {
    const account = DEMO_ACCOUNTS.find((item) => item.role === role)!;
    setSelectedRole(role);
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const account = findDemoAccount(email, password);
    if (!account) {
      setError("데모 계정 이메일과 비밀번호를 확인해주세요.");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    saveDemoSession(account.role);
    router.push("/more");
  };

  return (
    <main className="min-h-screen bg-[#17121f] px-5 pb-10 pt-[max(32px,env(safe-area-inset-top))] text-white">
      <div className="mx-auto w-full max-w-[430px]">
        <div className="mb-8 flex items-center gap-3">
          <div className="gold-fill flex h-12 w-12 items-center justify-center rounded-2xl"><Building2 className="h-6 w-6" /></div>
          <div>
            <p className="gold-text text-[11px] font-black tracking-[.24em]">MAPI PREMIUM</p>
            <h1 className="mt-0.5 text-2xl font-black tracking-tight">마피 로그인</h1>
          </div>
        </div>

        <section className="rounded-[26px] border border-white/10 bg-white/[.06] p-5 shadow-[0_24px_70px_rgba(0,0,0,.28)] backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#e4c36d]" /><p className="text-sm font-bold">체험할 역할을 선택하세요</p></div>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((account) => {
              const active = selectedRole === account.role;
              return (
                <button key={account.role} type="button" onClick={() => selectAccount(account.role)} className={`relative rounded-2xl border px-2 py-3 text-left transition ${active ? "border-[#d7ae54] bg-[#d7ae54]/15 shadow-[0_0_0_1px_rgba(215,174,84,.2)]" : "border-white/10 bg-white/[.04] text-white/60"}`}>
                  {active && <Check className="absolute right-2 top-2 h-3.5 w-3.5 text-[#edcf7e]" />}
                  <p className={`text-[13px] font-black ${active ? "text-[#f1d789]" : "text-white/75"}`}>{ROLE_COPY[account.role].eyebrow}</p>
                  <p className="mt-1 text-[9.5px] leading-4 text-white/45">{ROLE_COPY[account.role].description}</p>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-white/65">이메일</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 focus-within:border-[#d7ae54]/70">
                <Mail className="h-4 w-4 text-white/35" />
                <input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} className="h-13 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25" placeholder="이메일을 입력하세요" autoComplete="username" />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-white/65">비밀번호</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 focus-within:border-[#d7ae54]/70">
                <Lock className="h-4 w-4 text-white/35" />
                <input type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} className="h-13 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25" placeholder="비밀번호를 입력하세요" autoComplete="current-password" />
              </div>
            </label>
            {error && <p className="rounded-xl bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-300">{error}</p>}
            <button type="submit" disabled={isLoading} className="gold-fill flex h-13 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black disabled:opacity-60">
              {isLoading ? "로그인 중..." : "데모 로그인"}{!isLoading && <ShieldCheck className="h-4 w-4" />}
            </button>
          </form>
        </section>

        <div className="mt-5 rounded-2xl border border-white/8 bg-white/[.035] px-4 py-3">
          <div className="flex items-start gap-2.5"><UserRound className="mt-0.5 h-4 w-4 shrink-0 text-[#d7ae54]" /><p className="text-[11px] leading-[1.65] text-white/48">위 계정은 화면 확인을 위한 데모 전용입니다. 역할 카드를 누르면 제공된 테스트 계정이 자동으로 입력됩니다.</p></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href="/signup" className="flex h-12 items-center justify-center rounded-2xl border border-[#d7ae54]/35 bg-[#d7ae54]/10 text-xs font-black text-[#efd587]">회원·중개사 등록</Link>
          <Link href="/broker-guide" className="flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs font-black text-white/65">중개사 광고 안내</Link>
        </div>
      </div>
    </main>
  );
}

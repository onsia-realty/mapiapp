"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronRight, LogOut, Moon, ShieldCheck, Smartphone, User } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { clearDemoSession, useDemoSession } from "@/lib/demo-auth";

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return <button type="button" role="switch" aria-checked={enabled} onClick={onChange} className={`relative h-7 w-12 rounded-full transition ${enabled ? "bg-[#7b2ff7]" : "bg-[#d9d4dd]"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${enabled ? "left-6" : "left-1"}`} /></button>;
}

export default function SettingsPage() {
  const router = useRouter();
  const account = useDemoSession();
  const [marketing, setMarketing] = useState(true);
  const [activity, setActivity] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const logout = () => { clearDemoSession(); router.push("/login"); };

  return <MobileLayout><PageHeader title="설정" /><div className="space-y-4 px-4 pb-8 pt-4">
    <section className="rounded-[20px] bg-[#211a2c] p-4 text-white"><div className="flex items-center gap-3"><div className="gold-fill flex h-11 w-11 items-center justify-center rounded-2xl"><User className="h-5 w-5" /></div><div className="flex-1"><p className="text-sm font-black">{account?.name ?? "로그인 전"}</p><p className="mt-1 text-[11px] text-white/45">{account ? `${account.roleLabel} · ${account.email}` : "데모 계정으로 로그인해주세요"}</p></div>{!account && <Link href="/login" className="text-xs font-black text-[#e4c36d]">로그인</Link>}</div></section>
    <section><p className="mb-2 px-1 text-[11px] font-black text-[#918897]">알림 설정</p><div className="overflow-hidden rounded-[20px] border border-[#ebe7ef] bg-white"><div className="flex items-center gap-3 border-b border-[#f0edf3] px-4 py-4"><Bell className="h-5 w-5 text-[#6f2bd9]" /><div className="flex-1"><p className="text-sm font-bold text-[#28222f]">활동 알림</p><p className="mt-1 text-[10px] text-[#8b8393]">문의·관심·공고 상태</p></div><Toggle enabled={activity} onChange={() => setActivity(!activity)} /></div><div className="flex items-center gap-3 border-b border-[#f0edf3] px-4 py-4"><Smartphone className="h-5 w-5 text-[#6f2bd9]" /><div className="flex-1"><p className="text-sm font-bold text-[#28222f]">혜택 알림</p><p className="mt-1 text-[10px] text-[#8b8393]">이벤트·상품 소식</p></div><Toggle enabled={marketing} onChange={() => setMarketing(!marketing)} /></div><div className="flex items-center gap-3 px-4 py-4"><Moon className="h-5 w-5 text-[#6f2bd9]" /><div className="flex-1"><p className="text-sm font-bold text-[#28222f]">다크 모드</p><p className="mt-1 text-[10px] text-[#8b8393]">개발 예정 기능</p></div><Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} /></div></div></section>
    <section><p className="mb-2 px-1 text-[11px] font-black text-[#918897]">앱 정보</p><div className="overflow-hidden rounded-[20px] border border-[#ebe7ef] bg-white"><div className="flex items-center gap-3 border-b border-[#f0edf3] px-4 py-4"><ShieldCheck className="h-5 w-5 text-[#6f2bd9]" /><span className="flex-1 text-sm font-bold text-[#28222f]">현재 버전</span><span className="text-xs text-[#8b8393]">v1.0.0-demo</span></div><Link href="/policy/privacy" className="flex items-center gap-3 px-4 py-4"><ShieldCheck className="h-5 w-5 text-[#6f2bd9]" /><span className="flex-1 text-sm font-bold text-[#28222f]">개인정보처리방침</span><ChevronRight className="h-4 w-4 text-[#bbb4c4]" /></Link></div></section>
    {account && <button type="button" onClick={logout} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#ded8e4] bg-white text-sm font-bold text-[#6b6472]"><LogOut className="h-4 w-4" /> 로그아웃</button>}
  </div></MobileLayout>;
}

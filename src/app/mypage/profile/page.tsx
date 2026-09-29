"use client";
import { useState } from "react";
import Link from "next/link";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { useDemoSession } from "@/lib/demo-auth";

function Editor({ role, initialName, initialCompany }: { role: string; initialName: string; initialCompany: string }) {
  const [name, setName] = useState(initialName);
  const [company, setCompany] = useState(initialCompany);
  const [status, setStatus] = useState("");
  return <form className="space-y-5 px-5 py-8" onSubmit={(e) => { e.preventDefault(); if (!name.trim()) { setStatus("이름을 입력해주세요."); return; } try { localStorage.setItem(`mapi-profile-${role}`, JSON.stringify({ name: name.trim(), company: company.trim() })); window.dispatchEvent(new Event("mapi-demo-auth")); setStatus("이 브라우저에 프로필을 저장했습니다."); } catch { setStatus("저장하지 못했습니다. 브라우저 설정을 확인해주세요."); } }}>
    <label className="block text-sm font-bold">사용자명 *<input required maxLength={40} value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-xl border p-3" /></label>
    {role !== "general" && <label className="block text-sm font-bold">소속 · 사무소 표시명<input maxLength={80} value={company} onChange={(e) => setCompany(e.target.value)} className="mt-2 w-full rounded-xl border p-3" /></label>}
    <p className="text-xs leading-6 text-gray-500">표시명은 이 브라우저에 저장됩니다. 사업자 인증 정보와 휴대폰 번호는 여기서 변경되지 않습니다.</p>
    <button className="w-full rounded-xl bg-[#211B29] p-4 text-sm font-bold text-white">변경사항 저장</button>
    {status && <p role="status" className="text-sm">{status}</p>}
    <Link href="/mypage" className="block text-center text-sm underline">MY로 돌아가기</Link>
  </form>;
}
export default function ProfilePage() {
  const account = useDemoSession();
  return <MobileLayout><PageHeader title="프로필 편집" />{account ? <Editor key={account.role} role={account.role} initialName={account.name} initialCompany={account.company} /> : <div className="p-8 text-center"><Link href="/login">로그인 후 프로필을 편집해주세요.</Link></div>}</MobileLayout>;
}

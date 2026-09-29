"use client";
import { use, useSyncExternalStore } from "react";
import { JobVideo } from "@/components/listing/JobVideo";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";

function subscribe(callback: () => void) { window.addEventListener("storage", callback); return () => window.removeEventListener("storage", callback); }
export default function SavedJob({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const raw = useSyncExternalStore(subscribe, () => { try { return localStorage.getItem(`mapi-job-${id}`); } catch { return null; } }, () => null);
  let job: Record<string, string> | null = null;
  try {
    const data: unknown = raw ? JSON.parse(raw) : null;
    if (data && typeof data === "object" && !Array.isArray(data) && "title" in data && typeof data.title === "string" && data.title.trim() && "company" in data && typeof data.company === "string" && "jobType" in data && (data.jobType === "공인 중개사" || data.jobType === "분양 상담사") && Object.values(data).every((value) => typeof value === "string")) {
      job = data as Record<string, string>;
    }
  } catch {}
  const savedConditions = job ? Object.entries(job).filter(([key]) => key.startsWith("condition:")).map(([key, value]) => [key.slice("condition:".length), value]) : [];
  const rows = savedConditions.length ? savedConditions : job ? [["근무지", job.address], ["근무시간", job.workTime], ["휴무", job.holiday], ["보수 방식", job.payType], ...(job.jobType === "분양 상담사" ? [["일비", job.dailyPay ? `${job.dailyPay}원` : "미제공"]] : []), ["담당자", job.manager], ["연락처", job.phone]] : [];
  return <MobileLayout><PageHeader title="내 공고 미리보기" /><main className="space-y-5 px-5 py-8">
    {!job ? <p className="text-sm leading-6">이 브라우저에 저장된 공고를 찾을 수 없습니다. 공고를 등록한 브라우저에서 확인해주세요.</p> : <>
      <p className="text-xs font-bold text-[#94702D]">비공개 미리보기 · 이 브라우저에 저장</p>
      <p className="text-xs leading-5 text-gray-500">공개 게시나 운영자 접수는 진행되지 않았습니다. 브라우저 데이터를 삭제하면 이 공고도 삭제됩니다.</p>
      <h1 className="text-2xl font-black">{job.title}</h1><p className="text-sm">{job.company} · {job.jobType}</p>
      {job.videoUrl && <JobVideo url={job.videoUrl} />}
      <p className="whitespace-pre-wrap text-sm leading-7">{job.content}</p>
      <dl className="divide-y rounded-2xl border bg-white px-4">{rows.map(([label, value]) => <div key={label} className="py-3"><dt className="text-xs text-gray-500">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm">{value || "미입력"}</dd></div>)}</dl>
      {job.phone && /^[0-9+() -]+$/.test(job.phone) && <a className="block rounded-xl bg-[#211B29] p-4 text-center text-sm font-bold text-white" href={`tel:${job.phone.replace(/[^0-9+]/g, "")}`}>전화 문의</a>}
    </>}
  </main></MobileLayout>;
}

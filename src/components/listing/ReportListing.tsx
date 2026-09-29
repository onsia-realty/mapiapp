"use client";
import { useState } from "react";

export function ReportListing({ listingId }: { listingId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("거래 완료된 매물");
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  function saveReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const detail = message.trim();
    if (detail.length < 10) {
      setError("상세 내용은 앞뒤 공백을 제외하고 10자 이상 입력해주세요.");
      return;
    }
    try {
      const key = `mapi-report-${listingId}`;
      const raw = localStorage.getItem(key);
      const previous: unknown = raw ? JSON.parse(raw) : null;
      const reports = previous === null ? [] : Array.isArray(previous) ? previous : [previous];
      localStorage.setItem(key, JSON.stringify([...reports, { listingId, reason, message: detail, createdAt: new Date().toISOString() }]));
      setSaved(true);
      setError("");
    } catch {
      setError("저장에 실패했습니다. 브라우저 저장 공간을 확인해주세요.");
    }
  }
  return <section className="my-5 rounded-2xl border border-[#DED7E5] bg-white p-4">
    <button type="button" aria-expanded={open} onClick={() => { setOpen(!open); setSaved(false); }} className="w-full text-left text-sm font-bold">허위매물 신고 {open ? "−" : "+"}</button>
    {open && (saved ? <p role="status" className="mt-4 text-sm leading-6">신고 내용이 이 브라우저에 저장되었습니다. 현재 데모에서는 운영자에게 전송되지 않습니다.</p> :
      <form className="mt-4 space-y-3" onSubmit={saveReport}>
        <p className="text-xs text-gray-500">대상 매물: {listingId}</p>
        <label className="block text-xs font-bold">신고 사유<select className="mt-2 w-full rounded-xl border p-3 text-sm" value={reason} onChange={(e) => setReason(e.target.value)}>{["거래 완료된 매물", "가격·정보가 다름", "중복·무단 등록", "연락 불가", "기타"].map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="block text-xs font-bold">상세 내용<textarea required minLength={10} maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)} className="mt-2 min-h-28 w-full rounded-xl border p-3 text-sm" placeholder="확인이 필요한 내용을 10자 이상 입력해주세요." /></label>
        <p className="text-xs leading-5 text-gray-500">주민등록번호 등 민감한 개인정보는 입력하지 마세요. 이 데모는 브라우저 저장까지만 지원합니다.</p>
        {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
        <button className="w-full rounded-xl bg-[#211B29] p-3 text-sm font-bold text-white">신고 내용 저장</button>
      </form>)}
  </section>;
}

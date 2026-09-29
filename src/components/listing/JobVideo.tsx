"use client";
import { useState } from "react";
import { Play } from "lucide-react";
import { youtubeId } from "@/lib/job-video";

export function JobVideo({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(url);
  if (!id) return null;
  return <div className="overflow-hidden rounded-2xl bg-[#211B29] text-white">
    {playing ? <iframe key={id} className="aspect-video min-h-[200px] w-full border-0" src={`https://www.youtube-nocookie.com/embed/${id}?playsinline=1&rel=0`} title="공고 소개 영상" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> :
      <button type="button" onClick={() => setPlaying(true)} className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#392754] to-[#17131D]"><span className="gold-fill grid h-14 w-14 place-items-center rounded-full"><Play className="h-6 w-6" /></span><span className="text-sm font-bold">영상으로 먼저 만나보세요</span><span className="text-xs text-white/60">재생기를 열면 YouTube에 연결됩니다</span></button>}
    <div className="flex items-center justify-between gap-2 px-4 py-3 text-xs text-white/65"><span>재생되지 않는 영상은 원본에서 확인하세요.</span><a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[#E6C56D] underline">YouTube 열기</a></div>
  </div>;
}

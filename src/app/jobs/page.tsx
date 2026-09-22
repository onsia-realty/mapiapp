"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

/* =========================================================================
   구인구직 메인 — 마피 앱 원본 배열(캡처 80) 기준, 디자인만 MAPI 토큰 적용
   ① 구인/구직 토글 + 작성 버튼
   ② 혜택 배너
   ③ 광고 카드 2종: 공인중개사(/jobs/agents) · 분양상담사(/jobs/sales)
   ④ ❤️ HOT 공고 (2열)
   ⑤ 📍 지역별 현장 (지역 칩 + 공고 리스트)
   ========================================================================= */

const REGIONS = ["전국", "서울", "경기", "인천", "부산", "대구", "광주"];

const AD_IMAGE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop";
const AD_IMAGE2 = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop";

// Mock — 마피 앱 원본 데이터 유지
const HOT_ADS = [
  { id: "guin1", company: "마피 중개사", title: "샘플 아파트 공인 중개사", image: AD_IMAGE },
  { id: "guin1", company: "마피 중개사", title: "샘플 아파트 공인 중개사", image: AD_IMAGE2 },
];

const REGION_JOBS = [
  { id: "guin1", title: "샘플 아파트 공인 중개사", company: "마피 중개사", region: "서울 마포구", career: "경력 1년 이상", image: AD_IMAGE },
  { id: "guin1", title: "샘플 아파트 공인 중개사", company: "마피 중개사", region: "서울 마포구", career: "경력 1년 이상", image: AD_IMAGE2 },
];

// 구직 목록 mock — 마피 앱(캡처 82)과 동일 데이터
const GUJIK_POSTS = [
  { id: "gujik1", availability: "즉시협의", title: "안녕하세요 분양 대행사 주식회사", date: "2026.01.16", career: "경력 10년 이상 · 공인중개사" },
  { id: "gujik2", availability: "5월", title: "테스트구직글작성중입니다", date: "2026.04.07", career: "경력 무관" },
];

export default function JobsPage() {
  const [mainTab, setMainTab] = useState<"구인" | "구직">("구인");
  const [activeRegion, setActiveRegion] = useState("전국");

  return (
    <MobileLayout>
      <PageHeader title="구인구직">
        {/* ① 구인/구직 토글 + 작성 버튼 (원본 배열) */}
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex bg-[#F3F0FA] rounded-full p-1">
            {(["구인", "구직"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMainTab(tab)}
                className={cn(
                  "px-5 py-1.5 rounded-full text-[13.5px] font-bold transition-colors",
                  mainTab === tab ? "bg-[#1B1330] text-white" : "text-[#6E6787]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <Link
            href={mainTab === "구인" ? "/jobs/write" : "/jobs/gujik/write"}
            className="px-4 py-1.5 rounded-full text-[13px] text-white font-extrabold shadow-[0_4px_12px_rgba(123,47,247,.3)]"
            style={{ background: "linear-gradient(135deg,#7B2FF7,#A855F7)" }}
          >
            {mainTab === "구인" ? "구인글 작성" : "구직글 작성"}
          </Link>
        </div>
      </PageHeader>

      {mainTab === "구인" ? (
        <div className="px-4 pt-4 pb-10 space-y-6">
          {/* ② 혜택 배너 */}
          <div
            className="rounded-[18px] px-[22px] py-5 relative overflow-hidden"
            style={{ background: "linear-gradient(115deg,#17130B 0%,#2E2410 60%,#4A3A14 100%)" }}
          >
            <div
              className="absolute -right-[30px] -top-[30px] w-[130px] h-[130px] rounded-full"
              style={{ background: "rgba(212,175,55,.18)", filter: "blur(34px)" }}
            />
            <div className="text-[10.5px] font-extrabold text-[#D9B54A] tracking-[1.6px] mb-[7px]">
              중개업소 추천 가입 혜택
            </div>
            <div className="text-[15.5px] font-extrabold text-white tracking-[-0.3px] leading-[1.4]">
              매물등록 10회권 지급 · <span className="text-[#EBD79A]">구인구직 1회권</span> 지급
            </div>
          </div>

          {/* ③ 광고 카드 2종 — 공인중개사 / 분양상담사 (원본 배열) */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: "/jobs/agents", label: "공인중개사", count: "2개 광고", image: AD_IMAGE },
              { href: "/jobs/sales", label: "분양상담사", count: "2개 광고", image: AD_IMAGE2 },
            ].map((ad) => (
              <Link
                key={ad.href}
                href={ad.href}
                className="relative h-28 rounded-[20px] overflow-hidden block active:scale-[0.97] transition-transform"
              >
                <Image src={ad.image} alt={ad.label} fill className="object-cover" sizes="180px" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1330]/90 to-[#1B1330]/20 flex flex-col items-start justify-end p-3">
                  <div className="text-white text-[14px] font-extrabold">🏠 {ad.label}</div>
                  <div className="text-[#EBD79A] text-[11px] font-bold">{ad.count}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* ④ HOT 공고 (원본 배열) */}
          <div>
            <h2 className="text-base font-extrabold text-[#1B1330] tracking-[-0.3px] mb-3">
              ❤️ HOT 공고
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {HOT_ADS.map((ad, i) => (
                <Link
                  key={i}
                  href={`/jobs/${ad.id}`}
                  className="bg-white rounded-[16px] overflow-hidden shadow-[0_3px_12px_rgba(27,19,48,.05)] active:scale-[0.97] transition-transform"
                >
                  <div className="relative h-24">
                    <Image src={ad.image} alt={ad.title} fill className="object-cover" sizes="180px" />
                    <span className="absolute top-2 left-2 bg-[#FF3B5C] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                      HOT
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="text-[10.5px] text-[#9A93AC] font-bold">{ad.company}</div>
                    <div className="text-[13.5px] font-extrabold text-[#1B1330] mt-0.5 leading-[1.3]">
                      {ad.title}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ⑤ 지역별 현장 (원본 배열) */}
          <div>
            <h2 className="text-base font-extrabold text-[#1B1330] tracking-[-0.3px] mb-3">
              📍 지역별 현장
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-1 mb-3">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setActiveRegion(region)}
                  className={cn(
                    "shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-colors",
                    activeRegion === region
                      ? "bg-[#1B1330] text-white border-[#1B1330]"
                      : "bg-white text-[#6E6787] border-[#E9E4F5]"
                  )}
                >
                  {region}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {REGION_JOBS.map((job, i) => (
                <Link
                  key={i}
                  href={`/jobs/${job.id}`}
                  className="bg-white rounded-[20px] p-4 flex items-center gap-3 shadow-[0_2px_10px_rgba(27,19,48,.05)] active:scale-[0.98] transition-transform"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-extrabold text-[#1B1330] leading-[1.3]">
                      {job.title}
                    </div>
                    <div className="flex items-center gap-2 text-[12.5px] mt-1.5">
                      <span className="text-[#6E6787] font-semibold">{job.company}</span>
                      <span className="text-[#A49BBE]">{job.region}</span>
                      <span className="text-[#F97316] font-extrabold">{job.career}</span>
                    </div>
                  </div>
                  <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden">
                    <Image src={job.image} alt={job.title} fill className="object-cover" sizes="64px" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 pt-4 pb-10">
          <h2 className="text-base font-extrabold text-[#1B1330] tracking-[-0.3px] mb-3">
            💼 구직 목록
          </h2>
          <div className="space-y-3">
            {GUJIK_POSTS.map((post) => (
              <Link
                key={post.id}
                href={`/jobs/gujik/${post.id}`}
                className="block bg-white rounded-[20px] p-4 shadow-[0_2px_10px_rgba(27,19,48,.05)] active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-[#EDE9FE] text-[#7B2FF7] text-[11px] font-extrabold px-2 py-0.5 rounded-md">
                    {post.availability}
                  </span>
                  <span className="text-[11.5px] text-[#A49BBE]">{post.date}</span>
                </div>
                <div className="text-[15px] font-bold text-[#1B1330] mt-2 leading-[1.35]">
                  {post.title}
                </div>
                <div className="text-[12px] text-[#9A93AC] mt-1">{post.career}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </MobileLayout>
  );
}

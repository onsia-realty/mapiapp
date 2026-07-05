"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Bookmark } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";

/* 공인중개사 구인관 — 상세 구성은 별도 차수 예정, 우선 기본 리스트 제공 */

const IMG = {
  city1: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=600&fit=crop",
  city2: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=600&fit=crop",
  apt1: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=600&fit=crop",
};

const AGENT_POSTS = [
  {
    id: "guin1",
    category: "아파트 · 서울 마포",
    title: "샘플 아파트 공인 중개사",
    company: "마피 중개사",
    teaser: "대단지 입주장, 정예 세일즈 팀 합류 기회",
    fee: "팀원 RT 670만원",
    image: IMG.city1,
    badge: "HOT",
  },
  {
    id: "guin1",
    category: "아파트 · 인천",
    title: "루체팰리스 검단 공인 중개사",
    company: "마피 중개사",
    teaser: "검단신도시 입주장 · 경력 1년 이상",
    fee: "팀장 RT 400만원",
    image: IMG.city2,
    badge: "NEW",
  },
  {
    id: "guin1",
    category: "오피스텔 · 서울",
    title: "노블어반 강남역 공인 중개사",
    company: "마피 중개사",
    teaser: "강남 초역세권 · 신입 환영",
    fee: "팀원 RT 350만원",
    image: IMG.apt1,
  },
];

export default function AgentJobsPage() {
  return (
    <MobileLayout>
      <PageHeader title="공인중개사 구인" />

      <div className="px-4 pt-4 pb-24 space-y-3">
        {AGENT_POSTS.map((post, i) => (
          <Link
            key={i}
            href={`/jobs/${post.id}`}
            className="block bg-white rounded-[20px] p-3.5 shadow-[0_2px_10px_rgba(27,19,48,.05)] active:scale-[0.98] transition-transform"
          >
            <div className="flex gap-3.5">
              <div className="relative w-[110px] h-[110px] shrink-0 rounded-2xl overflow-hidden">
                <Image src={post.image} alt={post.title} fill className="object-cover" sizes="110px" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11.5px] font-bold text-[#9A93AC]">{post.category}</span>
                  <span className="flex items-center gap-1.5">
                    {post.badge && (
                      <span
                        className={
                          post.badge === "HOT"
                            ? "bg-[#FEE2E2] text-[#EF4444] text-[10px] font-extrabold px-1.5 py-0.5 rounded-[5px]"
                            : "bg-[#DCFCE7] text-[#16A34A] text-[10px] font-extrabold px-1.5 py-0.5 rounded-[5px]"
                        }
                      >
                        {post.badge}
                      </span>
                    )}
                    <Bookmark className="w-4 h-4 text-[#C9C2DC]" strokeWidth={2} />
                  </span>
                </div>
                <div className="text-[15.5px] font-extrabold text-[#1B1330] tracking-[-0.3px] leading-[1.3] mt-1 line-clamp-2">
                  {post.title}
                </div>
                <div className="text-[12px] text-[#6E6787] mt-1 truncate">{post.teaser}</div>
                <div className="mt-auto pt-1.5 text-[15px] font-extrabold text-[#7B2FF7]">
                  {post.fee}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/jobs/write"
        className="fixed bottom-24 z-20 left-1/2 translate-x-[55px] inline-flex items-center gap-1.5 text-white text-[13.5px] font-extrabold rounded-full pl-3.5 pr-4 py-3 shadow-[0_6px_16px_rgba(123,47,247,.4)] active:scale-95 transition-transform"
        style={{ background: "linear-gradient(135deg,#7B2FF7,#A855F7)" }}
      >
        <Plus className="w-4 h-4" strokeWidth={2.6} />
        공고 등록
      </Link>
    </MobileLayout>
  );
}

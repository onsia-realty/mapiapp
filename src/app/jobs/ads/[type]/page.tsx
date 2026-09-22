"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";

const AD_IMAGE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop";
const AD_IMAGE2 = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop";

// 개발사 앱은 광고 카드가 클릭 무반응(버그) — 데모에서는 의도된 동작으로 유형별 광고 목록을 구성
const AD_LISTS: Record<
  string,
  {
    title: string;
    ads: { id: string; company: string; title: string; category: string; roles: { role: string; fee: string }[]; image: string }[];
  }
> = {
  gongin: {
    title: "공인중개사 광고",
    ads: [
      {
        id: "guin1",
        company: "마피 중개사",
        title: "샘플 아파트 공인 중개사",
        category: "아파트 · 서울 마포구",
        roles: [
          { role: "팀장", fee: "RT 330만원" },
          { role: "팀원", fee: "RT 670만원" },
        ],
        image: AD_IMAGE,
      },
      {
        id: "guin1",
        company: "마피 중개사",
        title: "샘플 아파트 공인 중개사",
        category: "아파트 · 서울 마포구",
        roles: [{ role: "팀원", fee: "RT 500만원" }],
        image: AD_IMAGE2,
      },
    ],
  },
  bunyang: {
    title: "분양상담사 광고",
    ads: [
      {
        id: "guin1",
        company: "마피 중개사",
        title: "샘플 현장 분양 상담사",
        category: "오피스텔 · 인천",
        roles: [{ role: "영맨", fee: "RT 150만원" }],
        image: AD_IMAGE2,
      },
      {
        id: "guin1",
        company: "마피 중개사",
        title: "샘플 현장 분양 상담사",
        category: "오피스텔 · 인천",
        roles: [{ role: "신입OK", fee: "RT 120만원" }],
        image: AD_IMAGE,
      },
    ],
  },
};

export default function JobAdsPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);
  const list = AD_LISTS[type] ?? AD_LISTS.gongin;

  return (
    <MobileLayout>
      <PageHeader title={list.title} />

      <div className="px-4 pt-4 pb-10 space-y-3">
        {list.ads.map((ad, i) => (
          <Link
            key={i}
            href={`/jobs/${ad.id}`}
            className="block bg-white rounded-[20px] p-4 shadow-[0_2px_10px_rgba(27,19,48,.05)] active:scale-[0.98] transition-transform"
          >
            <div className="flex gap-3">
              <div className="relative w-[76px] h-[76px] shrink-0 rounded-2xl overflow-hidden bg-gray-200">
                <Image src={ad.image} alt={ad.title} fill className="object-cover" sizes="76px" />
                <span className="absolute top-0 left-0 bg-[#D9B54A] text-[#17130B] text-[9px] font-extrabold px-1.5 py-0.5 rounded-br-lg">
                  AD
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-[#7B2FF7]">{ad.category}</div>
                <div className="text-[15px] font-extrabold text-[#1B1330] mt-0.5 leading-[1.3]">
                  {ad.title}
                </div>
                <div className="text-[12px] text-[#9A93AC] mt-0.5">{ad.company}</div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {ad.roles.map(({ role, fee }) => (
                    <span key={role} className="inline-flex items-center gap-1">
                      <span className="bg-[#EDE9FE] text-[#7B2FF7] text-[10.5px] font-extrabold px-1.5 py-0.5 rounded-md">
                        {role}
                      </span>
                      <span className="text-[13px] font-extrabold text-[#FF3B5C]">{fee}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </MobileLayout>
  );
}

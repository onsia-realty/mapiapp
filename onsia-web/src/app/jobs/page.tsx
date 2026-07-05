"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, SlidersHorizontal, Bookmark, ChevronRight } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

/* =========================================================================
   구인구직 — 분양의신 구조·디테일 벤치마킹 + MAPI 브랜딩
   [구인] 히어로 광고 → 지역 사진칩+필터 → 🏆프리미엄 대표 현장 → 공고 리스트
   카드: 플라이어 썸네일 + 카테고리/북마크 + 제목 + 티저
        + 직책별 수수료 행(큰 숫자+만원) + 조건 칩(아이콘+빨강 "제공")
   ========================================================================= */

const IMG = {
  city1: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop",
  city2: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
  city3: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop",
  apt1: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
  apt2: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
  apt3: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600&h=400&fit=crop",
};

const REGIONS = [
  { name: "전국", image: IMG.city1 },
  { name: "서울", image: IMG.city2, hot: true },
  { name: "경기남부", image: IMG.city3, hot: true },
  { name: "인천", image: IMG.apt1 },
  { name: "부산", image: IMG.apt2 },
];

// 직책별 틴트 컬러
const POS_COLORS: Record<string, string> = {
  본부장: "bg-[#FEE2E2] text-[#DC2626]",
  팀장: "bg-[#EDE9FE] text-[#7B2FF7]",
  팀: "bg-[#DCFCE7] text-[#16A34A]",
  팀원: "bg-[#CFFAFE] text-[#0891B2]",
  영맨: "bg-[#FEF3C7] text-[#D97706]",
};

// 조건 칩 (아이콘 + 라벨 + 빨강 "제공"/값)
const WEL_ICONS: Record<string, string> = {
  영업비: "📢", MGM: "🎁", 광고비: "🅰️", 일비: "💰", 식사: "🍴", 숙소비: "🏠", 교육: "📚",
};

interface FeeRow {
  p: string;
  amount: string; // 숫자 부분 ("600", "1,300")
}
interface JobPost {
  id: string;
  type: string;
  region: string;
  title: string;
  teaser: string;
  fees: FeeRow[];
  wel: string[];
  image: string;
  flyer?: { line1: string; line2: string; grad: string }; // 플라이어형 커버 텍스트
  badge?: "HOT" | "NEW";
}

// Mock — 개발사 앱 샘플 데이터 유지 + 분양의신 수준 디테일로 확장
const PREMIUM_POSTS: JobPost[] = [
  {
    id: "guin1",
    type: "아파트",
    region: "경기",
    title: "힐스테이트 샘플더스카이",
    teaser: "샘플 주거의 판을 바꾸다!",
    fees: [{ p: "팀", amount: "600" }],
    wel: ["영업비", "MGM", "광고비", "일비"],
    image: IMG.apt1,
    flyer: { line1: "힐스테이트", line2: "샘플더스카이", grad: "linear-gradient(150deg,#FF5A79,#FFB56B)" },
    badge: "HOT",
  },
  {
    id: "guin1",
    type: "아파트",
    region: "경기남부",
    title: "샘플 파라곤 3차",
    teaser: "조건변경 들어갑니다!",
    fees: [
      { p: "본부장", amount: "150" },
      { p: "팀장", amount: "300" },
    ],
    wel: ["영업비", "MGM", "광고비", "일비"],
    image: IMG.apt2,
    flyer: { line1: "Paragon", line2: "샘플 파라곤 3차", grad: "linear-gradient(150deg,#7E22CE,#2C1B55)" },
  },
];

const NORMAL_POSTS: JobPost[] = [
  {
    id: "guin1",
    type: "오피스텔",
    region: "인천",
    title: "샘플 아이파크 오피스텔",
    teaser: "8~10% 할인분양 · 광고비 50% 지원!",
    fees: [{ p: "팀", amount: "1,300" }],
    wel: ["광고비", "일비"],
    image: IMG.apt3,
    flyer: { line1: "팀 600~1,300", line2: "할인분양 현장", grad: "linear-gradient(150deg,#2563EB,#0F2154)" },
    badge: "NEW",
  },
  {
    id: "guin1",
    type: "아파트",
    region: "서울 마포",
    title: "샘플 아파트 공인 중개사",
    teaser: "대단지 입주장, 정예 세일즈 팀 합류 기회",
    fees: [{ p: "팀원", amount: "670" }],
    wel: ["식사", "숙소비"],
    image: IMG.city1,
    badge: "HOT",
  },
  {
    id: "guin1",
    type: "아파트",
    region: "경기남부",
    title: "샘플 블루밍 시그니처 47",
    teaser: "수수료 1,000만 (계약 400 / 입주 600)",
    fees: [{ p: "팀장", amount: "1,000" }],
    wel: ["영업비", "숙소비"],
    image: IMG.city2,
    flyer: { line1: "수수료", line2: "1,000만 (400/600)", grad: "linear-gradient(150deg,#B45309,#5C2D06)" },
  },
  {
    id: "guin1",
    type: "아파트",
    region: "경기남부",
    title: "샘플역 더리브 (가칭)",
    teaser: "1,414세대 대단지 · 26년 하반기 핵심 신규현장",
    fees: [
      { p: "팀장", amount: "330" },
      { p: "팀원", amount: "670" },
    ],
    wel: ["식사", "숙소비"],
    image: IMG.city3,
    badge: "NEW",
  },
];

// 구직 목록 mock — 개발사 앱(캡처 82)과 동일 데이터
const GUJIK_POSTS = [
  { id: "gujik1", availability: "즉시협의", title: "안녕하세요 분양 대행사 주식회사", date: "2026.01.16", career: "경력 10년 이상 · 공인중개사" },
  { id: "gujik2", availability: "5월", title: "테스트구직글작성중입니다", date: "2026.04.07", career: "경력 무관" },
];

// 광고관 mock
const AD_POSTS = [
  { id: "guin1", label: "공인중개사", title: "샘플 아파트 공인 중개사", company: "마피 중개사", fees: [{ p: "팀장", amount: "330" }], image: IMG.city1 },
  { id: "guin1", label: "공인중개사", title: "샘플 아파트 공인 중개사", company: "마피 중개사", fees: [{ p: "팀원", amount: "500" }], image: IMG.city2 },
  { id: "guin1", label: "분양상담사", title: "샘플 현장 분양 상담사", company: "마피 중개사", fees: [{ p: "영맨", amount: "150" }], image: IMG.city3 },
  { id: "guin1", label: "분양상담사", title: "샘플 현장 분양 상담사", company: "마피 중개사", fees: [{ p: "팀원", amount: "120" }], image: IMG.apt1 },
];

function PosBadge({ p, size = "md" }: { p: string; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "font-extrabold rounded-md whitespace-nowrap",
        size === "sm" ? "text-[10.5px] px-1.5 py-0.5" : "text-[12px] px-2 py-1",
        POS_COLORS[p] ?? "bg-[#EDE9FE] text-[#7B2FF7]"
      )}
    >
      {p}
    </span>
  );
}

function StateBadge({ badge }: { badge?: "HOT" | "NEW" }) {
  if (!badge) return null;
  return (
    <span
      className={cn(
        "text-[10px] font-extrabold px-1.5 py-0.5 rounded-[5px] shrink-0",
        badge === "HOT" ? "bg-[#FEE2E2] text-[#EF4444]" : "bg-[#DCFCE7] text-[#16A34A]"
      )}
    >
      {badge}
    </span>
  );
}

// 수수료 행: [직책] RT 600 만원 — 숫자 크게, 단위 작게
function FeeLine({ fee, size = "md" }: { fee: FeeRow; size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-1.5">
      <PosBadge p={fee.p} size={size === "sm" ? "sm" : "md"} />
      <span className="text-[11px] text-[#C9C2DC] font-extrabold">RT</span>
      <span
        className={cn(
          "font-extrabold text-[#1B1330] tracking-[-0.5px]",
          size === "sm" ? "text-[17px]" : "text-[21px]"
        )}
      >
        {fee.amount}
      </span>
      <span className="text-[12px] font-bold text-[#6E6787] -ml-0.5">만원</span>
    </div>
  );
}

// 조건 칩: 아이콘 + 라벨 + 빨강 "제공"
function WelChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 bg-white border border-[#EFEBF7] text-[11px] px-2 py-1 rounded-lg whitespace-nowrap">
      <span className="text-[10px]">{WEL_ICONS[label] ?? "✅"}</span>
      <span className="text-[#6E6787] font-semibold">{label}</span>
      <span className="text-[#EF4444] font-extrabold">제공</span>
    </span>
  );
}

// 플라이어형 썸네일 — 실서비스에선 현장 광고 이미지로 교체
function FlyerThumb({ post, className }: { post: JobPost; className?: string }) {
  return (
    <div className={cn("relative shrink-0 rounded-2xl overflow-hidden", className)}>
      {post.flyer ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-2"
          style={{ background: post.flyer.grad }}
        >
          <div className="text-white/90 text-[10px] font-bold leading-tight">{post.flyer.line1}</div>
          <div className="text-white text-[13px] font-extrabold leading-tight mt-0.5 break-keep">
            {post.flyer.line2}
          </div>
          <div className="mt-1.5 bg-white/20 text-white text-[8.5px] font-bold px-1.5 py-0.5 rounded-full">
            광고비 50% 지원
          </div>
        </div>
      ) : (
        <Image src={post.image} alt={post.title} fill className="object-cover" sizes="112px" />
      )}
    </div>
  );
}

// 공고 카드 (가로형) — 분양의신 리스트 카드 구조
function JobCard({ post, vip }: { post: JobPost; vip?: boolean }) {
  return (
    <Link
      href={`/jobs/${post.id}`}
      className="block bg-white rounded-[20px] p-3.5 shadow-[0_2px_10px_rgba(27,19,48,.05)] active:scale-[0.98] transition-transform"
    >
      <div className="flex gap-3">
        <div className="relative">
          <FlyerThumb post={post} className="w-[112px] h-[112px]" />
          {vip && (
            <span
              className="absolute top-0 left-0 z-10 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-br-lg rounded-tl-2xl"
              style={{ background: "linear-gradient(135deg,#E0A93B,#C8832A)" }}
            >
              VIP
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11.5px] font-bold text-[#9A93AC]">
              {post.type} · {post.region}
            </span>
            <span className="flex items-center gap-1.5">
              <StateBadge badge={post.badge} />
              <Bookmark className="w-4 h-4 text-[#C9C2DC]" strokeWidth={2} />
            </span>
          </div>
          <div className="text-[15.5px] font-extrabold text-[#1B1330] tracking-[-0.3px] leading-[1.3] mt-1 line-clamp-2">
            {post.title}
          </div>
          <div className="text-[12px] text-[#6E6787] mt-1 truncate">{post.teaser}</div>
          <div className="mt-auto pt-1.5 space-y-1">
            {post.fees.map((fee) => (
              <FeeLine key={fee.p} fee={fee} size={post.fees.length > 1 ? "sm" : "md"} />
            ))}
          </div>
        </div>
      </div>

      {/* 조건 칩 행 */}
      {post.wel.length > 0 && (
        <div className="flex gap-1.5 mt-3 pt-3 border-t border-[#F3F0FA] overflow-x-auto">
          {post.wel.map((w) => (
            <WelChip key={w} label={w} />
          ))}
        </div>
      )}
    </Link>
  );
}

export default function JobsPage() {
  const [mainTab, setMainTab] = useState<"구인" | "구직" | "광고관">("구인");
  const [activeRegion, setActiveRegion] = useState("전국");

  return (
    <MobileLayout>
      <PageHeader title="구인구직">
        {/* 상단 탭 — 분양의신 3탭 구조 */}
        <div className="grid grid-cols-3">
          {(["구인", "구직", "광고관"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMainTab(tab)}
              className={cn(
                "py-2.5 text-[14px] border-b-2 transition-colors",
                mainTab === tab
                  ? "border-[#7B2FF7] text-[#1B1330] font-extrabold"
                  : "border-transparent text-[#A49BBE] font-semibold"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </PageHeader>

      {mainTab === "구인" && (
        <div className="pt-4 pb-24">
          {/* 히어로 현장 광고 배너 */}
          <div className="px-4">
            <Link
              href="/jobs/guin1"
              className="block relative h-[150px] rounded-[20px] overflow-hidden active:scale-[0.98] transition-transform"
            >
              <Image src={IMG.apt2} alt="히어로 광고" fill className="object-cover" sizes="390px" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1B1330]/90 via-[#1B1330]/55 to-transparent" />
              <div className="absolute inset-0 p-5 flex flex-col justify-center">
                <span
                  className="self-start text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-md mb-2"
                  style={{ background: "linear-gradient(135deg,#E0A93B,#C8832A)" }}
                >
                  AD
                </span>
                <div className="text-white text-[16.5px] font-extrabold tracking-[-0.3px] leading-[1.35]">
                  샘플지구 엘리프 한신더휴
                  <br />
                  팀장님 및 팀원 모집
                </div>
                <div className="text-[#EBD79A] text-[11.5px] font-bold mt-1.5">
                  광고비 50% 지원!! · 마피 중개사
                </div>
              </div>
            </Link>
          </div>

          {/* 지역 사진 칩 + 필터 */}
          <div className="flex items-center gap-2.5 px-4 mt-4 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => alert("상세 필터 (데모)")}
              aria-label="필터"
              className="shrink-0 w-11 h-11 rounded-full bg-white border border-[#E9E4F5] flex items-center justify-center"
            >
              <SlidersHorizontal className="w-[18px] h-[18px] text-[#6E6787]" strokeWidth={2} />
            </button>
            {REGIONS.map((region) => {
              const active = activeRegion === region.name;
              return (
                <button
                  key={region.name}
                  type="button"
                  onClick={() => setActiveRegion(region.name)}
                  className={cn(
                    "relative shrink-0 flex items-center gap-2 rounded-full pl-1.5 pr-4 py-1.5 border transition-colors",
                    active ? "bg-[#1B1330] border-[#1B1330]" : "bg-white border-[#E9E4F5]"
                  )}
                >
                  <span className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image src={region.image} alt={region.name} fill className="object-cover" sizes="32px" />
                  </span>
                  <span className={cn("text-[13.5px] font-extrabold", active ? "text-white" : "text-[#1B1330]")}>
                    {region.name}
                  </span>
                  {region.hot && (
                    <span className="absolute -top-1.5 -right-1 bg-[#EF4444] text-white text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-full">
                      🔥HOT
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 🏆 프리미엄 대표 현장 */}
          <section className="px-4 mt-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🏆</span>
              <h2 className="text-base font-extrabold text-[#1B1330] tracking-[-0.3px]">
                프리미엄 대표 현장
              </h2>
              <span className="text-[11px] text-[#A49BBE] font-medium">에디터 큐레이션</span>
              <button type="button" className="ml-auto text-[12px] font-semibold text-[#A49BBE]">
                상품 안내
              </button>
            </div>
            <div className="space-y-3">
              {PREMIUM_POSTS.map((post, i) => (
                <JobCard key={i} post={post} vip />
              ))}
            </div>
          </section>

          {/* 모집 중인 현장 */}
          <section className="px-4 mt-7">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">⚡</span>
              <h2 className="text-base font-extrabold text-[#1B1330] tracking-[-0.3px]">
                모집 중인 현장
              </h2>
              <span className="ml-auto text-[12px] font-semibold text-[#A49BBE]">
                최신순 <ChevronRight className="inline w-3 h-3" />
              </span>
            </div>
            <div className="space-y-3">
              {NORMAL_POSTS.map((post, i) => (
                <JobCard key={i} post={post} />
              ))}
            </div>
          </section>
        </div>
      )}

      {mainTab === "구직" && (
        <div className="px-4 pt-4 pb-24">
          <h2 className="text-base font-extrabold text-[#1B1330] tracking-[-0.3px] mb-3">
            구직 목록
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

      {mainTab === "광고관" && (
        <div className="px-4 pt-4 pb-24">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">📣</span>
            <h2 className="text-base font-extrabold text-[#1B1330] tracking-[-0.3px]">
              분야별 광고관
            </h2>
            <span className="text-[11px] text-[#A49BBE] font-medium">광고 파트너</span>
            <button type="button" className="ml-auto text-[12px] font-semibold text-[#A49BBE]">
              상품안내 →
            </button>
          </div>
          <div className="space-y-3">
            {AD_POSTS.map((ad, i) => (
              <Link
                key={i}
                href={`/jobs/${ad.id}`}
                className="block bg-white rounded-[20px] p-3.5 shadow-[0_2px_10px_rgba(27,19,48,.05)] active:scale-[0.98] transition-transform"
              >
                <div className="flex gap-3 items-center">
                  <div className="relative w-[76px] h-[76px] shrink-0 rounded-2xl overflow-hidden">
                    <Image src={ad.image} alt={ad.title} fill className="object-cover" sizes="76px" />
                    <span
                      className="absolute top-0 left-0 text-[#17130B] text-[9px] font-extrabold px-1.5 py-0.5 rounded-br-lg"
                      style={{ background: "linear-gradient(135deg,#E0A93B,#D9B54A)" }}
                    >
                      AD
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-[#7B2FF7]">{ad.label}</div>
                    <div className="text-[15px] font-extrabold text-[#1B1330] mt-0.5 leading-[1.3]">
                      {ad.title}
                    </div>
                    <div className="text-[12px] text-[#9A93AC] mt-0.5">{ad.company}</div>
                    <div className="mt-1.5">
                      <FeeLine fee={ad.fees[0]} size="sm" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 플로팅 등록 버튼 */}
      {mainTab !== "광고관" && (
        <Link
          href={mainTab === "구인" ? "/jobs/write" : "/jobs/gujik/write"}
          className="fixed bottom-24 z-20 left-1/2 translate-x-[55px] inline-flex items-center gap-1.5 text-white text-[13.5px] font-extrabold rounded-full pl-3.5 pr-4 py-3 shadow-[0_6px_16px_rgba(123,47,247,.4)] active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg,#7B2FF7,#A855F7)" }}
        >
          <Plus className="w-4 h-4" strokeWidth={2.6} />
          {mainTab === "구인" ? "공고 등록" : "구직글 등록"}
        </Link>
      )}
    </MobileLayout>
  );
}

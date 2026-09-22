"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Building,
  Building2,
  ChevronRight,
  FileText,
  Heart,
  Hotel,
  Landmark,
  MapPin,
  PencilLine,
  Search,
  SlidersHorizontal,
  Store,
  Tag,
  UserRound,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";

const REGIONS = [
  { label: "전국", photo: null, hot: false },
  { label: "서울", photo: "photo-1538485399081-7191377e8241", hot: true },
  { label: "경기남부", photo: "photo-1560518883-ce09059eeffa", hot: true },
  { label: "경기북부", photo: "photo-1600585154340-be6161a56a0c", hot: false },
  { label: "인천", photo: "photo-1486406146926-c627a92ad1ab", hot: false },
  { label: "부산", photo: "photo-1494526585095-c41746248156", hot: false },
  { label: "대전", photo: "photo-1449844908441-8829872d2607", hot: false },
];

const regionPhoto = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=120&q=82`;

const CATEGORIES = [
  { href: "/category/bunyanggwon", label: "분양권 전매", note: "프리미엄", icon: Building2 },
  { href: "/category/ijaman", label: "이자만", note: "급매 임대", icon: Landmark },
  { href: "/category/subscription", label: "신규분양", note: "청약 정보", icon: FileText },
  { href: "/category/apartment", label: "아파트", note: "임대차", icon: Building },
  { href: "/category/officetel", label: "오피스텔", note: "임대차", icon: Hotel },
  { href: "/category/store", label: "상가·사무실", note: "임대차", icon: Store },
];

const FEATURED_GROUPS = [
  {
    label: "분양권 전매",
    href: "/category/bunyanggwon",
    items: [
      {
        href: "/category/bunyanggwon/2025000189/mapi/MAPI001",
        title: "경남아너스빌 101동",
        location: "용인 · 84A",
        price: "마피 3,000만",
        badge: "마이너스P",
        vip: true,
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=700&q=85",
      },
      {
        href: "/category/bunyanggwon/2025000189/mapi/MAPI002",
        title: "경남아너스빌 102동",
        location: "용인 · 84B",
        price: "P 없음",
        badge: "분양가",
        vip: false,
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=85",
      },
    ],
  },
  {
    label: "이자만",
    href: "/category/ijaman",
    items: [
      {
        href: "/category/ijaman/vip1",
        title: "신혼부부 추천 아파트",
        location: "서울 · 84㎡",
        price: "보증금 200만",
        badge: "이자만",
        vip: false,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=700&q=85",
      },
      {
        href: "/category/ijaman/vip2",
        title: "역세권 풀옵션 오피스텔",
        location: "서울 · 59㎡",
        price: "보증금 150만",
        badge: "VIP",
        vip: true,
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=700&q=85",
      },
    ],
  },
];

function MapiMark() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--brand-purple)] shadow-[0_6px_18px_rgba(123,47,247,.32)]">
      <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" aria-hidden="true">
        <path d="M4 11.2 12 4l8 7.2" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M6.5 10.2V20h11v-9.8" stroke="white" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M10 20v-5.4h4V20" stroke="#E4C577" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function HomePage() {
  return (
    <MobileLayout>
      <header className="bg-[var(--brand-ink)] px-5 pb-5 pt-5 text-white">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MapiMark />
            <div>
              <div className="text-[20px] font-black leading-none tracking-[-0.6px]">MAPI</div>
              <div className="mt-1 text-[9px] font-bold tracking-[1.4px] text-[#C8BFD8]">PROPERTY MARKET</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button aria-label="알림" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/[.07]">
              <Bell className="h-[19px] w-[19px]" strokeWidth={1.9} />
              <span className="absolute right-[9px] top-[8px] h-1.5 w-1.5 rounded-full bg-[#FF5B62] ring-2 ring-[var(--brand-ink)]" />
            </button>
            <Link href="/more" aria-label="내 정보" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[.07]">
              <UserRound className="h-[19px] w-[19px]" strokeWidth={1.9} />
            </Link>
          </div>
        </div>

        <Link href="/map" className="flex h-[48px] items-center gap-3 rounded-[15px] border border-white/[.08] bg-white/[.08] px-4 text-[#BDB5CB]">
          <Search className="h-[18px] w-[18px] text-[#C9AFFF]" strokeWidth={2.1} />
          <span className="text-[14px] font-medium">지역, 단지명으로 매물 찾기</span>
        </Link>
      </header>

      <div className="space-y-7 pb-7">
        <section className="px-5 pt-5">
          <Link href="/category/bunyanggwon" className="group relative block h-[228px] overflow-hidden rounded-[24px] bg-[var(--brand-ink)] shadow-[0_14px_32px_rgba(27,23,38,.18)]">
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=88"
              alt="도심 고급 주거 단지"
              fill
              priority
              sizes="(max-width: 430px) 100vw, 430px"
              className="object-cover transition-transform duration-500 group-active:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(20,15,31,.92)_8%,rgba(27,23,38,.62)_55%,rgba(27,23,38,.16)_100%)]" />
            <div className="absolute inset-0 flex flex-col justify-between p-5">
              <div className="flex items-start justify-between">
                <span className="gold-fill rounded-full px-3 py-1.5 text-[10px] font-extrabold tracking-[1px]">MAPI PREMIUM</span>
                <span className="flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur">
                  <MapPin className="h-3 w-3" /> 수도권
                </span>
              </div>
              <div>
                <p className="mb-1.5 text-[12px] font-semibold text-[#D2CADF]">검증된 분양권을 한눈에</p>
                <h1 className="text-[27px] font-black leading-[1.18] tracking-[-1px] text-white">좋은 집을 찾는 기준,<br />마피에서 더 선명하게</h1>
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[12px] font-extrabold text-[var(--brand-ink)]">
                  분양권 둘러보기 <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.7} />
                </div>
              </div>
            </div>
          </Link>
        </section>

        <section className="-mt-2">
          <div
            onWheel={(event) => {
              if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                event.currentTarget.scrollLeft += event.deltaY;
              }
            }}
            className="hide-scrollbar flex touch-pan-x snap-x gap-2 overflow-x-auto overscroll-x-contain px-5 pb-1"
            aria-label="지역 바로가기"
          >
            <Link
              href="/category/bunyanggwon"
              aria-label="지역 필터"
              className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full border border-[var(--line)] bg-white"
            >
              <SlidersHorizontal className="h-[17px] w-[17px] text-[var(--text-strong)]" strokeWidth={2.3} />
            </Link>

            {REGIONS.map((region, index) => {
              const active = index === 0;
              return (
                <Link
                  key={region.label}
                  href={`/category/bunyanggwon?region=${encodeURIComponent(region.label)}`}
                  className={`relative flex h-[42px] shrink-0 snap-center items-center gap-2 rounded-full pl-[5px] pr-4 ${
                    active
                      ? "bg-[var(--brand-ink)] text-white"
                      : "border border-[var(--line)] bg-white text-[var(--text-strong)]"
                  }`}
                >
                  <span
                    className={`relative grid h-[32px] w-[32px] shrink-0 place-items-center overflow-hidden rounded-full ${
                      active ? "bg-white/[.14]" : "bg-[var(--brand-purple-soft)]"
                    }`}
                  >
                    {region.photo ? (
                      <Image src={regionPhoto(region.photo)} alt="" fill sizes="32px" className="object-cover" />
                    ) : (
                      <Building2
                        className={`h-[15px] w-[15px] ${active ? "text-white" : "text-[var(--brand-purple)]"}`}
                        strokeWidth={2.5}
                      />
                    )}
                  </span>
                  <span className="text-[13.5px] font-bold tracking-[-0.2px]">{region.label}</span>
                  {region.hot && (
                    <span className="absolute -top-[3px] right-2 rounded-full bg-[#FF3B5C] px-[5px] py-[1px] text-[8.5px] font-extrabold text-white">
                      HOT
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="px-5">
          <div className="mb-3.5">
            <p className="mb-1 text-[10px] font-extrabold tracking-[1.2px] text-[var(--brand-purple)]">QUICK MENU</p>
            <h2 className="text-[19px] font-black tracking-[-0.5px] text-[var(--text-strong)]">어떤 매물을 찾으세요?</h2>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {CATEGORIES.map(({ href, label, note, icon: Icon }, index) => (
              <Link key={href} href={href} className="flex min-h-[104px] flex-col justify-between rounded-[18px] border border-[var(--line)] bg-white p-3.5 shadow-[0_5px_16px_rgba(27,23,38,.035)] active:scale-[.97]">
                <div className={`flex h-9 w-9 items-center justify-center rounded-[12px] ${index === 0 ? "gold-fill" : "bg-[var(--brand-purple-soft)] text-[var(--brand-purple)]"}`}>
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
                </div>
                <div>
                  <div className="text-[12.5px] font-extrabold tracking-[-0.25px] text-[var(--text-strong)]">{label}</div>
                  <div className="mt-0.5 text-[10px] font-medium text-[var(--text-muted)]">{note}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="mb-1 text-[10px] font-extrabold tracking-[1.2px] text-[var(--brand-purple)]">CURATED</p>
              <h2 className="text-[19px] font-black tracking-[-0.5px] text-[var(--text-strong)]">지금 주목할 매물</h2>
            </div>
          </div>
          <div className="space-y-5">
            {FEATURED_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="mb-2.5 flex items-center justify-between">
                  <h3 className="text-[15px] font-extrabold tracking-[-0.3px] text-[var(--brand-ink)]">{group.label}</h3>
                  <Link href={group.href} className="flex items-center text-[11px] font-bold text-[var(--text-muted)]">
                    전체보기 <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="hide-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1">
                  {group.items.map((item) => (
                    <Link key={item.title} href={item.href} className="relative w-[260px] shrink-0 snap-start overflow-hidden rounded-[18px] border border-[var(--line)] bg-white shadow-[0_7px_20px_rgba(27,23,38,.05)] active:scale-[.98]">
                      {item.vip && <span className="gold-fill absolute left-0 top-0 z-10 h-full w-[3px]" />}
                      <div className="relative aspect-[16/10]">
                        <Image src={item.image} alt={item.title} fill sizes="(max-width: 430px) 50vw, 190px" className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                        <span
                          className={`absolute left-2.5 top-2.5 rounded-full px-2 py-1 text-[9px] font-extrabold backdrop-blur ${
                            item.vip ? "gold-fill" : "bg-white/92 text-[var(--brand-purple)]"
                          }`}
                        >
                          {item.badge}
                        </span>
                        <span className="absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur">
                          <Heart className="h-3.5 w-3.5" strokeWidth={2} />
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="text-[10px] font-semibold text-[var(--text-muted)]">{item.location}</p>
                        <h4 className="mt-1 truncate text-[13px] font-extrabold tracking-[-0.25px] text-[var(--text-strong)]">{item.title}</h4>
                        <p className="mt-2 text-[12.5px] font-black text-[var(--brand-purple)]">{item.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5">
          <div className="mb-3.5">
            <p className="mb-1 text-[10px] font-extrabold tracking-[1.2px] text-[var(--brand-purple)]">REQUEST</p>
            <h2 className="text-[19px] font-black tracking-[-0.5px] text-[var(--text-strong)]">찾는 매물이 없으신가요?</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/request/bunyanggwon" className="rounded-[18px] bg-[var(--brand-purple)] p-4 text-white shadow-[0_8px_20px_rgba(123,47,247,.2)] active:scale-[.98]">
              <PencilLine className="mb-5 h-5 w-5" strokeWidth={2} />
              <div className="text-[14px] font-extrabold">분양권 의뢰</div>
              <div className="mt-1 text-[10.5px] font-medium text-white/70">조건에 맞는 매물 요청</div>
            </Link>
            <Link href="/request/ijaman" className="rounded-[18px] bg-[var(--brand-ink)] p-4 text-white active:scale-[.98]">
              <Tag className="mb-5 h-5 w-5 text-[#E4C577]" strokeWidth={2} />
              <div className="text-[14px] font-extrabold">이자만 의뢰</div>
              <div className="mt-1 text-[10.5px] font-medium text-white/60">급매 임대 조건 접수</div>
            </Link>
          </div>
        </section>

        <section className="px-5">
          <Link href="/more" className="relative flex min-h-[122px] items-center overflow-hidden rounded-[20px] border border-[#D5B766]/25 bg-[linear-gradient(120deg,#19151C_0%,#2B231C_100%)] px-5 py-4">
            <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-[#D7AE54]/15 blur-3xl" />
            <div className="relative z-10">
              <p className="text-[10px] font-extrabold tracking-[1.3px] text-[#D7AE54]">WELCOME BENEFIT</p>
              <h3 className="mt-2 text-[17px] font-black leading-[1.35] tracking-[-0.4px] text-white">
                중개업소 추천 가입 시
                <br />
                <span className="gold-text">매물등록 10회권</span> 지급
              </h3>
              <p className="mt-2 text-[10.5px] font-medium text-white/55">구인구직 등록 1회권 추가</p>
            </div>
            <div className="absolute bottom-4 right-4 flex items-end gap-1.5 opacity-70">
              {[42, 66, 51, 82, 58].map((height, index) => (
                <span key={index} className="w-3 rounded-t-[3px] border border-[#E5C875]/40 bg-gradient-to-t from-[#7C6327] to-[#E5C875]" style={{ height }} />
              ))}
            </div>
          </Link>
        </section>
      </div>
    </MobileLayout>
  );
}

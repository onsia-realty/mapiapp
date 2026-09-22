"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Heart, List, LocateFixed, Map as MapIcon, Search, SlidersHorizontal, X } from "lucide-react";
import { PropertyMap, PropertyMapPoint } from "@/components/map/PropertyMap";
import { cn } from "@/lib/utils";

type MapCategory = "all" | "presale" | "interestOnly" | "apartment" | "officetel" | "office" | "store";
type DealType = "all" | "sale" | "rent" | "monthly";

interface MapProperty extends PropertyMapPoint {
  category: Exclude<MapCategory, "all">;
  categoryLabel: string;
  dealType: Exclude<DealType, "all">;
  address: string;
  area: string;
  image: string;
  href: string;
  liked?: boolean;
}

const PROPERTIES: MapProperty[] = [
  { id: "presale-1", category: "presale", categoryLabel: "분양권", dealType: "sale", title: "클러스터용인 경남아너스빌", address: "경기 용인시 처인구", area: "84A · 입주 2028.12", price: "마피 3,000만", latitude: 37.2398, longitude: 127.2841, tone: "gold", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500", href: "/category/bunyanggwon/2025000189/mapi/MAPI001" },
  { id: "presale-2", category: "presale", categoryLabel: "분양권", dealType: "sale", title: "역삼센트럴자이", address: "서울 강남구 역삼동", area: "84㎡ · 입주 2028.08", price: "8.4억", latitude: 37.5012, longitude: 127.0396, tone: "gold", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500", href: "/category/bunyanggwon/2025000566" },
  { id: "ijaman-1", category: "interestOnly", categoryLabel: "이자만", dealType: "monthly", title: "신혼부부 추천 풀옵션 아파트", address: "서울 마포구 월드컵북로", area: "84㎡ · 12층", price: "보증금 200만", latitude: 37.5686, longitude: 126.8972, tone: "orange", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500", href: "/category/ijaman/vip1" },
  { id: "apartment-1", category: "apartment", categoryLabel: "아파트", dealType: "sale", title: "래미안 퍼스티지 301동", address: "서울 서초구 반포동", area: "114.5㎡ · 23층", price: "12억", latitude: 37.5045, longitude: 127.0108, tone: "purple", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500", href: "/property/2", liked: true },
  { id: "officetel-1", category: "officetel", categoryLabel: "오피스텔", dealType: "monthly", title: "역삼역 풀옵션 오피스텔", address: "서울 강남구 역삼로", area: "28.5㎡ · 8층", price: "5000/80", latitude: 37.4997, longitude: 127.0366, tone: "blue", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500", href: "/category/officetel" },
  { id: "office-1", category: "office", categoryLabel: "사무실", dealType: "monthly", title: "강남 테헤란로 프라임 오피스", address: "서울 강남구 테헤란로", area: "85.5㎡ · 5층", price: "1억/300", latitude: 37.5065, longitude: 127.0535, tone: "blue", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500", href: "/category/office" },
  { id: "store-1", category: "store", categoryLabel: "상가", dealType: "monthly", title: "강남역 1층 상가", address: "서울 강남구 역삼동", area: "45.5㎡ · 1층", price: "3억/500", latitude: 37.4979, longitude: 127.0276, tone: "green", image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500", href: "/category/store" },
];

const CATEGORIES: { value: MapCategory; label: string }[] = [
  { value: "all", label: "전체" }, { value: "presale", label: "분양권" }, { value: "interestOnly", label: "이자만" },
  { value: "apartment", label: "아파트" }, { value: "officetel", label: "오피스텔" }, { value: "office", label: "사무실" }, { value: "store", label: "상가" },
];

const DEAL_TYPES: { value: DealType; label: string }[] = [
  { value: "all", label: "전체" }, { value: "sale", label: "매매" }, { value: "rent", label: "전세" }, { value: "monthly", label: "월세" },
];

export default function MapPage() {
  const router = useRouter();
  const [category, setCategory] = useState<MapCategory>("all");
  const [dealType, setDealType] = useState<DealType>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showList, setShowList] = useState(false);
  const [liked, setLiked] = useState<string[]>(PROPERTIES.filter((item) => item.liked).map((item) => item.id));

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("category") as MapCategory | null;
    if (!requested || !CATEGORIES.some((item) => item.value === requested)) return;
    const timer = window.setTimeout(() => setCategory(requested), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => PROPERTIES.filter((property) => {
    const keyword = search.trim().toLowerCase();
    return (category === "all" || property.category === category)
      && (dealType === "all" || property.dealType === dealType)
      && (!keyword || `${property.title} ${property.address}`.toLowerCase().includes(keyword));
  }), [category, dealType, search]);

  const selected = filtered.find((item) => item.id === selectedId) ?? null;
  const selectCategory = (value: MapCategory) => {
    setCategory(value);
    setSelectedId(null);
  };

  return (
    <main className="flex min-h-screen justify-center bg-[#eceaf0]">
      <div className="relative min-h-[100dvh] w-full max-w-[430px] overflow-hidden bg-white shadow-[0_0_32px_rgba(27,23,38,.12)]">
        <header className="absolute inset-x-0 top-0 z-30 border-b border-white/10 bg-[#17121f]/95 px-3 pb-3 pt-[max(12px,env(safe-area-inset-top))] text-white backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => router.back()} aria-label="뒤로가기" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/8"><ChevronLeft className="h-5 w-5" /></button>
            <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl bg-white/10 px-3">
              <Search className="h-4 w-4 text-white/50" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="지역, 단지명으로 검색" className="min-w-0 flex-1 bg-transparent text-[12px] font-semibold text-white outline-none placeholder:text-white/35" />
            </label>
            <button type="button" onClick={() => setShowFilter(true)} aria-label="상세 필터" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/8"><SlidersHorizontal className="h-5 w-5" /></button>
          </div>
          <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto">
            {CATEGORIES.map((item) => (
              <button key={item.value} type="button" onClick={() => selectCategory(item.value)} className={cn("shrink-0 rounded-full px-3.5 py-2 text-[11px] font-black", category === item.value ? "gold-fill" : "bg-white/8 text-white/55")}>{item.label}</button>
            ))}
          </div>
        </header>

        <PropertyMap
          latitude={37.5035}
          longitude={127.03}
          points={filtered}
          selectedId={selectedId}
          onSelect={(id) => { setSelectedId(id); setShowList(false); }}
          className="h-[100dvh] min-h-[680px]"
        />

        <div className="absolute right-4 top-[168px] z-20 flex flex-col gap-2">
          <button type="button" onClick={() => setSelectedId(filtered[0]?.id ?? null)} aria-label="현재 위치" className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#554d60] shadow-[0_5px_16px_rgba(27,23,38,.18)]"><LocateFixed className="h-5 w-5" /></button>
          <button type="button" onClick={() => { setShowList((value) => !value); setSelectedId(null); }} aria-label={showList ? "지도 보기" : "목록 보기"} className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#554d60] shadow-[0_5px_16px_rgba(27,23,38,.18)]">{showList ? <MapIcon className="h-5 w-5" /> : <List className="h-5 w-5" />}</button>
        </div>

        {!selected && !showList && (
          <button type="button" onClick={() => setShowList(true)} className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#211a2c] px-5 py-3 text-[12px] font-black text-white shadow-[0_8px_24px_rgba(27,23,38,.28)]">
            <List className="h-4 w-4 text-[#e2c36e]" /> 이 지역 매물 {filtered.length}개
          </button>
        )}

        {selected && (
          <div className="absolute inset-x-3 bottom-4 z-30 rounded-[22px] border border-white/70 bg-white/95 p-3 shadow-[0_16px_40px_rgba(27,23,38,.24)] backdrop-blur-xl">
            <button type="button" onClick={() => setSelectedId(null)} aria-label="선택 닫기" className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-[#211a2c]/80 text-white"><X className="h-3.5 w-3.5" /></button>
            <div className="flex gap-3">
              <div className="relative h-[92px] w-[100px] shrink-0 overflow-hidden rounded-[16px]"><Image src={selected.image} alt="" fill className="object-cover" sizes="100px" /></div>
              <div className="min-w-0 flex-1 py-0.5">
                <span className="rounded-full bg-[var(--brand-purple-soft)] px-2 py-1 text-[9px] font-black text-[var(--brand-purple)]">{selected.categoryLabel}</span>
                <p className="mt-2 truncate text-[13px] font-black text-[var(--brand-ink)]">{selected.title}</p>
                <p className="mt-1 text-[16px] font-black text-[var(--brand-purple)]">{selected.price}</p>
                <p className="mt-0.5 truncate text-[10px] text-[var(--text-muted)]">{selected.address} · {selected.area}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => setLiked((items) => items.includes(selected.id) ? items.filter((id) => id !== selected.id) : [...items, selected.id])} className="grid h-11 w-11 place-items-center rounded-[14px] border border-[var(--line)]"><Heart className={cn("h-5 w-5", liked.includes(selected.id) ? "fill-[#f04d6d] text-[#f04d6d]" : "text-[#948c9d]")} /></button>
              <Link href={selected.href} className="flex h-11 flex-1 items-center justify-center gap-1 rounded-[14px] bg-[var(--brand-purple)] text-[12px] font-black text-white">매물 상세보기 <ChevronRight className="h-4 w-4" /></Link>
            </div>
          </div>
        )}

        {showList && (
          <div className="absolute inset-x-0 bottom-0 z-30 max-h-[62dvh] overflow-hidden rounded-t-[28px] bg-white shadow-[0_-16px_42px_rgba(27,23,38,.22)]">
            <button type="button" onClick={() => setShowList(false)} className="block w-full pb-2 pt-3"><span className="mx-auto block h-1 w-10 rounded-full bg-[#d7d2dc]" /></button>
            <div className="flex items-center justify-between px-5 pb-3"><div><p className="text-[10px] font-black tracking-[1.3px] text-[var(--brand-purple)]">MAP LIST</p><h2 className="text-[17px] font-black text-[var(--brand-ink)]">이 지역 매물 {filtered.length}개</h2></div><button type="button" onClick={() => setShowList(false)} className="grid h-9 w-9 place-items-center rounded-full bg-[var(--surface-muted)]"><MapIcon className="h-4 w-4" /></button></div>
            <div className="max-h-[48dvh] space-y-2 overflow-y-auto px-4 pb-6">
              {filtered.map((property) => (
                <button key={property.id} type="button" onClick={() => { setSelectedId(property.id); setShowList(false); }} className="flex w-full gap-3 rounded-[18px] border border-[var(--line)] p-3 text-left active:bg-[var(--surface-muted)]">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[13px]"><Image src={property.image} alt="" fill className="object-cover" sizes="80px" /></div>
                  <div className="min-w-0 flex-1"><div className="flex items-center justify-between"><span className="text-[9px] font-black text-[var(--brand-purple)]">{property.categoryLabel}</span><span className="text-[9px] text-[var(--text-muted)]">{property.area}</span></div><p className="mt-1 truncate text-[12px] font-black text-[var(--brand-ink)]">{property.title}</p><p className="mt-1 text-[15px] font-black text-[var(--brand-purple)]">{property.price}</p><p className="truncate text-[10px] text-[var(--text-muted)]">{property.address}</p></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {showFilter && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45" onClick={() => setShowFilter(false)}>
            <div className="w-full max-w-[430px] rounded-t-[28px] bg-white p-5 pb-7" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between"><h2 className="text-lg font-black text-[var(--brand-ink)]">지도 필터</h2><button type="button" onClick={() => setShowFilter(false)} className="grid h-9 w-9 place-items-center rounded-full bg-[var(--surface-muted)]"><X className="h-4 w-4" /></button></div>
              <p className="mb-3 mt-5 text-xs font-black text-[var(--text-muted)]">거래 유형</p>
              <div className="grid grid-cols-4 gap-2">{DEAL_TYPES.map((item) => <button key={item.value} type="button" onClick={() => setDealType(item.value)} className={cn("rounded-xl border py-3 text-[11px] font-black", dealType === item.value ? "border-[var(--brand-purple)] bg-[var(--brand-purple-soft)] text-[var(--brand-purple)]" : "border-[var(--line)] text-[var(--text-muted)]")}>{item.label}</button>)}</div>
              <button type="button" onClick={() => setShowFilter(false)} className="mt-6 h-13 w-full rounded-[16px] bg-[var(--brand-ink)] text-sm font-black text-white">{filtered.length}개 매물 적용</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

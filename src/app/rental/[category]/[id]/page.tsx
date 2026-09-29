import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ReportListing } from "@/components/listing/ReportListing";
import { RENTAL_CATEGORY_LABELS, RENTAL_DEMO_LISTINGS, type RentalCategory } from "@/lib/rental-demo";

const DEAL_LABELS = { SALE: "매매", RENT: "전세", MONTHLY: "월세" };

export default async function RentalDetailPage({ params }: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;
  if (!Object.prototype.hasOwnProperty.call(RENTAL_DEMO_LISTINGS, category)) notFound();
  const rentalCategory = category as RentalCategory;
  const listing = RENTAL_DEMO_LISTINGS[rentalCategory].find((item) => item.id === id);
  if (!listing) notFound();

  return (
    <MobileLayout>
      <header className="rounded-b-[26px] bg-[#1B1330] px-5 py-[18px] text-white">
        <Link href={`/category/${category}`} className="flex items-center gap-2 text-sm font-bold">
          <ChevronLeft className="h-5 w-5" /> {RENTAL_CATEGORY_LABELS[rentalCategory]} 목록
        </Link>
      </header>
      <div className="px-5 py-6">
        <p className="mb-4 rounded-xl bg-[#F1EEF8] p-3 text-xs leading-5 text-[#6B6580]">
          서비스 시연용 샘플 매물입니다. 사진은 예시이며 실제 거래 가능 여부와 중개사 정보는 제공되지 않습니다.
        </p>
        <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[18px]">
          <Image src={listing.image} alt={`${listing.propertyName} 예시 사진`} fill sizes="390px" className="object-cover" />
        </div>
        <p className="mb-2 text-sm font-bold text-[#7B2FF7]">
          {RENTAL_CATEGORY_LABELS[rentalCategory]} · {DEAL_LABELS[listing.dealType]}
        </p>
        <h1 className="text-2xl font-extrabold text-[#1B1330]">{listing.propertyName}</h1>
        <p className="mt-2 text-sm text-[#6B6580]">{listing.address}</p>
        <dl className="mt-5 space-y-4 rounded-[18px] bg-white p-5 text-sm">
          {listing.dealType === "SALE" ? (
            <div className="flex justify-between gap-4"><dt>매매가</dt><dd className="font-bold text-[#7B2FF7]">{listing.price?.toLocaleString()}만원</dd></div>
          ) : (
            <>
              <div className="flex justify-between gap-4"><dt>보증금</dt><dd className="font-bold">{listing.deposit?.toLocaleString()}만원</dd></div>
              {listing.dealType === "MONTHLY" && <div className="flex justify-between gap-4"><dt>월세</dt><dd className="font-bold text-[#7B2FF7]">{listing.monthlyRent?.toLocaleString()}만원</dd></div>}
            </>
          )}
          <div className="flex justify-between gap-4"><dt>전용면적</dt><dd>{listing.exclusiveArea}㎡ (약 {Math.round(listing.exclusiveArea / 3.3)}평)</dd></div>
          <div className="flex justify-between gap-4"><dt>층수</dt><dd>{listing.floor}</dd></div>
        </dl>
        <ReportListing listingId={`rental-${category}-${listing.id}`} />
      </div>
    </MobileLayout>
  );
}

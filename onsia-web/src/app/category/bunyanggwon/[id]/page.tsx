"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { mockBunyanggwon } from "@/lib/mock-bunyanggwon";
import { getMapiListingsByBunyanggwonId } from "@/lib/mock-mapi";
import { KakaoMap } from "@/components/map/KakaoMap";
import { ChevronLeft, ChevronDown, Home } from "lucide-react";
import { BunyanggwonData, NearbyPriceData, PropertyImages } from "@/types/api";
import { MapiListing } from "@/types/bunyanggwon";

export default function BunyanggwonDetailPage() {
  const params = useParams();

  // 상태 관리
  const [bunyanggwonData, setBunyanggwonData] = useState<BunyanggwonData | null>(null);
  const [nearbyPrices, setNearbyPrices] = useState<NearbyPriceData[]>([]);
  const [propertyImages, setPropertyImages] = useState<PropertyImages | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [mapiListings, setMapiListings] = useState<MapiListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  const [selectedPyeong, setSelectedPyeong] = useState("84A");
  const [showPyeongDropdown, setShowPyeongDropdown] = useState(false);
  const [schoolTab, setSchoolTab] = useState<"elementary" | "preschool">("elementary");
  const [developmentTab, setDevelopmentTab] = useState<"rail" | "road" | "construction">("rail");
  const [showMoreApartments, setShowMoreApartments] = useState(false);
  const [rankingType, setRankingType] = useState<"sale" | "rent">("sale");

  // API 데이터 로딩
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // 1. Mock 데이터에서 해당 매물 찾기
        const mockItem = mockBunyanggwon.find((b) => b.id === params.id);

        // 2. Mock 매물에 apiId가 있으면 청약홈 API 호출
        const apiId = mockItem?.apiId || params.id;
        const bunyanggwonResponse = await fetch(`/api/bunyanggwon/${apiId}`);
        const bunyanggwonResult = await bunyanggwonResponse.json();

        if (bunyanggwonResult.success && bunyanggwonResult.data) {
          // API 데이터 사용
          console.log("✅ 청약홈 API 데이터 로드 완료:", bunyanggwonResult.data.propertyName);
          setBunyanggwonData(bunyanggwonResult.data);

          // Mock 데이터에서 좌표 가져오기
          if (mockItem?.latitude && mockItem?.longitude) {
            setCoordinates({ lat: mockItem.latitude, lng: mockItem.longitude });
          }

          // 3. 주변 시세 조회
          const priceResponse = await fetch(
            `/api/realprice?address=${encodeURIComponent(bunyanggwonResult.data.address)}`
          );
          const priceResult = await priceResponse.json();

          if (priceResult.success) {
            setNearbyPrices(priceResult.data.prices || []);
          }

          // 4. 분양 홈페이지 이미지 조회
          const imagesResponse = await fetch(`/api/property-images/${apiId}`);
          const imagesResult = await imagesResponse.json();

          if (imagesResult.success && imagesResult.data) {
            console.log("📷 분양 홈페이지 이미지 로드 완료");
            setPropertyImages(imagesResult.data);
          }

          // 5. 마피 매물 조회
          const mapiData = getMapiListingsByBunyanggwonId(mockItem?.id || params.id as string);
          if (mapiData.length > 0) {
            console.log(`🏠 마피 매물 ${mapiData.length}건 로드 완료`);
            setMapiListings(mapiData);
          }
        } else if (mockItem) {
          // API 데이터가 없으면 mock 데이터 사용 (fallback)
          console.warn("API 데이터 없음, mock 데이터 사용");
          const convertedData: BunyanggwonData = {
            id: mockItem.id,
            propertyName: mockItem.propertyName,
            district: mockItem.district || "",
            address: mockItem.address,
            moveInDate: mockItem.moveInDate || "",
            status: "청약접수중",
            thumbnailUrl: mockItem.thumbnailUrl || "",
            schedule: {
              recruitmentDate: "",
              subscriptionStartDate: "",
              subscriptionEndDate: "",
              winnerAnnouncementDate: "",
              contractStartDate: "",
              contractEndDate: "",
            },
            supplyInfo: {
              location: mockItem.address,
              totalUnits: 0,
              builder: "",
              operator: "",
              phone: "",
            },
            houseType: mockItem.type === "APARTMENT" ? "아파트" : "오피스텔",
            region: mockItem.region,
          };
          setBunyanggwonData(convertedData);
        }
      } catch (err) {
        console.error("데이터 로딩 에러:", err);
        setError("데이터를 불러오는데 실패했습니다.");

        // 에러 시에도 mock 데이터 fallback
        const mockItem = mockBunyanggwon.find((b) => b.id === params.id);
        if (mockItem) {
          const convertedData: BunyanggwonData = {
            id: mockItem.id,
            propertyName: mockItem.propertyName,
            district: mockItem.district || "",
            address: mockItem.address,
            moveInDate: mockItem.moveInDate || "",
            status: "청약접수중",
            thumbnailUrl: mockItem.thumbnailUrl || "",
            schedule: {
              recruitmentDate: "",
              subscriptionStartDate: "",
              subscriptionEndDate: "",
              winnerAnnouncementDate: "",
              contractStartDate: "",
              contractEndDate: "",
            },
            supplyInfo: {
              location: mockItem.address,
              totalUnits: 0,
              builder: "",
              operator: "",
              phone: "",
            },
            houseType: mockItem.type === "APARTMENT" ? "아파트" : "오피스텔",
            region: mockItem.region,
          };
          setBunyanggwonData(convertedData);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  const item = bunyanggwonData;

  // 로딩 중
  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">데이터를 불러오는 중...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // 데이터 없음
  if (!item) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-gray-500 mb-4">매물 정보를 찾을 수 없습니다.</p>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Link href="/category/bunyanggwon" className="text-blue-600 underline mt-4 inline-block">
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // 평형 목록 (API 데이터에서 가져옴)
  const availablePyeongs = item?.priceInfo?.map((p) => p.type) || ["84A"];

  // 선택된 평형의 분양가 정보
  const selectedPriceInfo = item?.priceInfo?.find((p) => p.type === selectedPyeong) || item?.priceInfo?.[0];

  return (
    <MobileLayout>
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/category/bunyanggwon">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-base font-bold text-gray-900 line-clamp-1 flex-1">
            {item.district} {item.propertyName}
          </h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="pb-20">
        {/* 평형 선택 드롭다운 */}
        <div className="px-5 pt-4">
          <div className="relative">
            <button
              onClick={() => setShowPyeongDropdown(!showPyeongDropdown)}
              className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3"
            >
              <span className="text-sm font-medium text-gray-900">
                {selectedPyeong}평
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  showPyeongDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
            {showPyeongDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden z-20">
                {availablePyeongs.map((pyeong) => (
                  <button
                    key={pyeong}
                    onClick={() => {
                      setSelectedPyeong(pyeong);
                      setShowPyeongDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 active:bg-gray-100"
                  >
                    {pyeong}평
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 단지 기본 정보 */}
        <div className="px-5 pt-4">
          <div className="text-sm text-gray-700">
            <div className="mb-1">
              {item.address}
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <span>{item.supplyInfo.totalUnits.toLocaleString()}세대</span>
              <span>|</span>
              <span>{item.moveInDate}(입주예정)</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <span>{item.houseType}</span>
              <span>|</span>
              <span>{item.region}</span>
            </div>
          </div>
        </div>

        {/* 단지 홍보 배너 */}
        <div className="px-5 pt-4">
          {propertyImages?.birdEyeView ? (
            <div className="relative rounded-xl overflow-hidden mb-3 h-48">
              <Image
                src={propertyImages.birdEyeView}
                alt={`${item.propertyName} 조감도`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm font-medium">{item.propertyName}</p>
                <p className="text-white/80 text-xs">{item.address}</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-200 text-gray-500 rounded-xl p-8 text-center mb-3">
              <p className="text-sm">조감도 이미지 준비중</p>
            </div>
          )}
          {item.homepageUrl ? (
            <a
              href={item.homepageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-500 text-white rounded-lg py-3 font-medium mb-1 block text-center"
            >
              분양 홈페이지 보러가기
            </a>
          ) : (
            <button className="w-full bg-gray-300 text-gray-500 rounded-lg py-3 font-medium mb-1" disabled>
              홈페이지 없음
            </button>
          )}
        </div>

        {/* 평형별 분양가 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">
            {selectedPriceInfo ? `${selectedPriceInfo.pyeong}평형` : selectedPyeong} 분양가
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-3">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">타입</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700">공급세대</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-700">분양가</th>
                </tr>
              </thead>
              <tbody>
                {item.priceInfo && item.priceInfo.length > 0 ? (
                  item.priceInfo.map((priceItem) => (
                    <tr
                      key={priceItem.type}
                      className={`bg-white border-b border-gray-100 ${selectedPyeong === priceItem.type ? 'bg-purple-50' : ''}`}
                    >
                      <td className="px-3 py-3 text-gray-900 font-medium">
                        {priceItem.type}타입
                        <div className="text-xs text-gray-500">{priceItem.exclusiveArea.toFixed(1)}㎡</div>
                      </td>
                      <td className="px-3 py-3 text-center text-gray-700">
                        {priceItem.totalUnits}세대
                        <div className="text-xs text-gray-500">
                          (일반 {priceItem.generalUnits} / 특별 {priceItem.specialUnits})
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right text-purple-600 font-bold">
                        {priceItem.price >= 10000
                          ? `${Math.floor(priceItem.price / 10000)}억 ${priceItem.price % 10000 > 0 ? (priceItem.price % 10000).toLocaleString() : ''}`
                          : `${priceItem.price.toLocaleString()}만`}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white">
                    <td colSpan={3} className="px-3 py-3 text-center text-gray-500">
                      분양가 정보가 없습니다
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {mapiListings.length > 0 ? (
            <Link
              href={`/category/bunyanggwon/${params.id}/mapi`}
              className="w-full bg-blue-500 text-white rounded-lg py-3 font-medium flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              마피 매물보기 ({mapiListings.length}건)
            </Link>
          ) : (
            <button className="w-full bg-gray-300 text-gray-500 rounded-lg py-3 font-medium flex items-center justify-center gap-2" disabled>
              <Home className="w-5 h-5" />
              마피 매물 없음
            </button>
          )}
        </div>

        {/* 분양안내 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">분양안내</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-3">
            <table className="w-full text-xs">
              <tbody>
                {item.schedule.recruitmentDate && (
                  <tr className="border-b border-gray-200">
                    <td className="px-3 py-3 text-gray-700 bg-gray-50 w-28">{item.schedule.recruitmentDate}</td>
                    <td className="px-3 py-3 text-gray-900">모집공고</td>
                    <td className="px-3 py-3 text-right text-gray-600">-</td>
                  </tr>
                )}
                {item.schedule.specialSupplyDate && (
                  <tr className="border-b border-gray-200">
                    <td className="px-3 py-3 text-gray-700 bg-gray-50 w-28">{item.schedule.specialSupplyDate}</td>
                    <td className="px-3 py-3 text-gray-900">특별공급</td>
                    <td className="px-3 py-3 text-right text-green-600 font-medium">청약 시작</td>
                  </tr>
                )}
                {item.schedule.subscriptionStartDate && (
                  <tr className="border-b border-gray-200">
                    <td className="px-3 py-3 text-gray-700 bg-gray-50 w-28">{item.schedule.subscriptionStartDate}</td>
                    <td className="px-3 py-3 text-gray-900">1순위</td>
                    <td className="px-3 py-3 text-right text-blue-600 font-medium">해당지역</td>
                  </tr>
                )}
                {item.schedule.subscriptionEndDate && (
                  <tr className="border-b border-gray-200">
                    <td className="px-3 py-3 text-gray-700 bg-gray-50 w-28">{item.schedule.subscriptionEndDate}</td>
                    <td className="px-3 py-3 text-gray-900">2순위</td>
                    <td className="px-3 py-3 text-right text-gray-600">-</td>
                  </tr>
                )}
                {item.schedule.winnerAnnouncementDate && (
                  <tr className="border-b border-gray-200">
                    <td className="px-3 py-3 text-gray-700 bg-gray-50 w-28">{item.schedule.winnerAnnouncementDate}</td>
                    <td className="px-3 py-3 text-gray-900">당첨자 발표</td>
                    <td className="px-3 py-3 text-right text-gray-600">-</td>
                  </tr>
                )}
                {item.schedule.contractStartDate && item.schedule.contractEndDate && (
                  <tr>
                    <td className="px-3 py-3 text-gray-700 bg-gray-50 w-28">
                      {item.schedule.contractStartDate}~{item.schedule.contractEndDate.slice(5)}
                    </td>
                    <td className="px-3 py-3 text-gray-900">계약기간</td>
                    <td className="px-3 py-3 text-right text-gray-600">-</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {item.announcementUrl ? (
            <a
              href={item.announcementUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-500 text-white rounded-lg py-3 font-medium block text-center"
            >
              청약 신청하기 →
            </a>
          ) : (
            <button className="w-full bg-gray-300 text-gray-500 rounded-lg py-3 font-medium" disabled>
              청약 신청하기
            </button>
          )}
        </div>

        {/* 단지 정보 박스 */}
        <div className="px-5 pt-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-700">• {item.houseType}</span>
              <span className="text-gray-700">• {item.supplyInfo.totalUnits}세대</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">• {item.schedule.recruitmentDate} 분양</span>
              <span className="text-gray-700">• {item.moveInDate}(입주예정)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">• {item.region}</span>
              <span className="text-gray-700">• {item.district}</span>
            </div>
          </div>
        </div>

        {/* 주변 시세 정보 (API 연동) */}
        {nearbyPrices.length > 0 && (
          <div className="px-5 pt-6">
            <h2 className="text-sm font-bold text-gray-900 mb-3">주변 시세 정보 (실거래가)</h2>
            <div className="bg-blue-50 rounded-lg p-3 mb-3">
              <p className="text-xs text-blue-800">
                ✓ 공공데이터 API로 가져온 실제 거래 정보입니다
              </p>
            </div>
            <div className="space-y-2">
              {nearbyPrices.slice(0, 5).map((price, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-900">{price.apartmentName}</span>
                    <span className="text-xs text-gray-600">{price.pyeong}평</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">{price.address}</span>
                    <span className="text-sm font-bold text-blue-600">
                      {price.recentPrice.toLocaleString()}만원
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{price.buildYear}년 준공 · {price.floor}층</span>
                    <span>{price.transactionDate} 거래</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 공급정보 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">공급정보</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-3">
            <table className="w-full text-xs">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-2.5 text-gray-700 bg-gray-50 font-medium">공급위치</td>
                  <td className="px-3 py-2.5 text-gray-900">{item.supplyInfo.location}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-2.5 text-gray-700 bg-gray-50 font-medium">공급규모</td>
                  <td className="px-3 py-2.5 text-gray-900">{item.supplyInfo.totalUnits}세대</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-2.5 text-gray-700 bg-gray-50 font-medium">건설사</td>
                  <td className="px-3 py-2.5 text-gray-900">{item.supplyInfo.builder}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-2.5 text-gray-700 bg-gray-50 font-medium">시행사</td>
                  <td className="px-3 py-2.5 text-gray-900">{item.supplyInfo.operator}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5 text-gray-700 bg-gray-50 font-medium">대표전화</td>
                  <td className="px-3 py-2.5 text-blue-600 font-medium">📞 {item.supplyInfo.phone}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="space-y-2">
            {item.homepageUrl ? (
              <a
                href={item.homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-500 text-white rounded-lg py-3 font-medium text-sm block text-center"
              >
                🏠 분양 홈페이지 바로가기
              </a>
            ) : (
              <button className="w-full bg-gray-300 text-gray-500 rounded-lg py-3 font-medium text-sm" disabled>
                분양 홈페이지 없음
              </button>
            )}
            {item.announcementUrl ? (
              <a
                href={item.announcementUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-500 text-white rounded-lg py-3 font-medium text-sm block text-center"
              >
                📋 입주자 모집 공고 보기
              </a>
            ) : (
              <button className="w-full bg-gray-300 text-gray-500 rounded-lg py-3 font-medium text-sm" disabled>
                모집 공고 없음
              </button>
            )}
          </div>
        </div>

        {/* 단지 홍보 이미지 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">단지 홍보 이미지</h2>
          {propertyImages?.gallery && propertyImages.gallery.length > 0 ? (
            <div className="space-y-3">
              {/* 메인 이미지 */}
              <div className="relative rounded-xl overflow-hidden h-48">
                <Image
                  src={propertyImages.gallery[currentGalleryIndex]}
                  alt={`${item.propertyName} 홍보 이미지 ${currentGalleryIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {currentGalleryIndex + 1} / {propertyImages.gallery.length}
                </div>
              </div>
              {/* 썸네일 네비게이션 */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {propertyImages.gallery.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentGalleryIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all relative ${
                      index === currentGalleryIndex
                        ? "border-blue-500"
                        : "border-transparent opacity-60"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`썸네일 ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-200 text-gray-500 rounded-xl p-12 text-center">
              <p className="text-sm">홍보 이미지 준비중</p>
            </div>
          )}
        </div>

        {/* 빠른 배송 생활권 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">빠른 배송 생활권</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-base">🔥</span>
                  <span className="text-xs font-bold text-gray-900">쿠팡</span>
                </div>
                <div className="text-xs text-gray-700">로켓배송 · 트렛프레시</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-base">🔥</span>
                  <span className="text-xs font-bold text-gray-900">SSG</span>
                </div>
                <div className="text-xs text-gray-700">쓱배송 · 새벽배송</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-base">🌸</span>
                  <span className="text-xs font-bold text-gray-900">마켓컬리</span>
                </div>
                <div className="text-xs text-gray-700">샛별배송</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-base">🏢</span>
                  <span className="text-xs font-bold text-gray-900">요기요</span>
                </div>
                <div className="text-xs text-gray-700">익스프레스</div>
              </div>
            </div>
          </div>
        </div>

        {/* 주변 상권 정보 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">주변 상권 정보</h2>
          {coordinates ? (
            <div className="rounded-xl overflow-hidden mb-3">
              <KakaoMap
                latitude={coordinates.lat}
                longitude={coordinates.lng}
                markerTitle={item.propertyName}
                level={4}
                className="w-full h-48 rounded-xl"
              />
            </div>
          ) : (
            <div className="bg-gray-200 text-gray-500 rounded-xl p-12 text-center mb-3">
              <p className="text-sm">지도 정보 준비중</p>
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-900 mb-1">{item.propertyName}</div>
            <div className="text-xs text-gray-600">{item.address}</div>
          </div>
        </div>

        {/* 주변 대중 교통 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">주변 대중 교통</h2>
          <p className="text-xs text-gray-600 mb-3">지하철 1km, 광역버스 500m 이내</p>

          {/* 지하철 */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🚇</span>
              <span className="text-xs font-bold text-gray-900">지하철 2</span>
            </div>
            <div className="space-y-2">
              <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs text-gray-900">2 경성대·부경대역</span>
                <span className="text-xs text-gray-600">529m / 도보 8분</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs text-gray-900">2 남천역</span>
                <span className="text-xs text-gray-600">659m / 도보 10분</span>
              </div>
            </div>
          </div>

          {/* 고속철도 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🚌</span>
              <span className="text-xs font-bold text-gray-900">고속철도 1</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
              <span className="text-xs text-gray-900">부산역 KTX</span>
              <span className="text-xs text-gray-600">6.3km / 22분</span>
            </div>
          </div>
        </div>

        {/* 학군 정보 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">학군 정보</h2>

          {/* 탭 */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setSchoolTab("elementary")}
              className={`px-4 py-2 text-xs rounded-full font-medium ${
                schoolTab === "elementary"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              초등학교
            </button>
            <button
              onClick={() => setSchoolTab("preschool")}
              className={`px-4 py-2 text-xs rounded-full font-medium ${
                schoolTab === "preschool"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              어린이집·유치원
            </button>
          </div>

          {/* 초등학교 탭 내용 */}
          {schoolTab === "elementary" && (
            <div>
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="text-xs text-gray-700 mb-2">거리: 남천초등학교역</div>
                <div className="flex gap-2 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    도보 5분
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    도보 10분
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    도보 20분
                  </span>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-900">🟠 남천초등학교 공립</span>
                  <span className="text-xs text-gray-600">949m / 14분</span>
                </div>
                <span className="text-xs text-orange-600 font-medium">가장 가까움</span>
              </div>
            </div>
          )}

          {/* 어린이집·유치원 탭 내용 */}
          {schoolTab === "preschool" && (
            <div className="space-y-2">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-xs font-medium text-gray-900 mb-1">국립부경대학교어린이집</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">직장</span>
                  <span className="text-xs text-gray-600">248m 가장 가까움</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 주변 개발 호재 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">주변 개발 호재</h2>
          <p className="text-xs text-gray-600 mb-3">반경 1.5km 이내</p>

          {/* 탭 */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setDevelopmentTab("rail")}
              className={`px-4 py-2 text-xs rounded-full font-medium ${
                developmentTab === "rail"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              철도
            </button>
            <button
              onClick={() => setDevelopmentTab("road")}
              className={`px-4 py-2 text-xs rounded-full font-medium ${
                developmentTab === "road"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              도로
            </button>
            <button
              onClick={() => setDevelopmentTab("construction")}
              className={`px-4 py-2 text-xs rounded-full font-medium ${
                developmentTab === "construction"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              건설
            </button>
          </div>

          {/* 철도 탭 내용 */}
          {developmentTab === "rail" && (
            <div className="space-y-2">
              <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs text-gray-900">용호선(트램) 부경대역</span>
                <span className="text-xs text-gray-600">573m, 2분거리</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs text-gray-900">용호선(트램) 경성대역</span>
                <span className="text-xs text-gray-600">579m, 2분거리</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs text-gray-900">용호선(트램) 대연천역</span>
                <span className="text-xs text-gray-600">654m, 2분거리</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs text-gray-900">용호선(트램) 분포역</span>
                <span className="text-xs text-gray-600">946m, 3분거리</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs text-gray-900">용호선(트램) 아기대역</span>
                <span className="text-xs text-gray-600">1.3km, 4분거리</span>
              </div>
            </div>
          )}

          {/* 도로/건설 탭 내용 (placeholder) */}
          {developmentTab === "road" && (
            <div className="py-8 text-center text-xs text-gray-500">
              도로 정보가 없습니다
            </div>
          )}
          {developmentTab === "construction" && (
            <div className="py-8 text-center text-xs text-gray-500">
              건설 정보가 없습니다
            </div>
          )}
        </div>

        {/* 주변 입주예정 아파트 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">주변 입주예정 아파트</h2>
          <div className="space-y-3 mb-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-900 mb-1">남천동 씨엘리미티드남천</div>
              <div className="text-xs text-gray-600 mb-1">2029년 7월 835세대, 33평</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600 font-medium">15억</span>
                <span className="text-xs text-gray-500">가장 가까운 곳</span>
              </div>
            </div>
            {showMoreApartments && (
              <>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="text-xs text-gray-900 mb-1">대연동 경성대부경대역비스듬동편리미언</div>
                  <div className="text-xs text-gray-600">2028년 5월 160세대</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="text-xs text-gray-900 mb-1">광안동 DEFINE광안</div>
                  <div className="text-xs text-gray-600 mb-1">2026년 6월 1233세대, 24평</div>
                  <div className="text-xs text-blue-600 font-medium">8.6억</div>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => setShowMoreApartments(!showMoreApartments)}
            className="w-full bg-blue-500 text-white rounded-lg py-3 font-medium text-sm flex items-center justify-center gap-2"
          >
            더보기 {showMoreApartments ? "▲" : "▼"}
          </button>
        </div>

        {/* 지역 순위 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">남구 아파트 순위</h2>

          {/* 탭 */}
          <div className="flex gap-2 mb-3 justify-end">
            <button
              onClick={() => setRankingType("sale")}
              className={`text-xs font-medium ${
                rankingType === "sale" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              매매
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setRankingType("rent")}
              className={`text-xs font-medium ${
                rankingType === "rent" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              전세
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600 mb-1">인기</div>
                <div className="text-sm font-bold text-gray-900">24,212명 방문</div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="text-xs text-gray-600">남구 1위</div>
                    <div className="text-xs text-blue-600 font-medium">▲ 4</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">대연동 1위</div>
                    <div className="text-xs text-blue-600 font-medium">▲ 3</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button className="w-full bg-blue-500 text-white rounded-lg py-3 font-medium text-sm">
              남구 아파트 순위 더보기
            </button>
            <button className="w-full bg-blue-500 text-white rounded-lg py-3 font-medium text-sm">
              대연동 아파트 순위 더보기
            </button>
          </div>
        </div>

        {/* 마피 매물보기 */}
        <div className="px-5 pt-6 pb-10">
          {mapiListings.length > 0 ? (
            <Link
              href={`/category/bunyanggwon/${params.id}/mapi`}
              className="w-full bg-blue-500 text-white rounded-lg py-4 font-bold text-base flex items-center justify-center gap-2"
            >
              🛍 마피 매물보기 ({mapiListings.length}건)
            </Link>
          ) : (
            <button className="w-full bg-gray-300 text-gray-500 rounded-lg py-4 font-bold text-base flex items-center justify-center gap-2" disabled>
              🛍 마피 매물 없음
            </button>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}

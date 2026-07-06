"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { mockBunyanggwon } from "@/lib/mock-bunyanggwon";
import { getMapiListingsByBunyanggwonId } from "@/lib/mock-mapi";
import { KakaoMap } from "@/components/map/KakaoMap";
import { ChevronLeft, ChevronDown, Home, Heart } from "lucide-react";
import { BunyanggwonData, NearbyPriceData, PropertyImages, NearbySchool, SchoolsApiResponse, NearbySubwayStation, SubwayApiResponse, NearbyBusStop, BusApiResponse, WinningCutoffData, SpecialSupplyData } from "@/types/api";
import { UpcomingApartment } from "@/lib/api/upcoming-apartments";
import { ApartmentRankingResult, RankingCategory } from "@/lib/api/apartment-ranking";
import { MapiListing } from "@/types/bunyanggwon";
import { LoanCalculator } from "@/components/calculator/LoanCalculator";
import { ComplexListingPreview } from "@/components/listing/ComplexListingPreview";
import { RealEstateListing, getListingsByComplexId } from "@/lib/mock-listings";

export default function BunyanggwonDetailPage() {
  const params = useParams();

  // 상태 관리
  const [bunyanggwonData, setBunyanggwonData] = useState<BunyanggwonData | null>(null);
  const [nearbyPrices, setNearbyPrices] = useState<NearbyPriceData[]>([]);
  const [propertyImages, setPropertyImages] = useState<PropertyImages | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [mapiListings, setMapiListings] = useState<MapiListing[]>([]);
  const [realEstateListings, setRealEstateListings] = useState<RealEstateListing[]>([]);
  const [nearbySchools, setNearbySchools] = useState<{
    elementary: NearbySchool[];
    middle: NearbySchool[];
    high: NearbySchool[];
  }>({ elementary: [], middle: [], high: [] });
  const [nearbySubways, setNearbySubways] = useState<NearbySubwayStation[]>([]);
  const [nearbyBusStops, setNearbyBusStops] = useState<NearbyBusStop[]>([]);
  const [upcomingApartments, setUpcomingApartments] = useState<UpcomingApartment[]>([]);
  const [apartmentRanking, setApartmentRanking] = useState<ApartmentRankingResult | null>(null);
  const [winningCutoff, setWinningCutoff] = useState<WinningCutoffData | null>(null);
  const [specialSupply, setSpecialSupply] = useState<SpecialSupplyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  const [selectedPyeong, setSelectedPyeong] = useState("84A");
  const [showPyeongDropdown, setShowPyeongDropdown] = useState(false);
  const [schoolTab, setSchoolTab] = useState<"elementary" | "middle" | "high">("elementary");
  const [showMoreApartments, setShowMoreApartments] = useState(false);
  const [rankingCategory, setRankingCategory] = useState<RankingCategory>("composite");
  const [selectedBusStop, setSelectedBusStop] = useState<NearbyBusStop | null>(null);

  // 이미지 크롤링 상태
  const [imageScraping, setImageScraping] = useState(false);
  const [imageScrapeFailed, setImageScrapeFailed] = useState(false);
  const [homepageUrl, setHomepageUrl] = useState<string | null>(null);

  // 좌표 기반 데이터 조회 (학교, 지하철, 버스)
  const fetchLocationBasedData = async (coords: { lat: number; lng: number }, address: string) => {
    try {
      // 학교 조회
      const schoolsResponse = await fetch(
        `/api/schools?lat=${coords.lat}&lng=${coords.lng}&address=${encodeURIComponent(address)}&radius=1.5`
      );
      const schoolsResult: SchoolsApiResponse = await schoolsResponse.json();
      if (schoolsResult.success && schoolsResult.data) {
        console.log(`🏫 주변 학교 로드 완료: 초등 ${schoolsResult.data.elementary.length}개, 중등 ${schoolsResult.data.middle.length}개, 고등 ${schoolsResult.data.high.length}개`);
        setNearbySchools({
          elementary: schoolsResult.data.elementary,
          middle: schoolsResult.data.middle,
          high: schoolsResult.data.high,
        });
      }

      // 지하철 조회
      const subwayResponse = await fetch(
        `/api/subway?lat=${coords.lat}&lng=${coords.lng}&radius=2&limit=5`
      );
      const subwayResult: SubwayApiResponse = await subwayResponse.json();
      if (subwayResult.success && subwayResult.data) {
        console.log(`🚇 주변 지하철역 로드 완료: ${subwayResult.data.length}개`);
        setNearbySubways(subwayResult.data);
      }

      // 버스 조회
      const busResponse = await fetch(
        `/api/bus?lat=${coords.lat}&lng=${coords.lng}&address=${encodeURIComponent(address)}&radius=0.5&limit=5`
      );
      const busResult: BusApiResponse = await busResponse.json();
      if (busResult.success && busResult.data) {
        console.log(`🚌 주변 버스정류장 로드 완료: ${busResult.data.length}개`);
        setNearbyBusStops(busResult.data);
      }
    } catch (error) {
      console.error("위치 기반 데이터 조회 오류:", error);
    }
  };

  // 주소 정리: 괄호 제거, 지번까지만 추출
  const cleanAddress = (address: string): string => {
    // 괄호와 그 안의 내용 제거
    let cleaned = address.replace(/\([^)]*\)/g, "").trim();
    // "일원", "일대" 등 제거
    cleaned = cleaned.replace(/\s*(일원|일대|일대일원)$/g, "").trim();
    // "번지" 뒤의 내용 제거 (번지까지만 유지)
    const bunjiMatch = cleaned.match(/^(.+\d+번지?)/);
    if (bunjiMatch) {
      cleaned = bunjiMatch[1];
    }
    console.log(`📍 주소 정리: "${address}" → "${cleaned}"`);
    return cleaned;
  };

  // 카카오 Geocoder로 주소 → 좌표 변환 (5초 타임아웃)
  const geocodeAddress = (address: string): Promise<{ lat: number; lng: number } | null> => {
    const cleanedAddress = cleanAddress(address);
    return new Promise((resolve) => {
      let resolved = false;
      let checkCount = 0;
      const maxChecks = 50; // 5초 (100ms * 50)

      const doGeocode = () => {
        if (resolved) return;

        window.kakao.maps.load(() => {
          if (resolved) return;

          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(cleanedAddress, (result: any, status: any) => {
            if (resolved) return;
            resolved = true;

            if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
              const coords = {
                lat: parseFloat(result[0].y),
                lng: parseFloat(result[0].x)
              };
              console.log(`📍 주소 좌표 변환 완료: ${cleanedAddress} → ${coords.lat}, ${coords.lng}`);
              resolve(coords);
            } else {
              console.warn(`⚠️ 주소 좌표 변환 실패: ${cleanedAddress}`);
              resolve(null);
            }
          });
        });
      };

      if (window.kakao && window.kakao.maps) {
        doGeocode();
      } else {
        console.warn("카카오맵 SDK 로드 대기 중...");
        const checkKakao = setInterval(() => {
          checkCount++;
          if (checkCount >= maxChecks) {
            clearInterval(checkKakao);
            if (!resolved) {
              resolved = true;
              console.error("⏱️ 카카오맵 SDK 로드 타임아웃");
              resolve(null);
            }
            return;
          }

          if (window.kakao && window.kakao.maps) {
            clearInterval(checkKakao);
            doGeocode();
          }
        }, 100);
      }
    });
  };

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

          // 좌표 가져오기: API 공급 주소로 Geocoding (항상 정확한 위치)
          const supplyAddress = bunyanggwonResult.data.address;
          console.log("📍 공급 주소로 좌표 검색:", supplyAddress);

          geocodeAddress(supplyAddress).then((geocodedCoords) => {
            if (geocodedCoords) {
              console.log("✅ 좌표 변환 성공:", geocodedCoords);
              setCoordinates(geocodedCoords);
              // 좌표 기반 API 호출 (학교, 지하철, 버스)
              fetchLocationBasedData(geocodedCoords, supplyAddress);
            } else {
              console.log("⚠️ 좌표 변환 실패, mock 데이터 사용");
              // Geocoding 실패 시에만 mock 데이터 사용
              if (mockItem?.latitude && mockItem?.longitude) {
                const coords = { lat: mockItem.latitude, lng: mockItem.longitude };
                setCoordinates(coords);
                fetchLocationBasedData(coords, supplyAddress);
              }
            }
          });

          // 3. 주변 시세 조회
          const priceResponse = await fetch(
            `/api/realprice?address=${encodeURIComponent(bunyanggwonResult.data.address)}`
          );
          const priceResult = await priceResponse.json();

          if (priceResult.success) {
            setNearbyPrices(priceResult.data.prices || []);
          }

          // 3-1. 당첨 커트라인 + 특별공급 신청현황 (병렬)
          const houseManageNo = bunyanggwonResult.data.id;
          Promise.all([
            fetch(`/api/winning-cutoff?id=${houseManageNo}`).then((r) => r.json()).catch(() => null),
            fetch(`/api/special-supply?id=${houseManageNo}`).then((r) => r.json()).catch(() => null),
          ]).then(([cutoffResult, specialResult]) => {
            if (cutoffResult?.success && cutoffResult.data) {
              console.log("🎯 당첨 커트라인 로드 완료");
              setWinningCutoff(cutoffResult.data);
            }
            if (specialResult?.success && specialResult.data) {
              console.log("🎁 특별공급 신청현황 로드 완료");
              setSpecialSupply(specialResult.data);
            }
          });

          // 4. 분양 홈페이지 이미지 조회
          // 홈페이지 URL 저장
          if (bunyanggwonResult.data.homepageUrl) {
            setHomepageUrl(bunyanggwonResult.data.homepageUrl);
          }

          const imagesResponse = await fetch(`/api/property-images/${apiId}`);
          const imagesResult = await imagesResponse.json();

          if (imagesResult.success && imagesResult.data) {
            console.log("📷 분양 홈페이지 이미지 로드 완료");
            setPropertyImages(imagesResult.data);
          } else if (imagesResult.needsScraping) {
            // 저장된 이미지 없음 → 자동 크롤링 시도
            console.log("🔍 저장된 이미지 없음, 크롤링 시도...");
            setImageScraping(true);

            try {
              const scrapeResponse = await fetch(`/api/scrape-images/${apiId}`);
              const scrapeResult = await scrapeResponse.json();

              if (scrapeResult.success && scrapeResult.data) {
                console.log("✅ 크롤링 성공!");
                setPropertyImages({
                  birdEyeView: scrapeResult.data.birdEyeView,
                  siteLayout: scrapeResult.data.siteLayout,
                  premium: scrapeResult.data.premium,
                  floorPlans: scrapeResult.data.floorPlans || [],
                  gallery: scrapeResult.data.gallery || [],
                });

                // 크롤링 결과 저장 (다음번엔 바로 로드)
                await fetch(`/api/property-images/${apiId}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...scrapeResult.data,
                    source: "auto",
                  }),
                });
              } else {
                console.log("❌ 크롤링 실패:", scrapeResult.error);
                setImageScrapeFailed(true);
                if (scrapeResult.homepageUrl) {
                  setHomepageUrl(scrapeResult.homepageUrl);
                }
              }
            } catch (scrapeError) {
              console.error("❌ 크롤링 에러:", scrapeError);
              setImageScrapeFailed(true);
            } finally {
              setImageScraping(false);
            }
          }

          // 5. 마피 매물 조회
          const mapiData = getMapiListingsByBunyanggwonId(mockItem?.id || params.id as string);
          if (mapiData.length > 0) {
            console.log(`🏠 마피 매물 ${mapiData.length}건 로드 완료`);
            setMapiListings(mapiData);
          }

          // 5-1. 이 단지 매물 조회 (일반 매물 - 매매/전세/월세)
          const listingsData = getListingsByComplexId(mockItem?.id || params.id as string);
          if (listingsData.length > 0) {
            console.log(`🏢 이 단지 매물 ${listingsData.length}건 로드 완료`);
            setRealEstateListings(listingsData);
          }

          // 6. 주변 입주예정 아파트 조회 (주소 기반, 좌표 불필요)
          const upcomingResponse = await fetch(
            `/api/upcoming-apartments?address=${encodeURIComponent(bunyanggwonResult.data.address)}&excludeId=${apiId}&limit=5`
          );
          const upcomingResult = await upcomingResponse.json();

          if (upcomingResult.success && upcomingResult.data) {
            console.log(`🏠 입주예정 아파트 로드 완료: ${upcomingResult.data.length}개`);
            setUpcomingApartments(upcomingResult.data);
          }

          // 10. 아파트 순위 조회
          const rankingResponse = await fetch(
            `/api/apartment-ranking?address=${encodeURIComponent(bunyanggwonResult.data.address)}&limit=5`
          );
          const rankingResult = await rankingResponse.json();

          if (rankingResult.success && rankingResult.data) {
            console.log(`📊 아파트 순위 로드 완료: ${rankingResult.data.regionName}`);
            setApartmentRanking(rankingResult.data);
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D6BF3] mx-auto mb-4"></div>
            <p className="text-[#5E6C85]">데이터를 불러오는 중...</p>
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
            <p className="text-[#8A94A8] mb-4">매물 정보를 찾을 수 없습니다.</p>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Link href="/category/bunyanggwon" className="text-[#1D6BF3] underline mt-4 inline-block">
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
      <header className="sticky top-0 z-10 bg-[#0B1E40] rounded-b-[22px]">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/category/bunyanggwon" className="flex-none" aria-label="뒤로가기">
            <ChevronLeft className="w-[22px] h-[22px] text-white" strokeWidth={2.2} />
          </Link>
          <h1 className="text-[17px] font-extrabold text-white tracking-[-0.4px] whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0">
            {item.district} {item.propertyName}
          </h1>
          <Heart className="w-5 h-5 text-white flex-none" strokeWidth={1.9} />
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="bg-[#F4F7FB] pb-20">
        {/* 평형 선택 드롭다운 */}
        <div className="px-5 pt-4">
          <div className="relative">
            <button
              onClick={() => setShowPyeongDropdown(!showPyeongDropdown)}
              className="w-full flex items-center justify-between bg-white border border-[#EDF2F8] rounded-[14px] px-4 py-3 shadow-[0_2px_10px_rgba(11,30,64,.05)]"
            >
              <span className="text-[13px] font-bold text-[#1F2A3D]">
                {selectedPyeong}평
              </span>
              <ChevronDown
                className={`w-5 h-5 text-[#5E6C85] transition-transform ${
                  showPyeongDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
            {showPyeongDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#EDF2F8] rounded-[14px] shadow-[0_6px_20px_rgba(11,30,64,.12)] overflow-hidden z-20">
                {availablePyeongs.map((pyeong) => (
                  <button
                    key={pyeong}
                    onClick={() => {
                      setSelectedPyeong(pyeong);
                      setShowPyeongDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left text-[13px] font-semibold text-[#1F2A3D] hover:bg-[#EBF2FF] active:bg-[#E5EEFF]"
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
          <div className="bg-white rounded-[18px] shadow-[0_2px_10px_rgba(11,30,64,.05)] px-[18px] py-4">
            <div className="text-[13px] font-semibold text-[#1F2A3D] leading-[1.5] mb-1.5">
              {item.address}
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#5E6C85]">
              <span>{item.supplyInfo.totalUnits.toLocaleString()}세대</span>
              <span className="text-[#D5DDE9]">|</span>
              <span>{item.moveInDate}(입주예정)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#5E6C85] mt-0.5">
              <span>{item.houseType}</span>
              <span className="text-[#D5DDE9]">|</span>
              <span>{item.region}</span>
            </div>
          </div>
        </div>

        {/* 단지 홍보 배너 */}
        <div className="px-5 pt-4">
          {/* birdEyeView가 없으면 갤러리 첫 번째 이미지를 조감도로 사용 */}
          {(() => {
            const mainImage = propertyImages?.birdEyeView || (propertyImages?.gallery?.length ? propertyImages.gallery[0] : null);
            return mainImage ? (
            <div className="relative rounded-[18px] overflow-hidden mb-3 h-[210px] shadow-[0_2px_10px_rgba(11,30,64,.05)]">
              <Image
                src={mainImage}
                alt={`${item.propertyName} 조감도`}
                fill
                className="object-contain bg-[#EDF2F8]"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: "linear-gradient(to top, rgba(11,30,64,.72), transparent)" }}>
                <p className="text-white text-sm font-semibold">{item.propertyName}</p>
                <p className="text-white/80 text-xs">{item.address}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white text-[#8A94A8] rounded-[18px] p-6 text-center mb-3 shadow-[0_2px_10px_rgba(11,30,64,.05)]">
              {imageScraping ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D6BF3] mx-auto mb-2"></div>
                  <p className="text-sm">이미지 자동 수집 중...</p>
                </>
              ) : imageScrapeFailed ? (
                <>
                  <p className="text-sm mb-3">이미지를 자동으로 찾지 못했습니다</p>
                  <div className="flex gap-2 justify-center">
                    {homepageUrl && (
                      <a
                        href={homepageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#1D6BF3] text-white text-xs rounded-lg hover:bg-[#155ed1]"
                      >
                        분양 홈페이지
                      </a>
                    )}
                    <Link
                      href="/admin/images"
                      className="px-4 py-2 bg-[#1D6BF3] text-white text-xs rounded-lg hover:bg-[#155ed1]"
                    >
                      이미지 등록
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-sm">조감도 이미지 준비중</p>
              )}
            </div>
          );
          })()}
        </div>

        {/* 🔥 마피 매물보기 - 가장 중요! */}
        <div className="px-5 pt-4">
          {mapiListings.length > 0 ? (
            <Link
              href={`/category/bunyanggwon/${params.id}/mapi`}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl py-4 font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-pink-500/30 transition-all active:scale-[0.98]"
            >
              <span className="text-2xl">🏠</span>
              <span>마피 매물보기</span>
              <span className="bg-white text-pink-500 px-3 py-1 rounded-full text-sm font-bold">
                {mapiListings.length}건
              </span>
            </Link>
          ) : (
            <button
              className="w-full bg-[#EDF2F8] text-[#8A94A8] rounded-xl py-4 font-bold text-lg flex items-center justify-center gap-3"
              disabled
            >
              <span className="text-2xl">🏠</span>
              <span>마피 매물 없음</span>
            </button>
          )}
        </div>

        {/* 타입별 분양가 */}
        <div className="px-5 pt-6">
          <h2 className="text-[17px] font-extrabold text-[#0B1E40] tracking-[-0.3px] mb-3">
            타입별 분양가
          </h2>
          <div className="bg-white rounded-[18px] shadow-[0_2px_10px_rgba(11,30,64,.05)] overflow-hidden mb-3">
            <table className="w-full text-sm">
              <thead className="bg-[#F0F4FA]">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-[#5E6C85]">타입</th>
                  <th className="px-3 py-2 text-center font-medium text-[#5E6C85]">공급세대</th>
                  <th className="px-3 py-2 text-right font-medium text-[#5E6C85]">분양가</th>
                </tr>
              </thead>
              <tbody>
                {item.priceInfo && item.priceInfo.length > 0 ? (
                  item.priceInfo.map((priceItem, index) => (
                    <tr
                      key={`${priceItem.type}-${index}`}
                      className={`bg-white border-b border-[#EDF2F8] ${selectedPyeong === priceItem.type ? 'bg-[#EBF2FF]' : ''}`}
                    >
                      <td className="px-3 py-3 text-[#1F2A3D] font-medium">
                        {priceItem.type}타입
                        <div className="text-xs text-[#8A94A8]">{priceItem.exclusiveArea.toFixed(1)}㎡</div>
                      </td>
                      <td className="px-3 py-3 text-center text-[#5E6C85]">
                        {priceItem.totalUnits}세대
                        <div className="text-xs text-[#8A94A8]">
                          (일반 {priceItem.generalUnits} / 특별 {priceItem.specialUnits})
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right text-[#1D6BF3] font-extrabold">
                        {priceItem.price >= 10000
                          ? `${Math.floor(priceItem.price / 10000)}억 ${priceItem.price % 10000 > 0 ? (priceItem.price % 10000).toLocaleString() : ''}`
                          : `${priceItem.price.toLocaleString()}만`}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white">
                    <td colSpan={3} className="px-3 py-3 text-center text-[#8A94A8]">
                      분양가 정보가 없습니다
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 분양 홈페이지 보러가기 */}
        <div className="px-5 pt-2">
          {item.homepageUrl ? (
            <a
              href={item.homepageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-white rounded-[14px] py-3.5 font-extrabold block text-center shadow-[0_6px_16px_rgba(29,107,243,.28)]"
              style={{ background: "linear-gradient(135deg,#1D6BF3,#4A8CFF)" }}
            >
              분양 홈페이지 보러가기
            </a>
          ) : (
            <button className="w-full bg-[#EDF2F8] text-[#8A94A8] rounded-lg py-3 font-medium" disabled>
              홈페이지 없음
            </button>
          )}
        </div>

        {/* 분양안내 */}
        <div className="px-5 pt-6">
          <h2 className="text-[17px] font-extrabold text-[#0B1E40] tracking-[-0.3px] mb-3">분양안내</h2>
          <div className="bg-white rounded-[18px] shadow-[0_2px_10px_rgba(11,30,64,.05)] overflow-hidden mb-3">
            <table className="w-full text-xs">
              <tbody>
                {item.schedule.recruitmentDate && (
                  <tr className="border-b border-[#EDF2F8]">
                    <td className="px-3 py-3 text-[#1D6BF3] font-extrabold bg-[#F0F4FA] w-28">{item.schedule.recruitmentDate}</td>
                    <td className="px-3 py-3 text-[#1F2A3D]">모집공고</td>
                    <td className="px-3 py-3 text-right text-[#5E6C85]">-</td>
                  </tr>
                )}
                {item.schedule.specialSupplyDate && (
                  <tr className="border-b border-[#EDF2F8]">
                    <td className="px-3 py-3 text-[#8A94A8] bg-[#F0F4FA] w-28">{item.schedule.specialSupplyDate}</td>
                    <td className="px-3 py-3 text-[#1F2A3D]">특별공급</td>
                    <td className="px-3 py-3 text-right"><span className="bg-[#E1EDFF] text-[#1D6BF3] text-[10px] font-extrabold px-[9px] py-[3px] rounded-[6px]">청약 시작</span></td>
                  </tr>
                )}
                {item.schedule.subscriptionStartDate && (
                  <tr className="border-b border-[#EDF2F8]">
                    <td className="px-3 py-3 text-[#8A94A8] bg-[#F0F4FA] w-28">{item.schedule.subscriptionStartDate}</td>
                    <td className="px-3 py-3 text-[#1F2A3D]">1순위</td>
                    <td className="px-3 py-3 text-right"><span className="bg-[#E7F6EC] text-[#16A34A] text-[10px] font-extrabold px-[9px] py-[3px] rounded-[6px]">해당지역</span></td>
                  </tr>
                )}
                {item.schedule.subscriptionEndDate && (
                  <tr className="border-b border-[#EDF2F8]">
                    <td className="px-3 py-3 text-[#8A94A8] bg-[#F0F4FA] w-28">{item.schedule.subscriptionEndDate}</td>
                    <td className="px-3 py-3 text-[#1F2A3D]">2순위</td>
                    <td className="px-3 py-3 text-right text-[#5E6C85]">-</td>
                  </tr>
                )}
                {item.schedule.winnerAnnouncementDate && (
                  <tr className="border-b border-[#EDF2F8]">
                    <td className="px-3 py-3 text-[#8A94A8] bg-[#F0F4FA] w-28">{item.schedule.winnerAnnouncementDate}</td>
                    <td className="px-3 py-3 text-[#1F2A3D]">당첨자 발표</td>
                    <td className="px-3 py-3 text-right text-[#5E6C85]">-</td>
                  </tr>
                )}
                {item.schedule.contractStartDate && item.schedule.contractEndDate && (
                  <tr>
                    <td className="px-3 py-3 text-[#8A94A8] bg-[#F0F4FA] w-28">
                      {item.schedule.contractStartDate}~{item.schedule.contractEndDate.slice(5)}
                    </td>
                    <td className="px-3 py-3 text-[#1F2A3D]">계약기간</td>
                    <td className="px-3 py-3 text-right text-[#5E6C85]">-</td>
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
              className="w-full text-white rounded-[14px] py-4 font-extrabold block text-center shadow-[0_6px_16px_rgba(29,107,243,.28)]"
              style={{ background: "linear-gradient(135deg,#1D6BF3,#4A8CFF)" }}
            >
              청약 신청하기 →
            </a>
          ) : (
            <button className="w-full bg-[#EDF2F8] text-[#8A94A8] rounded-lg py-3 font-medium" disabled>
              청약 신청하기
            </button>
          )}
        </div>

        {/* 단지 정보 박스 */}
        <div className="px-5 pt-6">
          <div className="bg-[#EBF2FF] rounded-[16px] px-4 py-[14px] flex gap-1.5 flex-wrap">
            <span className="bg-white text-[#1D6BF3] text-[11px] font-extrabold px-[11px] py-[5px] rounded-full">{item.houseType}</span>
            <span className="bg-white text-[#1D6BF3] text-[11px] font-extrabold px-[11px] py-[5px] rounded-full">{item.supplyInfo.totalUnits}세대</span>
            <span className="bg-white text-[#1D6BF3] text-[11px] font-extrabold px-[11px] py-[5px] rounded-full">{item.schedule.recruitmentDate} 분양</span>
            <span className="bg-white text-[#1D6BF3] text-[11px] font-extrabold px-[11px] py-[5px] rounded-full">{item.moveInDate}(입주예정)</span>
            <span className="bg-white text-[#5E6C85] text-[11px] font-bold px-[11px] py-[5px] rounded-full">{item.region}</span>
            <span className="bg-white text-[#5E6C85] text-[11px] font-bold px-[11px] py-[5px] rounded-full">{item.district}</span>
          </div>
        </div>

        {/* 당첨 커트라인 (가점 정보) */}
        {winningCutoff && winningCutoff.scoresByType.length > 0 && (
          <div className="px-5 pt-6">
            <h2 className="text-[17px] font-extrabold text-[#0B1E40] tracking-[-0.3px] mb-3">당첨 커트라인 (가점)</h2>
            <div className="bg-[#EBF2FF] rounded-[14px] p-3 mb-3">
              <p className="text-xs text-[#1D6BF3]">
                ✓ 청약홈 공공데이터 기반 가점제 당첨자 점수
              </p>
            </div>
            {winningCutoff.summary && (
              <div className="bg-white border border-[#D6E4FF] rounded-[14px] p-3 mb-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xs text-[#8A94A8]">최저</div>
                  <div className="text-base font-bold text-[#1D6BF3]">
                    {winningCutoff.summary.overallLowest}점
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#8A94A8]">평균</div>
                  <div className="text-base font-bold text-[#5E6C85]">
                    {winningCutoff.summary.overallAverage.toFixed(1)}점
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#8A94A8]">최고</div>
                  <div className="text-base font-bold text-[#5E6C85]">
                    {winningCutoff.summary.overallHighest}점
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white rounded-[18px] shadow-[0_2px_10px_rgba(11,30,64,.05)] overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-[#F0F4FA]">
                  <tr>
                    <th className="px-2 py-2 text-left text-[#5E6C85]">주택형</th>
                    <th className="px-2 py-2 text-left text-[#5E6C85]">지역</th>
                    <th className="px-2 py-2 text-right text-[#5E6C85]">최저</th>
                    <th className="px-2 py-2 text-right text-[#5E6C85]">평균</th>
                    <th className="px-2 py-2 text-right text-[#5E6C85]">최고</th>
                  </tr>
                </thead>
                <tbody>
                  {winningCutoff.scoresByType
                    .filter((s) => s.lowestScore > 0)
                    .map((s, i) => (
                      <tr key={i} className="border-t border-[#EDF2F8]">
                        <td className="px-2 py-2 text-[#1F2A3D]">{s.houseType}</td>
                        <td className="px-2 py-2 text-[#5E6C85]">{s.residenceArea}</td>
                        <td className="px-2 py-2 text-right font-bold text-[#1D6BF3]">
                          {s.lowestScore}
                        </td>
                        <td className="px-2 py-2 text-right text-[#5E6C85]">
                          {s.averageScore.toFixed(1)}
                        </td>
                        <td className="px-2 py-2 text-right text-[#5E6C85]">
                          {s.highestScore}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 특별공급 청약접수 현황 (타입별) */}
        {specialSupply && specialSupply.byType.length > 0 && (
          <div className="px-5 pt-6">
            <h2 className="text-[17px] font-extrabold text-[#0B1E40] tracking-[-0.3px] mb-3">
              특별공급 청약접수 현황
            </h2>
            <div className="bg-green-50 rounded-lg p-3 mb-3">
              <p className="text-xs text-green-800">
                ✓ 청약홈 공공데이터 기반 유형별 배정 세대수
              </p>
            </div>
            {/* 유형별 합계 */}
            <div className="bg-white border border-green-200 rounded-lg p-3 mb-3 grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-[#8A94A8]">신혼부부</div>
                <div className="font-bold text-green-700">
                  {specialSupply.totals.newlywed}세대
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#8A94A8]">생애최초</div>
                <div className="font-bold text-green-700">
                  {specialSupply.totals.firstTime}세대
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#8A94A8]">다자녀</div>
                <div className="font-bold text-green-700">
                  {specialSupply.totals.multiChild}세대
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#8A94A8]">노부모부양</div>
                <div className="font-bold text-green-700">
                  {specialSupply.totals.oldParents}세대
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#8A94A8]">기관추천</div>
                <div className="font-bold text-green-700">
                  {specialSupply.totals.agencyRecommend}세대
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#8A94A8]">청년</div>
                <div className="font-bold text-green-700">
                  {specialSupply.totals.youth}세대
                </div>
              </div>
            </div>
            {/* 주택형별 상세 */}
            <div className="bg-white rounded-[18px] shadow-[0_2px_10px_rgba(11,30,64,.05)] overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-[#F0F4FA]">
                  <tr>
                    <th className="px-2 py-2 text-left text-[#5E6C85]">주택형</th>
                    <th className="px-2 py-2 text-right text-[#5E6C85]">신혼</th>
                    <th className="px-2 py-2 text-right text-[#5E6C85]">생애</th>
                    <th className="px-2 py-2 text-right text-[#5E6C85]">다자녀</th>
                    <th className="px-2 py-2 text-right text-[#5E6C85]">노부모</th>
                    <th className="px-2 py-2 text-right text-[#5E6C85]">기관</th>
                    <th className="px-2 py-2 text-right text-[#5E6C85]">계</th>
                  </tr>
                </thead>
                <tbody>
                  {specialSupply.byType.map((t, i) => (
                    <tr key={i} className="border-t border-[#EDF2F8]">
                      <td className="px-2 py-2 text-[#1F2A3D]">{t.houseType}</td>
                      <td className="px-2 py-2 text-right text-[#5E6C85]">{t.newlywed}</td>
                      <td className="px-2 py-2 text-right text-[#5E6C85]">{t.firstTime}</td>
                      <td className="px-2 py-2 text-right text-[#5E6C85]">{t.multiChild}</td>
                      <td className="px-2 py-2 text-right text-[#5E6C85]">{t.oldParents}</td>
                      <td className="px-2 py-2 text-right text-[#5E6C85]">{t.agencyRecommend}</td>
                      <td className="px-2 py-2 text-right font-bold text-green-700">
                        {t.totalSpecialUnits}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 주변 시세 정보 (API 연동) */}
        {nearbyPrices.length > 0 && (
          <div className="px-5 pt-6">
            <h2 className="text-[17px] font-extrabold text-[#0B1E40] tracking-[-0.3px] mb-3">주변 시세 정보 (실거래가)</h2>
            <div className="bg-[#EBF2FF] rounded-[14px] p-3 mb-3">
              <p className="text-xs text-[#1D6BF3]">
                ✓ 공공데이터 API로 가져온 실제 거래 정보입니다
              </p>
            </div>
            <div className="space-y-2">
              {nearbyPrices.slice(0, 5).map((price, index) => (
                <div key={index} className="bg-white rounded-[18px] shadow-[0_2px_10px_rgba(11,30,64,.05)] p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[#1F2A3D]">{price.apartmentName}</span>
                    <span className="text-xs text-[#5E6C85]">{price.pyeong}평</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#5E6C85]">{price.address}</span>
                    <span className="text-sm font-bold text-[#1D6BF3]">
                      {price.recentPrice.toLocaleString()}만원
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#8A94A8]">
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
          <h2 className="text-[17px] font-extrabold text-[#0B1E40] tracking-[-0.3px] mb-3">공급정보</h2>
          <div className="bg-white rounded-[18px] shadow-[0_2px_10px_rgba(11,30,64,.05)] overflow-hidden mb-3">
            <table className="w-full text-xs">
              <tbody>
                <tr className="border-b border-[#EDF2F8]">
                  <td className="px-3 py-2.5 text-[#5E6C85] bg-[#F0F4FA] font-medium">공급위치</td>
                  <td className="px-3 py-2.5 text-[#1F2A3D]">{item.supplyInfo.location}</td>
                </tr>
                <tr className="border-b border-[#EDF2F8]">
                  <td className="px-3 py-2.5 text-[#5E6C85] bg-[#F0F4FA] font-medium">공급규모</td>
                  <td className="px-3 py-2.5 text-[#1D6BF3] font-extrabold">{item.supplyInfo.totalUnits}세대</td>
                </tr>
                <tr className="border-b border-[#EDF2F8]">
                  <td className="px-3 py-2.5 text-[#5E6C85] bg-[#F0F4FA] font-medium">건설사</td>
                  <td className="px-3 py-2.5 text-[#1F2A3D]">{item.supplyInfo.builder}</td>
                </tr>
                <tr className="border-b border-[#EDF2F8]">
                  <td className="px-3 py-2.5 text-[#5E6C85] bg-[#F0F4FA] font-medium">시행사</td>
                  <td className="px-3 py-2.5 text-[#1F2A3D]">{item.supplyInfo.operator}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5 text-[#5E6C85] bg-[#F0F4FA] font-medium">대표전화</td>
                  <td className="px-3 py-2.5 text-[#1D6BF3] font-medium">📞 {item.supplyInfo.phone}</td>
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
                className="w-full text-white rounded-[14px] py-3.5 font-extrabold text-sm block text-center shadow-[0_6px_16px_rgba(29,107,243,.28)]"
                style={{ background: "linear-gradient(135deg,#1D6BF3,#4A8CFF)" }}
              >
                🏠 분양 홈페이지 바로가기
              </a>
            ) : (
              <button className="w-full bg-[#EDF2F8] text-[#8A94A8] rounded-lg py-3 font-medium text-sm" disabled>
                분양 홈페이지 없음
              </button>
            )}
            {item.announcementUrl ? (
              <a
                href={item.announcementUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#E5EEFF] text-[#1D6BF3] rounded-[14px] py-3.5 font-extrabold text-sm block text-center"
              >
                📋 입주자 모집 공고 보기
              </a>
            ) : (
              <button className="w-full bg-[#EDF2F8] text-[#8A94A8] rounded-lg py-3 font-medium text-sm" disabled>
                모집 공고 없음
              </button>
            )}
          </div>
        </div>

        {/* 단지 홍보 이미지 */}
        <div className="px-5 pt-6">
          <h2 className="text-[17px] font-extrabold text-[#0B1E40] tracking-[-0.3px] mb-3">단지 홍보 이미지</h2>
          {propertyImages?.gallery && propertyImages.gallery.length > 0 ? (
            <div className="space-y-3">
              {/* 메인 이미지 */}
              <div className="relative rounded-[18px] overflow-hidden h-56 shadow-[0_2px_10px_rgba(11,30,64,.05)]">
                <Image
                  src={propertyImages.gallery[currentGalleryIndex]}
                  alt={`${item.propertyName} 홍보 이미지 ${currentGalleryIndex + 1}`}
                  fill
                  className="object-contain bg-[#EDF2F8]"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute bottom-2 right-2 text-white text-[11px] font-bold px-[11px] py-1 rounded-full backdrop-blur-sm" style={{ background: "rgba(11,30,64,.55)" }}>
                  {currentGalleryIndex + 1} / {propertyImages.gallery.length}
                </div>
              </div>
              {/* 썸네일 네비게이션 */}
              <div className="grid grid-cols-3 gap-2">
                {propertyImages.gallery.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentGalleryIndex(index)}
                    className={`aspect-[4/3] rounded-[10px] overflow-hidden border-2 transition-all relative ${
                      index === currentGalleryIndex
                        ? "border-[#1D6BF3]"
                        : "border-transparent opacity-60"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`썸네일 ${index + 1}`}
                      fill
                      className="object-contain bg-[#EDF2F8]"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white text-[#8A94A8] rounded-[18px] p-8 text-center shadow-[0_2px_10px_rgba(11,30,64,.05)]">
              {imageScraping ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D6BF3] mx-auto mb-2"></div>
                  <p className="text-sm">홍보 이미지 수집 중...</p>
                </>
              ) : imageScrapeFailed ? (
                <>
                  <p className="text-sm mb-3">홍보 이미지를 찾지 못했습니다</p>
                  <div className="flex gap-2 justify-center">
                    {homepageUrl && (
                      <a
                        href={homepageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#1D6BF3] text-white text-xs rounded-lg hover:bg-[#155ed1]"
                      >
                        분양 홈페이지
                      </a>
                    )}
                    <Link
                      href="/admin/images"
                      className="px-4 py-2 bg-[#1D6BF3] text-white text-xs rounded-lg hover:bg-[#155ed1]"
                    >
                      이미지 등록
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-sm">홍보 이미지 준비중</p>
              )}
            </div>
          )}
        </div>

        {/* 물건 위치도 정보 */}
        <div className="px-5 pt-6">
          <h2 className="text-[17px] font-extrabold text-[#0B1E40] tracking-[-0.3px] mb-3">물건 위치도 정보</h2>
          {coordinates ? (
            <>
              <div className="rounded-xl overflow-hidden mb-3">
                <KakaoMap
                  latitude={coordinates.lat}
                  longitude={coordinates.lng}
                  markerTitle={item.propertyName}
                  level={4}
                  className="w-full h-48 rounded-xl"
                  secondaryMarker={selectedBusStop ? {
                    latitude: selectedBusStop.latitude,
                    longitude: selectedBusStop.longitude,
                    title: selectedBusStop.stationName,
                    type: "bus"
                  } : null}
                />
              </div>
              {selectedBusStop && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">🚌</span>
                    <span className="text-xs text-green-800 font-medium">{selectedBusStop.stationName}</span>
                  </div>
                  <button
                    onClick={() => setSelectedBusStop(null)}
                    className="text-xs text-green-600 hover:text-green-800"
                  >
                    ✕ 닫기
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-[#EDF2F8] text-[#8A94A8] rounded-xl p-12 text-center mb-3">
              <p className="text-sm">지도 정보 준비중</p>
            </div>
          )}
          <div className="bg-white rounded-[18px] shadow-[0_2px_10px_rgba(11,30,64,.05)] p-3">
            <div className="text-sm font-medium text-[#1F2A3D] mb-1">{item.propertyName}</div>
            <div className="text-xs text-[#5E6C85]">{item.address}</div>
          </div>
        </div>

        {/* 주변 대중 교통 (API 연동) */}
        <div className="px-5 pt-6">
          <h2 className="text-[17px] font-extrabold text-[#0B1E40] tracking-[-0.3px] mb-3">주변 대중 교통</h2>
          <p className="text-xs text-[#5E6C85] mb-3">지하철 반경 2km 이내</p>

          {/* 지하철 */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🚇</span>
              <span className="text-xs font-bold text-[#1F2A3D]">
                지하철 {nearbySubways.length > 0 ? nearbySubways.length : "-"}
              </span>
            </div>
            {nearbySubways.length > 0 ? (
              <div className="space-y-2">
                {nearbySubways.map((station, index) => (
                  <div
                    key={`${station.stationId}-${index}`}
                    className="bg-white rounded-[18px] shadow-[0_2px_10px_rgba(11,30,64,.05)] p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                        style={{ backgroundColor: station.lineColor }}
                      >
                        {station.lineNumber}
                      </span>
                      <span className="text-xs text-[#1F2A3D]">
                        {station.stationName}
                        {station.isTransfer && (
                          <span className="ml-1 text-[10px] text-[#1D6BF3]">(환승)</span>
                        )}
                      </span>
                    </div>
                    <span className="text-xs text-[#5E6C85]">
                      {station.distance < 1
                        ? `${Math.round(station.distance * 1000)}m`
                        : `${station.distance.toFixed(1)}km`}{" "}
                      / 도보 {station.walkingTime}분
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#F0F4FA] rounded-[14px] p-4 text-center">
                <p className="text-xs text-[#8A94A8]">반경 2km 내 지하철역이 없습니다</p>
              </div>
            )}
          </div>

          {nearbySubways.length > 0 && (
            <div className="bg-[#EBF2FF] rounded-[14px] p-3">
              <p className="text-xs text-[#1D6BF3]">
                ✓ 전국 도시철도역사정보 데이터 기반 (1,090개 역)
              </p>
            </div>
          )}

          {/* 버스 정류장 */}
          <div className="mt-4">
            <p className="text-xs text-[#5E6C85] mb-1">버스 정류장 반경 500m 이내</p>
            <p className="text-[10px] text-green-600 mb-3">💡 정류장을 클릭하면 지도에 위치가 표시됩니다</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🚌</span>
              <span className="text-xs font-bold text-[#1F2A3D]">
                버스 {nearbyBusStops.length > 0 ? nearbyBusStops.length : "-"}
              </span>
            </div>
            {nearbyBusStops.length > 0 ? (
              <div className="space-y-2">
                {nearbyBusStops.map((stop, index) => (
                  <div
                    key={`${stop.stationId}-${index}`}
                    onClick={() => setSelectedBusStop(selectedBusStop?.stationId === stop.stationId ? null : stop)}
                    className={`bg-white border rounded-lg p-3 flex items-center justify-between cursor-pointer transition-all hover:shadow-md ${
                      selectedBusStop?.stationId === stop.stationId
                        ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                        : "border-[#EDF2F8] hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${
                        selectedBusStop?.stationId === stop.stationId ? "bg-green-600" : "bg-green-500"
                      }`}>
                        B
                      </span>
                      <span className="text-xs text-[#1F2A3D]">{stop.stationName}</span>
                      {selectedBusStop?.stationId === stop.stationId && (
                        <span className="text-[10px] text-green-600 font-medium">📍 지도에 표시됨</span>
                      )}
                    </div>
                    <span className="text-xs text-[#5E6C85]">
                      {stop.distance < 1
                        ? `${Math.round(stop.distance * 1000)}m`
                        : `${stop.distance.toFixed(1)}km`}{" "}
                      / 도보 {stop.walkingTime}분
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#F0F4FA] rounded-[14px] p-4 text-center">
                <p className="text-xs text-[#8A94A8]">반경 500m 내 버스 정류장이 없습니다</p>
              </div>
            )}

            {/* 버스 정류장 지도 */}
            {selectedBusStop && coordinates && (
              <div className="mt-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">🚌</span>
                    <span className="text-xs text-green-800 font-medium">{selectedBusStop.stationName}</span>
                  </div>
                  <button
                    onClick={() => setSelectedBusStop(null)}
                    className="text-xs text-green-600 hover:text-green-800"
                  >
                    ✕ 닫기
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden">
                  <KakaoMap
                    latitude={selectedBusStop.latitude}
                    longitude={selectedBusStop.longitude}
                    markerTitle={selectedBusStop.stationName}
                    level={3}
                    className="w-full h-40 rounded-xl"
                  />
                </div>
              </div>
            )}
          </div>

          {nearbyBusStops.length > 0 && (
            <div className="bg-green-50 rounded-lg p-3 mt-3">
              <p className="text-xs text-green-800">
                ✓ 전국버스정류장위치정보 API 기반 (실시간 데이터)
              </p>
            </div>
          )}
        </div>

        {/* 학군 정보 (API 연동) */}
        <div className="px-5 pt-6">
          <h2 className="text-[17px] font-extrabold text-[#0B1E40] tracking-[-0.3px] mb-3">학군 정보</h2>
          {(nearbySchools.elementary.length > 0 || nearbySchools.middle.length > 0 || nearbySchools.high.length > 0) && (
            <div className="bg-[#EBF2FF] rounded-[14px] p-3 mb-3">
              <p className="text-xs text-[#1D6BF3]">
                ✓ 공공데이터 API로 가져온 실제 학교 정보입니다 (반경 1.5km)
              </p>
            </div>
          )}

          {/* 탭 */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setSchoolTab("elementary")}
              className={`px-4 py-2 text-xs rounded-full font-medium ${
                schoolTab === "elementary"
                  ? "bg-[#1D6BF3] text-white"
                  : "bg-[#EDF2F8] text-[#5E6C85]"
              }`}
            >
              초등학교 ({nearbySchools.elementary.length})
            </button>
            <button
              onClick={() => setSchoolTab("middle")}
              className={`px-4 py-2 text-xs rounded-full font-medium ${
                schoolTab === "middle"
                  ? "bg-[#1D6BF3] text-white"
                  : "bg-[#EDF2F8] text-[#5E6C85]"
              }`}
            >
              중학교 ({nearbySchools.middle.length})
            </button>
            <button
              onClick={() => setSchoolTab("high")}
              className={`px-4 py-2 text-xs rounded-full font-medium ${
                schoolTab === "high"
                  ? "bg-[#1D6BF3] text-white"
                  : "bg-[#EDF2F8] text-[#5E6C85]"
              }`}
            >
              고등학교 ({nearbySchools.high.length})
            </button>
          </div>

          {/* 거리 범례 */}
          <div className="bg-[#F0F4FA] rounded-[14px] p-3 mb-3">
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                도보 5분 이내
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                도보 10분 이내
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                도보 20분 이내
              </span>
            </div>
          </div>

          {/* 학교 목록 */}
          <div className="space-y-2">
            {schoolTab === "elementary" && (
              nearbySchools.elementary.length > 0 ? (
                nearbySchools.elementary.map((school, index) => (
                  <div key={school.schoolId} className="bg-white rounded-[18px] shadow-[0_2px_10px_rgba(11,30,64,.05)] p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[#1F2A3D]">
                        <span className={`mr-1 ${
                          school.walkingTime <= 5 ? 'text-green-500' :
                          school.walkingTime <= 10 ? 'text-yellow-500' : 'text-orange-500'
                        }`}>●</span>
                        {school.schoolName} {school.foundationType}
                      </span>
                      <span className="text-xs text-[#5E6C85]">
                        {(school.distance * 1000).toFixed(0)}m / {school.walkingTime}분
                      </span>
                    </div>
                    {index === 0 && <span className="text-xs text-[#1D6BF3] font-medium">가장 가까움</span>}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#8A94A8]">
                  반경 1.5km 내 초등학교가 없습니다
                </div>
              )
            )}

            {schoolTab === "middle" && (
              nearbySchools.middle.length > 0 ? (
                nearbySchools.middle.map((school, index) => (
                  <div key={school.schoolId} className="bg-white rounded-[18px] shadow-[0_2px_10px_rgba(11,30,64,.05)] p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[#1F2A3D]">
                        <span className={`mr-1 ${
                          school.walkingTime <= 5 ? 'text-green-500' :
                          school.walkingTime <= 10 ? 'text-yellow-500' : 'text-orange-500'
                        }`}>●</span>
                        {school.schoolName} {school.foundationType}
                      </span>
                      <span className="text-xs text-[#5E6C85]">
                        {(school.distance * 1000).toFixed(0)}m / {school.walkingTime}분
                      </span>
                    </div>
                    {index === 0 && <span className="text-xs text-[#1D6BF3] font-medium">가장 가까움</span>}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#8A94A8]">
                  반경 1.5km 내 중학교가 없습니다
                </div>
              )
            )}

            {schoolTab === "high" && (
              nearbySchools.high.length > 0 ? (
                nearbySchools.high.map((school, index) => (
                  <div key={school.schoolId} className="bg-white rounded-[18px] shadow-[0_2px_10px_rgba(11,30,64,.05)] p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[#1F2A3D]">
                        <span className={`mr-1 ${
                          school.walkingTime <= 5 ? 'text-green-500' :
                          school.walkingTime <= 10 ? 'text-yellow-500' : 'text-orange-500'
                        }`}>●</span>
                        {school.schoolName} {school.foundationType}
                      </span>
                      <span className="text-xs text-[#5E6C85]">
                        {(school.distance * 1000).toFixed(0)}m / {school.walkingTime}분
                      </span>
                    </div>
                    {index === 0 && <span className="text-xs text-[#1D6BF3] font-medium">가장 가까움</span>}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#8A94A8]">
                  반경 1.5km 내 고등학교가 없습니다
                </div>
              )
            )}
          </div>
        </div>

        {/* 이 단지 매물 */}
        <ComplexListingPreview
          listings={realEstateListings}
          complexId={params.id as string}
        />

        {/* 대출계산기 */}
        <LoanCalculator
          defaultPrice={selectedPriceInfo?.price || 0}
          propertyName={item.propertyName}
        />

        {/* 주변 입주예정 아파트 */}
        <div className="px-5 pt-6">
          <h2 className="text-[17px] font-extrabold text-[#0B1E40] tracking-[-0.3px] mb-3">주변 입주예정 아파트</h2>
          {upcomingApartments.length > 0 ? (
            <>
              <div className="space-y-3 mb-3">
                {upcomingApartments.slice(0, showMoreApartments ? undefined : 1).map((apt, index) => (
                  <div key={apt.id} className="bg-white rounded-[18px] shadow-[0_2px_10px_rgba(11,30,64,.05)] p-3">
                    <div className="text-xs text-[#1F2A3D] mb-1">{apt.district} {apt.name}</div>
                    <div className="text-xs text-[#5E6C85] mb-1">
                      {apt.moveInDate ? apt.moveInDate.replace(".", "년 ") + "월" : ""} {apt.totalUnits.toLocaleString()}세대
                    </div>
                    {index === 0 && <span className="text-xs text-[#8A94A8]">같은 지역</span>}
                  </div>
                ))}
              </div>
              {upcomingApartments.length > 1 && (
                <button
                  onClick={() => setShowMoreApartments(!showMoreApartments)}
                  className="w-full bg-[#E5EEFF] text-[#1D6BF3] rounded-[14px] py-3 font-extrabold text-sm flex items-center justify-center gap-2"
                >
                  더보기 ({upcomingApartments.length - 1}건) {showMoreApartments ? "▲" : "▼"}
                </button>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-xs text-[#8A94A8]">
              같은 지역에 입주예정 아파트가 없습니다
            </div>
          )}
        </div>

        {/* 지역 순위 */}
        <div className="px-5 pt-6">
          <h2 className="text-[17px] font-extrabold text-[#0B1E40] tracking-[-0.3px] mb-3">
            {apartmentRanking?.regionName || bunyanggwonData?.district || "지역"} 아파트 순위
          </h2>

          {/* 카테고리 탭 - 5개: 종합, 매매, 전세, 월세, 거래량 */}
          <div className="flex gap-1 mb-3 bg-[#EDF2F8] rounded-lg p-1">
            {[
              { key: "composite" as RankingCategory, label: "종합", activeColor: "bg-white text-[#1D6BF3]" },
              { key: "tradePricePerPyeong" as RankingCategory, label: "매매", activeColor: "bg-white text-[#1D6BF3]" },
              { key: "jeonsePrice" as RankingCategory, label: "전세", activeColor: "bg-[#1D6BF3] text-white" },
              { key: "monthlyRentPrice" as RankingCategory, label: "월세", activeColor: "bg-rose-500 text-white" },
              { key: "tradeVolume" as RankingCategory, label: "거래량", activeColor: "bg-white text-[#1F2A3D]" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setRankingCategory(tab.key)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  rankingCategory === tab.key
                    ? `${tab.activeColor} shadow-sm`
                    : "text-[#8A94A8] hover:text-[#5E6C85]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {apartmentRanking?.categoryRankings ? (
            <>
              {/* 순위 리스트 */}
              <div className="space-y-2 mb-3">
                {(apartmentRanking.categoryRankings[rankingCategory] || []).length === 0 ? (
                  <div className="bg-white rounded-[18px] shadow-[0_2px_10px_rgba(11,30,64,.05)] p-4">
                    <div className="py-4 text-center text-xs text-[#8A94A8]">
                      {rankingCategory === "jeonsePrice"
                        ? "전세 거래 데이터가 없습니다"
                        : rankingCategory === "monthlyRentPrice"
                        ? "월세 거래 데이터가 없습니다"
                        : "거래 데이터가 없습니다"}
                    </div>
                  </div>
                ) : null}
                {(apartmentRanking.categoryRankings[rankingCategory] || []).slice(0, 5).map((apt) => (
                  <div
                    key={`${apt.rank}-${apt.name}`}
                    className="bg-white rounded-[18px] shadow-[0_2px_10px_rgba(11,30,64,.05)] p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          apt.rank === 1
                            ? "bg-yellow-400 text-white"
                            : apt.rank === 2
                            ? "bg-gray-400 text-white"
                            : apt.rank === 3
                            ? "bg-orange-400 text-white"
                            : "bg-[#EDF2F8] text-[#5E6C85]"
                        }`}
                      >
                        {apt.rank}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#1F2A3D]">{apt.name}</div>
                        <div className="text-xs text-[#8A94A8]">
                          {apt.district} · 거래 {apt.transactionCount}건
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {rankingCategory === "composite" ? (
                        <>
                          <div className="text-sm font-bold text-[#1D6BF3]">
                            {apt.compositeScore?.toFixed(1)}점
                          </div>
                          <div className="text-xs text-[#8A94A8]">
                            평당 {apt.pricePerPyeong.toLocaleString()}만
                          </div>
                        </>
                      ) : rankingCategory === "tradePricePerPyeong" ? (
                        // 매매: 매매금액 → 평당가 → 상승률
                        <>
                          <div className="text-sm font-bold text-[#1F2A3D]">
                            {apt.avgPrice >= 10000
                              ? `${(apt.avgPrice / 10000).toFixed(1)}억`
                              : `${apt.avgPrice.toLocaleString()}만`}
                          </div>
                          <div className="text-xs text-[#8A94A8]">
                            평당 {apt.pricePerPyeong.toLocaleString()}만
                          </div>
                        </>
                      ) : rankingCategory === "jeonsePrice" ? (
                        // 전세: 보증금 표시
                        <>
                          <div className="text-sm font-bold text-[#1D6BF3]">
                            {apt.avgPrice >= 10000
                              ? `${(apt.avgPrice / 10000).toFixed(1)}억`
                              : `${apt.avgPrice.toLocaleString()}만`}
                          </div>
                          <div className="text-xs text-[#8A94A8]">
                            보증금 · {apt.transactionCount}건
                          </div>
                        </>
                      ) : rankingCategory === "monthlyRentPrice" ? (
                        // 월세: 보증금/월세 형식
                        <>
                          <div className="text-sm font-bold text-rose-600">
                            {apt.monthlyRentDeposit && apt.monthlyRentAmount
                              ? `${apt.monthlyRentDeposit >= 10000
                                  ? (apt.monthlyRentDeposit / 10000).toFixed(1) + '억'
                                  : apt.monthlyRentDeposit.toLocaleString() + '만'} / ${apt.monthlyRentAmount}만`
                              : "-"}
                          </div>
                          <div className="text-xs text-[#8A94A8]">
                            보증금/월세 · {apt.transactionCount}건
                          </div>
                        </>
                      ) : rankingCategory === "tradeVolume" ? (
                        // 거래량
                        <>
                          <div className="text-sm font-bold text-[#1F2A3D]">
                            {apt.transactionCount}건
                          </div>
                          <div className="text-xs text-[#8A94A8]">
                            {apt.avgPrice >= 10000
                              ? `${(apt.avgPrice / 10000).toFixed(1)}억`
                              : `${apt.avgPrice.toLocaleString()}만`}
                          </div>
                        </>
                      ) : null}
                      {(rankingCategory === "composite" || rankingCategory === "tradePricePerPyeong") && apt.changePercent !== undefined && (
                        <div
                          className={`text-xs font-medium ${
                            apt.changePercent > 0
                              ? "text-red-500"
                              : apt.changePercent < 0
                              ? "text-[#1D6BF3]"
                              : "text-[#98A6C0]"
                          }`}
                        >
                          {apt.changePercent > 0 ? "▲" : apt.changePercent < 0 ? "▼" : "-"}{" "}
                          {Math.abs(apt.changePercent)}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 기준 정보 */}
              <div className="text-xs text-[#98A6C0] text-center mb-3">
                {apartmentRanking.period} 실거래가 기준
                {rankingCategory === "composite" && " · 복합점수 = 거래량(40%) + 평당가(30%) + 상승률(30%)"}
                {rankingCategory === "tradePricePerPyeong" && " · 매매 평당가 기준"}
                {rankingCategory === "jeonsePrice" && " · 전세 보증금 높은순"}
                {rankingCategory === "monthlyRentPrice" && " · 보증금/월세 형식"}
                {rankingCategory === "tradeVolume" && " · 총 거래건수 기준"}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-[18px] shadow-[0_2px_10px_rgba(11,30,64,.05)] p-4 mb-3">
              <div className="py-4 text-center text-xs text-[#8A94A8]">
                순위 정보를 불러오는 중...
              </div>
            </div>
          )}

          <div className="space-y-2">
            <button className="w-full bg-[#E5EEFF] text-[#1D6BF3] rounded-[14px] py-3 font-extrabold text-sm">
              {apartmentRanking?.regionName || bunyanggwonData?.district || "지역"} 아파트 순위 더보기
            </button>
          </div>
        </div>

        {/* 마피 매물보기 - 하단 강조 버튼 */}
        <div className="px-5 pt-6 pb-10">
          {mapiListings.length > 0 ? (
            <Link
              href={`/category/bunyanggwon/${params.id}/mapi`}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl py-4 font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-pink-500/30 transition-all active:scale-[0.98]"
            >
              <span className="text-2xl">🏠</span>
              <span>마피 매물보기</span>
              <span className="bg-white text-pink-500 px-3 py-1 rounded-full text-sm font-bold">
                {mapiListings.length}건
              </span>
            </Link>
          ) : (
            <button
              className="w-full bg-[#EDF2F8] text-[#8A94A8] rounded-xl py-4 font-bold text-lg flex items-center justify-center gap-3"
              disabled
            >
              <span className="text-2xl">🏠</span>
              <span>마피 매물 없음</span>
            </button>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}

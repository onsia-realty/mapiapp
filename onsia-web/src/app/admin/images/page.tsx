"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Search,
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  ExternalLink,
  RefreshCw,
  Check,
  X,
} from "lucide-react";

interface PropertyItem {
  id: string;
  apiId?: string;
  propertyName: string;
  address: string;
  hasImages: boolean;
}

interface FloorPlan {
  type: string;
  imageUrl: string;
}

interface PropertyImages {
  birdEyeView?: string;
  siteLayout?: string;
  premium?: string;
  floorPlans: FloorPlan[];
  gallery?: string[];
  source?: string;
  updatedAt?: string;
}

export default function AdminImagesPage() {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(
    null
  );
  const [images, setImages] = useState<PropertyImages>({
    floorPlans: [],
    gallery: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 단지 목록 로드
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      // mock 데이터에서 단지 목록 가져오기
      const { mockBunyanggwon } = await import("@/lib/mock-bunyanggwon");

      // 각 단지의 이미지 등록 여부 확인
      const propertiesWithStatus = await Promise.all(
        mockBunyanggwon.map(async (item) => {
          let hasImages = false;
          if (item.apiId) {
            try {
              const res = await fetch(`/api/property-images/${item.apiId}`);
              const data = await res.json();
              hasImages = data.success;
            } catch {
              hasImages = false;
            }
          }
          return {
            id: item.id,
            apiId: item.apiId,
            propertyName: item.propertyName,
            address: item.address,
            hasImages,
          };
        })
      );

      setProperties(propertiesWithStatus);
      setLoading(false);
    } catch (error) {
      console.error("단지 목록 로드 실패:", error);
      setLoading(false);
    }
  };

  // 단지 선택 시 이미지 로드
  const handleSelectProperty = async (property: PropertyItem) => {
    setSelectedProperty(property);
    setImages({ floorPlans: [], gallery: [] });

    if (!property.apiId) {
      setMessage({
        type: "error",
        text: "API ID가 없는 단지입니다. 청약홈 API ID를 먼저 등록해주세요.",
      });
      return;
    }

    try {
      const res = await fetch(`/api/property-images/${property.apiId}`);
      const data = await res.json();

      if (data.success && data.data) {
        setImages(data.data);
      }
    } catch (error) {
      console.error("이미지 로드 실패:", error);
    }
  };

  // 자동 크롤링
  const handleScrape = async () => {
    if (!selectedProperty?.apiId) return;

    setScraping(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/scrape-images/${selectedProperty.apiId}`);
      const data = await res.json();

      if (data.success && data.data) {
        setImages({
          birdEyeView: data.data.birdEyeView,
          siteLayout: data.data.siteLayout,
          premium: data.data.premium,
          floorPlans: data.data.floorPlans || [],
          gallery: data.data.gallery || [],
        });
        setMessage({
          type: "success",
          text: `크롤링 완료! ${data.data.floorPlans?.length || 0}개 평면도 발견`,
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "크롤링에 실패했습니다",
        });
      }
    } catch (error) {
      console.error("크롤링 실패:", error);
      setMessage({ type: "error", text: "크롤링 중 오류가 발생했습니다" });
    } finally {
      setScraping(false);
    }
  };

  // 이미지 저장
  const handleSave = async () => {
    if (!selectedProperty?.apiId) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/property-images/${selectedProperty.apiId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...images,
          source: "manual",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: "이미지가 저장되었습니다" });
        // 목록 갱신
        loadProperties();
      } else {
        setMessage({ type: "error", text: data.error || "저장에 실패했습니다" });
      }
    } catch (error) {
      console.error("저장 실패:", error);
      setMessage({ type: "error", text: "저장 중 오류가 발생했습니다" });
    } finally {
      setSaving(false);
    }
  };

  // 평면도 추가
  const addFloorPlan = () => {
    setImages((prev) => ({
      ...prev,
      floorPlans: [...prev.floorPlans, { type: "", imageUrl: "" }],
    }));
  };

  // 평면도 삭제
  const removeFloorPlan = (index: number) => {
    setImages((prev) => ({
      ...prev,
      floorPlans: prev.floorPlans.filter((_, i) => i !== index),
    }));
  };

  // 평면도 수정
  const updateFloorPlan = (
    index: number,
    field: "type" | "imageUrl",
    value: string
  ) => {
    setImages((prev) => ({
      ...prev,
      floorPlans: prev.floorPlans.map((fp, i) =>
        i === index ? { ...fp, [field]: value } : fp
      ),
    }));
  };

  // 필터된 단지 목록
  const filteredProperties = properties.filter(
    (p) =>
      p.propertyName.includes(searchQuery) || p.address.includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/category/bunyanggwon">
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">
              분양 이미지 관리
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 단지 목록 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-bold text-gray-900 mb-4">단지 목록</h2>

          {/* 검색 */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="단지명 또는 주소 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* 목록 */}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredProperties.map((property) => (
              <button
                key={property.id}
                onClick={() => handleSelectProperty(property)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedProperty?.id === property.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {property.propertyName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {property.address}
                    </p>
                    {property.apiId && (
                      <p className="text-xs text-blue-600 mt-1">
                        API: {property.apiId}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {property.hasImages ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <Check className="w-3 h-3 mr-1" />
                        등록됨
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        <X className="w-3 h-3 mr-1" />
                        미등록
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 이미지 편집 */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
          {selectedProperty ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-gray-900">
                    {selectedProperty.propertyName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedProperty.address}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedProperty.apiId && (
                    <button
                      onClick={handleScrape}
                      disabled={scraping}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${scraping ? "animate-spin" : ""}`}
                      />
                      자동 크롤링
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={saving || !selectedProperty.apiId}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "저장 중..." : "저장"}
                  </button>
                </div>
              </div>

              {/* 알림 메시지 */}
              {message && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm ${
                    message.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* 이미지 입력 폼 */}
              <div className="space-y-6">
                {/* 조감도 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    조감도
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={images.birdEyeView || ""}
                      onChange={(e) =>
                        setImages((prev) => ({
                          ...prev,
                          birdEyeView: e.target.value,
                        }))
                      }
                      placeholder="이미지 URL 입력"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    {images.birdEyeView && (
                      <div className="w-20 h-14 relative rounded overflow-hidden bg-gray-100">
                        <Image
                          src={images.birdEyeView}
                          alt="조감도 미리보기"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 단지배치도 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    단지배치도
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={images.siteLayout || ""}
                      onChange={(e) =>
                        setImages((prev) => ({
                          ...prev,
                          siteLayout: e.target.value,
                        }))
                      }
                      placeholder="이미지 URL 입력"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    {images.siteLayout && (
                      <div className="w-20 h-14 relative rounded overflow-hidden bg-gray-100">
                        <Image
                          src={images.siteLayout}
                          alt="배치도 미리보기"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 프리미엄 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    프리미엄 홍보 이미지
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={images.premium || ""}
                      onChange={(e) =>
                        setImages((prev) => ({
                          ...prev,
                          premium: e.target.value,
                        }))
                      }
                      placeholder="이미지 URL 입력"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    {images.premium && (
                      <div className="w-20 h-14 relative rounded overflow-hidden bg-gray-100">
                        <Image
                          src={images.premium}
                          alt="프리미엄 미리보기"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 평면도 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      평면도 ({images.floorPlans.length}개)
                    </label>
                    <button
                      onClick={addFloorPlan}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="w-4 h-4" />
                      추가
                    </button>
                  </div>
                  <div className="space-y-3">
                    {images.floorPlans.map((fp, index) => (
                      <div
                        key={index}
                        className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg"
                      >
                        <input
                          type="text"
                          value={fp.type}
                          onChange={(e) =>
                            updateFloorPlan(index, "type", e.target.value)
                          }
                          placeholder="타입 (예: 84A)"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          value={fp.imageUrl}
                          onChange={(e) =>
                            updateFloorPlan(index, "imageUrl", e.target.value)
                          }
                          placeholder="이미지 URL"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        {fp.imageUrl && (
                          <div className="w-14 h-14 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={fp.imageUrl}
                              alt={`${fp.type} 미리보기`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                        <button
                          onClick={() => removeFloorPlan(index)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
              <p>왼쪽에서 단지를 선택하세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

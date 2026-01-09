/**
 * 분양 홈페이지 이미지 API
 * 분양 홈페이지에서 조감도, 단지배치도, 평면도 이미지 URL을 반환
 */

import { NextRequest, NextResponse } from "next/server";
import { PropertyImages } from "@/types/api";

// 분양 홈페이지별 이미지 매핑 (사전 정의)
// 실제 운영 시에는 크롤링 서버를 별도 구축하거나 사용자가 직접 등록
const propertyImagesMap: Record<string, PropertyImages> = {
  // 클러스터용인 경남아너스빌
  "2025000189": {
    birdEyeView: "https://cluster-honorsville.co.kr/img/sub/business_open_n2.jpg?new",
    siteLayout: "https://cluster-honorsville.co.kr/img/sub/dange_01_n4.jpg?new",
    premium: "https://cluster-honorsville.co.kr/img/sub/premium_n5.jpg?new",
    floorPlans: [
      {
        type: "84A",
        imageUrl: "https://cluster-honorsville.co.kr/img/sub/floor01.jpg?new",
      },
      {
        type: "84B",
        imageUrl: "https://cluster-honorsville.co.kr/img/sub/floor02.jpg?new",
      },
      {
        type: "123",
        imageUrl: "https://cluster-honorsville.co.kr/img/sub/floor03_n1.jpg?new",
      },
    ],
    gallery: [
      "https://cluster-honorsville.co.kr/img/sub/business_open_n2.jpg?new",
      "https://cluster-honorsville.co.kr/img/sub/premium_n5.jpg?new",
      "https://cluster-honorsville.co.kr/img/sub/dange_01_n4.jpg?new",
    ],
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("📷 이미지 API 호출:", { id });

    // 사전 정의된 이미지 매핑 확인
    const images = propertyImagesMap[id];

    if (!images) {
      console.log("⚠️ 등록된 이미지 없음:", id);
      return NextResponse.json(
        {
          success: false,
          error: "등록된 이미지가 없습니다",
          data: null,
        },
        { status: 404 }
      );
    }

    console.log("✅ 이미지 데이터 반환:", {
      id,
      floorPlansCount: images.floorPlans.length,
      hasGallery: !!images.gallery?.length,
    });

    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("❌ 이미지 API 에러:", error);
    return NextResponse.json(
      {
        success: false,
        error: "이미지 조회 중 오류가 발생했습니다",
      },
      { status: 500 }
    );
  }
}

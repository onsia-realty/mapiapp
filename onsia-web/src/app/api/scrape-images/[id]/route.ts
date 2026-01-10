/**
 * 이미지 크롤링 API
 * 분양 홈페이지에서 조감도, 평면도 등 이미지를 자동 추출
 */

import { NextRequest, NextResponse } from "next/server";
import { scrapePropertyImages } from "@/lib/image-scraper";
import { getApplyHomeDetail } from "@/lib/api/applyhome";

export const maxDuration = 30; // Vercel 타임아웃 설정 (초)
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("🔍 크롤링 API 호출:", { id });

    // 1. 청약홈 API에서 홈페이지 URL 가져오기
    const propertyData = await getApplyHomeDetail(id);

    if (!propertyData) {
      return NextResponse.json(
        {
          success: false,
          error: "분양 정보를 찾을 수 없습니다",
        },
        { status: 404 }
      );
    }

    const homepageUrl = propertyData.homepageUrl;

    if (!homepageUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "분양 홈페이지 URL이 없습니다",
        },
        { status: 404 }
      );
    }

    console.log("🌐 분양 홈페이지:", homepageUrl);

    // 2. 홈페이지 크롤링
    const scrapedImages = await scrapePropertyImages(homepageUrl);

    if (!scrapedImages) {
      return NextResponse.json(
        {
          success: false,
          error: "이미지 크롤링에 실패했습니다",
          homepageUrl,
        },
        { status: 500 }
      );
    }

    // 3. 결과 반환
    return NextResponse.json({
      success: true,
      data: scrapedImages,
      homepageUrl,
    });
  } catch (error) {
    console.error("❌ 크롤링 API 에러:", error);
    return NextResponse.json(
      {
        success: false,
        error: "크롤링 중 오류가 발생했습니다",
      },
      { status: 500 }
    );
  }
}

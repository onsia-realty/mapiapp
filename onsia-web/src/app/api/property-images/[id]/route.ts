/**
 * 분양 이미지 API
 * 우선순위: JSON 저장소 > 크롤링 > 없음
 */

import { NextRequest, NextResponse } from "next/server";
import { PropertyImages } from "@/types/api";
import fs from "fs";
import path from "path";

// JSON 파일 경로
const DATA_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "property-images.json"
);

interface StoredPropertyImages extends PropertyImages {
  source?: "manual" | "auto";
  updatedAt?: string;
}

/**
 * JSON 파일에서 이미지 데이터 로드
 */
function loadImagesFromFile(): Record<string, StoredPropertyImages> {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const data = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("❌ JSON 파일 로드 실패:", error);
  }
  return {};
}

/**
 * JSON 파일에 이미지 데이터 저장
 */
function saveImagesToFile(data: Record<string, StoredPropertyImages>): boolean {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("❌ JSON 파일 저장 실패:", error);
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("📷 이미지 API 호출:", { id });

    // 1. JSON 파일에서 저장된 이미지 확인
    const storedImages = loadImagesFromFile();
    const images = storedImages[id];

    if (images) {
      console.log("✅ 저장된 이미지 반환:", {
        id,
        source: images.source || "manual",
        floorPlansCount: images.floorPlans?.length || 0,
      });

      return NextResponse.json({
        success: true,
        data: images,
        source: images.source || "manual",
      });
    }

    // 2. 저장된 이미지 없음 - 크롤링 필요
    console.log("⚠️ 등록된 이미지 없음:", id);
    return NextResponse.json(
      {
        success: false,
        error: "등록된 이미지가 없습니다",
        data: null,
        needsScraping: true,
      },
      { status: 404 }
    );
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

/**
 * 이미지 저장 (관리자용)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log("💾 이미지 저장 요청:", { id });

    // 기존 데이터 로드
    const storedImages = loadImagesFromFile();

    // 새 이미지 데이터 저장
    storedImages[id] = {
      birdEyeView: body.birdEyeView,
      siteLayout: body.siteLayout,
      premium: body.premium,
      floorPlans: body.floorPlans || [],
      gallery: body.gallery || [],
      source: body.source || "manual",
      updatedAt: new Date().toISOString().split("T")[0],
    };

    // 파일에 저장
    const saved = saveImagesToFile(storedImages);

    if (!saved) {
      return NextResponse.json(
        {
          success: false,
          error: "이미지 저장에 실패했습니다",
        },
        { status: 500 }
      );
    }

    console.log("✅ 이미지 저장 완료:", { id });

    return NextResponse.json({
      success: true,
      message: "이미지가 저장되었습니다",
      data: storedImages[id],
    });
  } catch (error) {
    console.error("❌ 이미지 저장 에러:", error);
    return NextResponse.json(
      {
        success: false,
        error: "이미지 저장 중 오류가 발생했습니다",
      },
      { status: 500 }
    );
  }
}

/**
 * 이미지 삭제 (관리자용)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("🗑️ 이미지 삭제 요청:", { id });

    // 기존 데이터 로드
    const storedImages = loadImagesFromFile();

    if (!storedImages[id]) {
      return NextResponse.json(
        {
          success: false,
          error: "삭제할 이미지가 없습니다",
        },
        { status: 404 }
      );
    }

    // 삭제
    delete storedImages[id];

    // 파일에 저장
    const saved = saveImagesToFile(storedImages);

    if (!saved) {
      return NextResponse.json(
        {
          success: false,
          error: "이미지 삭제에 실패했습니다",
        },
        { status: 500 }
      );
    }

    console.log("✅ 이미지 삭제 완료:", { id });

    return NextResponse.json({
      success: true,
      message: "이미지가 삭제되었습니다",
    });
  } catch (error) {
    console.error("❌ 이미지 삭제 에러:", error);
    return NextResponse.json(
      {
        success: false,
        error: "이미지 삭제 중 오류가 발생했습니다",
      },
      { status: 500 }
    );
  }
}

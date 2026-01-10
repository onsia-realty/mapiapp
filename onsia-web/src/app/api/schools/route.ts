import { NextRequest, NextResponse } from "next/server";
import { getNearbySchools, NearbySchool } from "@/lib/api/school";

export interface SchoolsApiResponse {
  success: boolean;
  data: {
    elementary: NearbySchool[]; // 초등학교
    middle: NearbySchool[]; // 중학교
    high: NearbySchool[]; // 고등학교
    kindergarten: NearbySchool[]; // 유치원 (별도 API 필요, 현재 미지원)
  };
  message?: string;
}

/**
 * 좌표 기반 주변 학교 조회 API
 *
 * GET /api/schools?lat={latitude}&lng={longitude}&radius={radius}
 *
 * @param lat - 위도 (필수)
 * @param lng - 경도 (필수)
 * @param radius - 반경 km (선택, 기본값 1.5)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = parseFloat(searchParams.get("radius") || "1.5");

  if (!lat || !lng) {
    return NextResponse.json(
      {
        success: false,
        data: { elementary: [], middle: [], high: [], kindergarten: [] },
        message: "lat, lng 파라미터가 필요합니다.",
      },
      { status: 400 }
    );
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      {
        success: false,
        data: { elementary: [], middle: [], high: [], kindergarten: [] },
        message: "유효하지 않은 좌표입니다.",
      },
      { status: 400 }
    );
  }

  try {
    console.log(`📚 학교 검색: 좌표 (${latitude}, ${longitude}), 반경: ${radius}km`);

    // 각 학교급별로 조회 (정적 데이터에서 필터링)
    const elementarySchools = getNearbySchools(latitude, longitude, radius, 5, "초등");
    const middleSchools = getNearbySchools(latitude, longitude, radius, 5, "중학");
    const highSchools = getNearbySchools(latitude, longitude, radius, 5, "고등");

    const response: SchoolsApiResponse = {
      success: true,
      data: {
        elementary: elementarySchools,
        middle: middleSchools,
        high: highSchools,
        kindergarten: [], // 유치원 데이터 없음
      },
    };

    console.log(
      `✅ 주변 학교 검색 완료: 초등 ${response.data.elementary.length}개, 중학 ${response.data.middle.length}개, 고등 ${response.data.high.length}개`
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("학교 API 에러:", error);
    return NextResponse.json(
      {
        success: false,
        data: { elementary: [], middle: [], high: [], kindergarten: [] },
        message: "학교 정보를 가져오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

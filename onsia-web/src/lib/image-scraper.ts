/**
 * 분양 홈페이지 이미지 크롤러
 * Puppeteer를 사용하여 분양 홈페이지에서 이미지를 자동 추출
 */

import puppeteer, { Browser, Page } from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export interface ScrapedImages {
  birdEyeView?: string;
  siteLayout?: string;
  premium?: string;
  floorPlans: Array<{ type: string; imageUrl: string }>;
  gallery: string[];
  homepageUrl: string;
  scrapedAt: string;
}

// 이미지 카테고리별 키워드
const IMAGE_KEYWORDS = {
  birdEyeView: ["조감도", "bird", "aerial", "전경", "overview", "투시도"],
  siteLayout: ["배치도", "layout", "단지배치", "site", "배치"],
  premium: ["프리미엄", "premium", "홍보", "분양", "intro"],
  floorPlan: ["평면도", "floor", "평면", "세대", "unit", "타입"],
};

// 탐색할 메뉴 키워드
const MENU_KEYWORDS = [
  "단지안내",
  "단지정보",
  "단지소개",
  "세대안내",
  "평면안내",
  "평면도",
  "조감도",
  "사업개요",
  "프리미엄",
];

/**
 * 브라우저 인스턴스 생성
 */
async function getBrowser(): Promise<Browser> {
  const isLocal = process.env.NODE_ENV === "development";

  if (isLocal) {
    // 로컬 개발 환경 - 설치된 Chrome 사용
    return puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath:
        process.platform === "win32"
          ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
          : process.platform === "darwin"
            ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
            : "/usr/bin/google-chrome",
    });
  } else {
    // Vercel 서버리스 환경
    const executablePath = await chromium.executablePath();
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 720 },
      executablePath,
      headless: true,
    });
  }
}

/**
 * 이미지 URL이 유효한지 확인
 */
function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  // data URL, base64, 빈 이미지 제외
  if (url.startsWith("data:")) return false;
  if (url.includes("placeholder")) return false;
  if (url.includes("blank")) return false;
  if (url.includes("loading")) return false;
  // 이미지 확장자 확인
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const urlLower = url.toLowerCase();
  return imageExtensions.some((ext) => urlLower.includes(ext));
}

/**
 * URL을 절대 경로로 변환
 */
function toAbsoluteUrl(url: string, baseUrl: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("//")) return "https:" + url;
  if (url.startsWith("/")) {
    const base = new URL(baseUrl);
    return `${base.protocol}//${base.host}${url}`;
  }
  // 상대 경로
  const base = new URL(baseUrl);
  const basePath = base.pathname.substring(0, base.pathname.lastIndexOf("/"));
  return `${base.protocol}//${base.host}${basePath}/${url.replace("./", "")}`;
}

/**
 * 페이지에서 이미지 추출
 */
async function extractImagesFromPage(
  page: Page,
  baseUrl: string
): Promise<Array<{ src: string; alt: string; width: number }>> {
  return page.evaluate((baseUrl) => {
    const images = Array.from(document.querySelectorAll("img"));
    return images
      .map((img) => ({
        src: img.src || img.getAttribute("data-src") || "",
        alt: img.alt || img.title || "",
        width: img.naturalWidth || img.width || 0,
      }))
      .filter((img) => img.src && img.width >= 300);
  }, baseUrl);
}

/**
 * 이미지를 카테고리별로 분류
 */
function categorizeImage(
  url: string,
  alt: string
): keyof typeof IMAGE_KEYWORDS | null {
  const searchText = (url + " " + alt).toLowerCase();

  for (const [category, keywords] of Object.entries(IMAGE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return category as keyof typeof IMAGE_KEYWORDS;
      }
    }
  }

  return null;
}

/**
 * 분양 홈페이지에서 이미지 크롤링
 */
export async function scrapePropertyImages(
  homepageUrl: string
): Promise<ScrapedImages | null> {
  let browser: Browser | null = null;

  try {
    console.log("🔍 크롤링 시작:", homepageUrl);
    browser = await getBrowser();
    const page = await browser.newPage();

    // 타임아웃 설정
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(10000);

    // User-Agent 설정
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // 메인 페이지 로드
    await page.goto(homepageUrl, { waitUntil: "networkidle2" });

    const result: ScrapedImages = {
      floorPlans: [],
      gallery: [],
      homepageUrl,
      scrapedAt: new Date().toISOString(),
    };

    // 1. 메인 페이지에서 이미지 추출
    const mainImages = await extractImagesFromPage(page, homepageUrl);
    console.log(`📷 메인 페이지에서 ${mainImages.length}개 이미지 발견`);

    for (const img of mainImages) {
      const absoluteUrl = toAbsoluteUrl(img.src, homepageUrl);
      if (!isValidImageUrl(absoluteUrl)) continue;

      const category = categorizeImage(absoluteUrl, img.alt);

      if (category === "birdEyeView" && !result.birdEyeView) {
        result.birdEyeView = absoluteUrl;
      } else if (category === "siteLayout" && !result.siteLayout) {
        result.siteLayout = absoluteUrl;
      } else if (category === "premium" && !result.premium) {
        result.premium = absoluteUrl;
      } else if (category === "floorPlan") {
        // 타입 추출 시도 (예: 84A, 59B 등)
        const typeMatch = (img.alt + absoluteUrl).match(
          /(\d{2,3}[A-Z]?|\d{2,3})/i
        );
        const type = typeMatch ? typeMatch[1].toUpperCase() : `타입${result.floorPlans.length + 1}`;

        if (!result.floorPlans.some((fp) => fp.imageUrl === absoluteUrl)) {
          result.floorPlans.push({ type, imageUrl: absoluteUrl });
        }
      } else if (img.width >= 500) {
        // 큰 이미지는 갤러리에 추가
        if (!result.gallery.includes(absoluteUrl)) {
          result.gallery.push(absoluteUrl);
        }
      }
    }

    // 2. 서브 페이지 탐색 (단지안내, 세대안내 등)
    const menuLinks = await page.evaluate((keywords) => {
      const links = Array.from(document.querySelectorAll("a"));
      return links
        .filter((a) => {
          const text = a.textContent || "";
          return keywords.some((kw) => text.includes(kw));
        })
        .map((a) => a.href)
        .filter((href) => href && !href.includes("javascript"));
    }, MENU_KEYWORDS);

    console.log(`🔗 서브 페이지 ${menuLinks.length}개 발견`);

    // 최대 3개 서브 페이지만 탐색 (시간 제한)
    for (const link of menuLinks.slice(0, 3)) {
      try {
        await page.goto(link, { waitUntil: "networkidle2" });
        const subImages = await extractImagesFromPage(page, link);

        for (const img of subImages) {
          const absoluteUrl = toAbsoluteUrl(img.src, link);
          if (!isValidImageUrl(absoluteUrl)) continue;

          const category = categorizeImage(absoluteUrl, img.alt);

          if (category === "birdEyeView" && !result.birdEyeView) {
            result.birdEyeView = absoluteUrl;
          } else if (category === "siteLayout" && !result.siteLayout) {
            result.siteLayout = absoluteUrl;
          } else if (category === "floorPlan") {
            const typeMatch = (img.alt + absoluteUrl).match(
              /(\d{2,3}[A-Z]?|\d{2,3})/i
            );
            const type = typeMatch ? typeMatch[1].toUpperCase() : `타입${result.floorPlans.length + 1}`;

            if (!result.floorPlans.some((fp) => fp.imageUrl === absoluteUrl)) {
              result.floorPlans.push({ type, imageUrl: absoluteUrl });
            }
          }
        }
      } catch (e) {
        console.log(`⚠️ 서브 페이지 로드 실패: ${link}`);
      }
    }

    console.log("✅ 크롤링 완료:", {
      birdEyeView: !!result.birdEyeView,
      siteLayout: !!result.siteLayout,
      floorPlans: result.floorPlans.length,
      gallery: result.gallery.length,
    });

    return result;
  } catch (error) {
    console.error("❌ 크롤링 실패:", error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

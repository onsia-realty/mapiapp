# Onsia Real Estate Platform - Development Guidelines

## 프로젝트 개요
온시아 부동산 플랫폼 사용자 앱 개발 프로젝트

## 핵심 개발 원칙

### 1. UI/UX 구현 원칙
**요구제기서 파일에 있는 UI를 그대로 재현한다**

- **참조 문서**: `onsia-web/public/요구제기서_주)온시아_V3.1_2601_사용자앱/*.jpg`
- **구현 방식**:
  - 디자인 스펙의 모든 요소를 픽셀 단위로 정확히 재현
  - 레이아웃, 색상, 폰트 크기, 간격 등 모든 시각적 요소 일치
  - 버튼, 탭, 드롭다운 등 모든 인터랙션 요소 동일하게 구현
  - 텍스트 내용도 요구제기서와 100% 일치 (개발 단계에서는 mock 데이터 사용 가능)

- **검증 방법**:
  - 요구제기서 이미지와 실제 구현을 시각적으로 비교
  - 모든 섹션, 버튼, 텍스트가 스펙과 일치하는지 확인
  - 사용자 흐름(User Flow)이 요구제기서와 동일한지 검증

### 2. 데이터 연동 원칙
**API를 연결하여 실제 제공 데이터와 100% 일치하도록 한다**

- **⚠️ 중요: API 우선, Mock은 사용자 요청 시에만**:
  - **기본**: 항상 실제 API에서 데이터 조회 (청약홈 API 등)
  - **Mock 사용 조건**: 사용자가 명시적으로 "mock 데이터 사용" 요청 시에만
  - Mock 파일은 API 장애 시 fallback 또는 개발 참고용으로만 유지
  - 목록/상세 모두 API 데이터 우선 표시

- **API 우선 개발**:
  - API 응답 데이터 구조에 맞춰 컴포넌트 설계
  - 모든 표시 데이터는 API에서 제공되는 실제 값 사용
  - 가격, 세대수, 일정 등 모든 정보는 API에서 직접 조회

- **데이터 정합성**:
  - API 응답과 UI 표시 데이터 100% 일치
  - 데이터 가공 시 원본 데이터 무결성 유지
  - 에러 처리 및 로딩 상태 명확히 표시

- **타입 안정성**:
  - TypeScript 인터페이스로 API 응답 구조 정의
  - 모든 데이터 필드에 대한 타입 체크
  - 옵셔널 데이터에 대한 안전한 처리

### 3. 개발 우선순위

1. **UI 정확성** - 요구제기서와 픽셀 단위 일치
2. **데이터 정합성** - API 데이터와 100% 일치
3. **반응형 디자인** - 모바일 우선, PC 대응
4. **성능 최적화** - 이미지 최적화, 코드 스플리팅
5. **접근성** - WCAG 기준 준수

### 4. 코드 작성 규칙

- **컴포넌트 구조**:
  - 페이지별 독립적인 컴포넌트 구성
  - 재사용 가능한 공통 컴포넌트 분리
  - Mock 데이터는 별도 파일로 관리 (`/lib/mock-*.ts`)

- **스타일링**:
  - Tailwind CSS 사용
  - 디자인 시스템 토큰 활용 (색상, 간격 등)
  - 모바일 우선 반응형 디자인

- **상태 관리**:
  - 로컬 상태는 React Hook (useState, useReducer)
  - 전역 상태는 필요 시 Context API 또는 상태 관리 라이브러리

## 페이지별 구현 상태

### 분양권 전매 (마피)
- ✅ 목록 페이지 (`/category/bunyanggwon`)
- ✅ 단지 상세 페이지 (`/category/bunyanggwon/[id]`) - Pages 17-21 완료
  - 청약홈 API 연동 (분양 정보, 일정, 가격)
  - 분양 홈페이지 이미지 크롤링 (조감도, 평면도)
  - 카카오맵 연동
  - 주변 시세 API 연동
  - Next.js Image 최적화 적용
- ✅ 호실별 매물 리스트 (`/category/bunyanggwon/[id]/mapi`) - Page 22 완료
  - 정렬 기능 (최신순, 낮은가격순, 높은가격순)
  - 프리미엄/마이너스P 뱃지 표시
  - 조회수/좋아요 표시
- ✅ 개별 매물 상세 (`/category/bunyanggwon/[id]/mapi/[mapiId]`) - Pages 23-25 완료
  - 이미지 슬라이더
  - 매매 금액/매물 정보 테이블
  - 주변 시세 API, 실거래 TOP3 API 연동
  - 단지 정보, 중개사 정보
  - 전화문의/채팅문의 버튼

### 기타 카테고리
- ✅ 이자만 (`/category/ijaman`)
- ✅ 아파트 (`/category/apartment`)
- ✅ 오피스텔 (`/category/officetel`)
- ✅ 사무실 (`/category/office`)
- ✅ 상가 (`/category/store`)

## API 연동 가이드

### 구현된 API 엔드포인트
```typescript
// 분양권 상세 (청약홈 API 연동)
GET /api/bunyanggwon/{apiId}
- 청약홈 공공데이터 API 호출
- 분양 정보, 일정, 가격 정보 반환

// 주변 시세 (실거래가 API 연동)
GET /api/realprice?address={address}
- 국토교통부 실거래가 공공데이터 API 호출
- 주변 아파트 실거래 정보 반환

// 분양 홈페이지 이미지
GET /api/property-images/{apiId}
- 분양 홈페이지에서 크롤링한 이미지 정보
- 조감도, 단지배치도, 평면도, 갤러리 반환
```

### Mock 데이터 파일
```typescript
// 분양권 목록 Mock
/lib/mock-bunyanggwon.ts

// 마피 매물 Mock
/lib/mock-mapi.ts
- MAPI001: 101동 1201호 (마이너스P -3,000만)
- MAPI002: 102동 503호 (P 없음)
- MAPI003: 103동 1801호 (프리미엄 +5,000만)
```

### 데이터 모델 예시
```typescript
interface BunyanggwonDetail {
  id: string;
  propertyName: string;
  district: string;
  address: string;
  moveInDate: string;
  pyeongTypes: string[];
  supplyInfo: {
    location: string;
    totalUnits: number;
    builder: string;
    operator: string;
    phone: string;
  };
  priceTable: Array<{
    type: string;
    units: number;
    price: number;
  }>;
  schedule: Array<{
    date: string;
    event: string;
    daysUntil: string;
  }>;
  // ... 기타 필드
}
```

## 개발 환경

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **지도**: Kakao Maps SDK
- **이미지**: Next.js Image (외부 도메인 설정 완료)
- **API**: 청약홈 공공데이터 API, 국토교통부 실거래가 API
- **환경변수**: `.env.local`에 `DATA_GO_KR_API_KEY` 설정 필요

## 공공데이터포털 API 가이드

### 국토교통부 실거래가 API

**엔드포인트:**
```
매매 상세: https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev
전월세: https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent
분양권전매: https://apis.data.go.kr/1613000/RTMSDataSvcSilvTrade/getRTMSDataSvcSilvTrade
```

**⚠️ 중요 주의사항:**
1. **API 성공 코드는 `000` (3자리)** - `00`이 아님!
   ```typescript
   // ❌ 잘못된 코드
   if (!text.includes("<resultCode>00</resultCode>"))

   // ✅ 올바른 코드
   if (!text.includes("<resultCode>000</resultCode>"))
   ```

2. **응답 형식은 XML** - JSON이 아님
   - XML 파싱 로직 필요
   - `<item>` 태그 내부 필드 추출

3. **User-Agent 헤더 필수** (일부 환경에서)
   ```typescript
   headers: {
     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
   }
   ```

4. **API별 별도 신청 필요**
   - 매매, 전월세, 분양권전매 각각 data.go.kr에서 신청
   - 신청 후 10분~1시간 활성화 대기

### 가격 표시 형식 (호갱노노 스타일)
- **매매**: `32억 5,000` (억/만원)
- **전세**: `4억 2,000` (보증금)
- **월세**: `5,000/150` (보증금/월세)

## 품질 기준

- ✅ 요구제기서 UI 100% 재현
- ✅ API 데이터 100% 일치
- ✅ TypeScript 타입 체크 통과
- ✅ 반응형 디자인 (모바일 + PC)
- ✅ 성능 최적화 (Core Web Vitals)

## 주의사항

1. **절대 임의로 디자인 변경 금지** - 요구제기서가 절대 기준
2. **데이터 정합성 필수** - API 응답과 화면 표시 데이터 일치
3. **타입 안정성 보장** - 모든 데이터에 TypeScript 타입 적용
4. **사용자 경험 우선** - 로딩, 에러, 엣지 케이스 모두 고려

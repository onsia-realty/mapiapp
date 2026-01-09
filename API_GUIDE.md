# 공공데이터 API 연동 가이드

## 개요

온시아 부동산 플랫폼은 두 가지 공공데이터 API를 사용합니다:

1. **청약홈 분양정보 API** (한국부동산원) - 분양권 기본 정보
2. **아파트 실거래가 API** (국토교통부) - 주변 시세 정보

## API 구조

### 1. 청약홈 분양정보 API

**엔드포인트**: `/api/bunyanggwon`

**요청 예시**:
```typescript
// 전체 목록 조회
const response = await fetch('/api/bunyanggwon');
const { data } = await response.json();

// 지역별 조회
const response = await fetch('/api/bunyanggwon?region=서울');

// 주택유형별 조회
const response = await fetch('/api/bunyanggwon?houseType=아파트');
```

**응답 형식**:
```json
{
  "success": true,
  "data": [
    {
      "id": "2024000001",
      "propertyName": "용인 경남아너스빌",
      "district": "처인구",
      "address": "경기도 용인시 처인구 역북동",
      "moveInDate": "2026.05",
      "status": "청약접수중",
      "thumbnailUrl": "https://...",
      "schedule": {
        "recruitmentDate": "2025.12.12",
        "subscriptionStartDate": "2025.12.22",
        "subscriptionEndDate": "2025.12.24",
        "winnerAnnouncementDate": "2025.12.31",
        "contractStartDate": "2026.01.12",
        "contractEndDate": "2026.01.14"
      },
      "supplyInfo": {
        "location": "경기도 용인시 처인구 역북동 455-25",
        "totalUnits": 367,
        "builder": "한화건설",
        "operator": "대연3구역재건축정비사업조합",
        "phone": "051-626-7774"
      },
      "houseType": "아파트",
      "region": "경기도"
    }
  ],
  "total": 100
}
```

### 2. 분양권 상세 조회 API

**엔드포인트**: `/api/bunyanggwon/[id]`

**요청 예시**:
```typescript
const response = await fetch('/api/bunyanggwon/2024000001');
const { data } = await response.json();
```

### 3. 실거래가 조회 API

**엔드포인트**: `/api/realprice`

**요청 예시**:
```typescript
// 주소 기반 주변 시세 조회
const response = await fetch('/api/realprice?address=경기도 용인시 처인구 역북동');
const { data } = await response.json();

// 특정 년월 조회
const response = await fetch('/api/realprice?address=경기도 용인시 처인구 역북동&yearMonth=202401');
```

**응답 형식**:
```json
{
  "success": true,
  "data": {
    "prices": [
      {
        "apartmentName": "래미안 퍼스티지",
        "address": "역북동 455-25",
        "exclusiveArea": 84.9,
        "pyeong": 26,
        "recentPrice": 72000,
        "buildYear": "2020",
        "floor": "15",
        "transactionDate": "2024.01.15"
      }
    ],
    "averagePrice": 75000,
    "total": 10
  }
}
```

## 프론트엔드 사용 예시

### React 컴포넌트에서 사용

```typescript
"use client";

import { useEffect, useState } from "react";
import { BunyanggwonData, NearbyPriceData } from "@/types/api";

export default function BunyanggwonList() {
  const [bunyanggwonList, setBunyanggwonList] = useState<BunyanggwonData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 청약홈 API 호출
        const response = await fetch('/api/bunyanggwon');
        const result = await response.json();

        if (result.success) {
          setBunyanggwonList(result.data);
        }
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      {bunyanggwonList.map((item) => (
        <div key={item.id}>
          <h3>{item.propertyName}</h3>
          <p>{item.address}</p>
          <p>입주예정: {item.moveInDate}</p>
        </div>
      ))}
    </div>
  );
}
```

### 주변 시세 조회

```typescript
"use client";

import { useEffect, useState } from "react";
import { NearbyPriceData } from "@/types/api";

export default function NearbyPrice({ address }: { address: string }) {
  const [prices, setPrices] = useState<NearbyPriceData[]>([]);
  const [averagePrice, setAveragePrice] = useState(0);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const response = await fetch(`/api/realprice?address=${encodeURIComponent(address)}`);
        const result = await response.json();

        if (result.success) {
          setPrices(result.data.prices);
          setAveragePrice(result.data.averagePrice);
        }
      } catch (error) {
        console.error('시세 조회 실패:', error);
      }
    }

    fetchPrice();
  }, [address]);

  return (
    <div>
      <h3>주변 시세</h3>
      <p>평균: {averagePrice.toLocaleString()}만원</p>
      <ul>
        {prices.map((price, index) => (
          <li key={index}>
            {price.apartmentName} {price.pyeong}평: {price.recentPrice.toLocaleString()}만원
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 공공데이터 API 설정

### 환경변수 설정

`.env.local` 파일에 API 키 추가:

```bash
# 공공데이터포털 API 키
DATA_GO_KR_API_KEY=your_api_key_here
```

### API 키 발급 방법

1. [공공데이터포털](https://www.data.go.kr) 회원가입
2. 다음 API 활용 신청:
   - **한국부동산원_분양정보**
   - **국토교통부_아파트매매_실거래가_자료**
3. 승인 후 발급된 API 키를 `.env.local`에 추가

## 데이터 흐름

```
┌─────────────┐
│  청약홈     │ → 분양 기본 정보 (주택명, 주소, 일정 등)
└─────────────┘
       ↓
┌─────────────┐
│ 온시아 앱   │ → UI 표시 + 추가 정보 (이미지, 설명 등)
└─────────────┘
       ↓
┌─────────────┐
│ 실거래가 API│ → 주변 시세 정보 (평형별 거래가)
└─────────────┘
```

## 주요 특징

### 1. 자동 상태 판단
청약 일정 기반으로 자동 상태 계산:
- `모집중`: 모집공고일 이후
- `청약접수중`: 청약접수 기간 중
- `계약진행중`: 계약 기간 중
- `마감`: 계약 종료 후

### 2. 실시간 데이터
- 1시간마다 캐시 갱신 (`revalidate: 3600`)
- 최신 분양 정보 자동 반영

### 3. 타입 안정성
- TypeScript 인터페이스로 완전한 타입 체크
- API 응답 에러 핸들링

## 다음 단계

- [ ] 실제 공공데이터 API 테스트
- [ ] 지역코드 매핑 테이블 완성
- [ ] 에러 처리 강화
- [ ] 로딩 상태 UI 개선
- [ ] 페이지네이션 구현
- [ ] 검색 필터 기능 추가

## MVP 검증 포인트

✅ **청약홈 정보 등재**: 공공데이터 API로 분양 정보 자동 가져오기
✅ **주소 기반 시세**: 실거래가 API로 주변 시세 표시
✅ **API 설정 가능**: 환경변수로 API 키 관리

→ **전문가 검토 준비 완료**

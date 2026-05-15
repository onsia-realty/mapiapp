# 📩 To: 개발팀 — A 항목 (지식산업센터/상가) 답변

## 결론
**지식산업센터는 공공데이터 CSV로 즉시 구현 가능합니다.** (이미 우리 쪽에 977건 시드 + API 라우트 구축 완료)
**상가는 공공데이터 자체가 없어** 별도 입력 시스템이 필요합니다.

---

## 1. 데이터 소스 (지식산업센터)

### 메인 — CSV (시드 데이터, 977건)
- **이름**: 한국산업단지공단_전국지식산업센터현황
- **URL**: https://www.data.go.kr/data/15117154/fileData.do
- **형식**: CSV (CP949 인코딩)
- **갱신**: 연 1~2회 (현재 2025-06-30 버전이 최신)
- **제공 컬럼 22개**: 시도, 시군구, **지식산업센터명, 단지명, 분양형태, 건축상태**, 회사명(시행), 산단구분, 지목, 용지면적, 건축면적, 제조면적, 부대면적, 도로명/지번 주소, 용도지역1/2, 설치자(공공/민간) 등

### 보조 — OpenAPI (실시간 단건 조회)
- **이름**: 한국산업단지공단_공장등록필지정보조회
- **URL**: https://www.data.go.kr/data/15087615/openapi.do
- **엔드포인트**: `http://apis.data.go.kr/B550624/fctryRegistLndpclInfo/getFctryLndpclService`
- **검색 조건**: `fctryNm`(공장명), `adres`(주소), `crmnNm`(대표자), `prdcArtcl`(생산품목)

> CSV가 마스터 리스트, OpenAPI는 단건 상세 조회 보조용으로 쓰는 구조입니다.

---

## 2. 구현 방법 (3단계)

### Step 1: CSV 다운로드 → 필터링 → JSON 변환
- 분양형태가 **`분양` 또는 `분양/임대`**인 행만 추출 → 1,549건 → **977건**
- 인코딩 주의: CP949 → UTF-8 변환 필요
- 따옴표 안 쉼표 처리 위해 RFC 4180 호환 파서 사용 (단순 split 금지)

### Step 2: 필터 조합 권장
```
분양형태 ∈ {분양, 분양/임대}
+ 건축상태 ∈ {건축중, 미착공}    ← 실제 분양 진행중 (152건)
또는
+ 건축상태 = 건축완료              ← 잔여세대 분양 가능 (789건)
```

### Step 3: 갱신 자동화
- 공공데이터포털에서 새 CSV 배포될 때마다 변환 스크립트 재실행
- 또는 CI에 cron으로 등록 (월 1회 권장)

---

## 3. 우리 쪽에서 이미 구현해둔 것 (그대로 쓰면 됨)

### 라우트
| 엔드포인트 | 용도 |
|-----------|------|
| `GET /api/knowledge-centers` | 목록 (필터: sido, sigungu, saleType, buildStatus, keyword) |
| `GET /api/factory-land?adres=...` | 단건 실시간 조회 (OpenAPI 프록시) |

### 호출 예시
```
GET /api/knowledge-centers?sido=경기도&saleType=분양&buildStatus=건축중&limit=20
```

### 응답 형식
```json
{
  "success": true,
  "total": 977,
  "data": [
    {
      "id": "KIC-00001",
      "centerName": "강릉 공공임대형 지식산업센터",
      "sido": "강원특별자치도",
      "sigungu": "강릉시",
      "complexName": "강릉과학일반산업단지",
      "saleType": "분양",
      "buildStatus": "건축중",
      "company": "강릉시청",
      "roadAddress": "...",
      "landArea": 7964,
      "buildingArea": 8586
    }
  ],
  "meta": {
    "source": "한국산업단지공단_전국지식산업센터현황",
    "sourceUrl": "https://www.data.go.kr/data/15117154/fileData.do",
    "referenceDate": "2025-06-30"
  }
}
```

### 관련 파일
- 변환 스크립트: `scripts/convert-knowledge-centers.mjs`
- 데이터: `src/data/knowledge-centers.json` (977건 임베드)
- 라이브러리: `src/lib/api/knowledge-centers.ts`, `src/lib/api/factory-land.ts`
- 라우트: `src/app/api/knowledge-centers/route.ts`, `src/app/api/factory-land/route.ts`

### 갱신 명령어
```bash
node scripts/convert-knowledge-centers.mjs <새CSV경로>
```

---

## 4. ⚠️ 한계 / 개발사 측 보완 필요사항

| 항목 | CSV에서 제공 | CSV에 없음 |
|------|-------------|-----------|
| 단지명/주소/면적 | ✅ | |
| 분양형태/건축상태 | ✅ | |
| 시행/시공사 | ✅ (회사명) | |
| **분양가, 분양 일정** | ❌ | 공공데이터에 없음 |
| **세대수, 평형 정보** | ❌ | 공공데이터에 없음 |
| **모집공고 PDF** | ❌ | 공공데이터에 없음 |
| **연락처** | ❌ | 공공데이터에 없음 |

분양가/일정 등은 **공공데이터로는 못 구합니다**. 다음 중 선택:
1. 팩토리온 사이트 크롤링 (분양중 매물 페이지)
2. 분양 사이트 RSS/연동 (지산플러스, 부동산플래닛 등)
3. **자체 어드민으로 영업사원/대행사가 직접 입력** ← 가장 현실적

---

## 5. 상가는 별도

상가용 공공데이터 API는 없습니다. 다음 중 결정 필요:
- 자체 어드민 입력 (지산과 동일 구조)
- 디스코, 상가의신, 점포라인 등 외부 사이트 제휴/크롤링
- 영업사원이 매물별 등록

---

## 한 줄 요약 (핵심)

> 지식산업센터는 **CSV(전국 977건 시드) + OpenAPI(실시간 단건 조회) 조합**으로 구현 완료. 분양가·일정 등 상세 정보는 공공데이터에 없으므로 **자체 입력 시스템 별도 필요**. 상가는 공공데이터 자체가 없음.

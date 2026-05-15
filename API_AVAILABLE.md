# 구현 완료된 API 목록 (개발팀 인계용)

> 이 문서는 현재 `onsia-web`에 **이미 구현되어 동작 가능한** 공공데이터 기반 API만 정리한 것입니다.
> 모든 API는 `DATA_GO_KR_API_KEY` 환경변수의 공공데이터포털 인증키로 호출됩니다.

---

## 1. 청약/분양 정보

### 1-1. 분양정보 목록 (APT)
| 항목 | 내용 |
|------|------|
| 내부 라우트 | `GET /api/bunyanggwon` |
| 소스 | `src/lib/api/applyhome.ts` |
| 외부 API | `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail` |
| 출처 | 공공데이터포털 — 한국부동산원_청약홈 분양정보 조회 서비스 |
| 지원 파라미터 | `regionCode`, `houseType`, `startDate`, `endDate`, `page`, `perPage` |
| 비고 | **아파트 전용** (지식산업센터/상가는 미지원) |

### 1-2. 분양정보 상세 + 분양가
| 항목 | 내용 |
|------|------|
| 내부 라우트 | `GET /api/bunyanggwon/[id]` |
| 소스 | `src/lib/api/applyhome.ts` (`getApplyHomeDetail`) |
| 외부 API | `…/getAPTLttotPblancDetail` + `…/getAPTLttotPblancMdl` |
| 반환 | 일정/공급정보 + 평형별 분양가, 전용/공급면적, 평당가 |

### 1-3. 주변 입주예정 단지
| 항목 | 내용 |
|------|------|
| 내부 라우트 | `GET /api/upcoming-apartments` |
| 소스 | `src/lib/api/upcoming-apartments.ts` |
| 외부 API | `…/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail` |
| 기능 | 시도 코드 + 시/구 단위로 동일 지역 입주예정 단지 N개 추출 |

### 1-4. 당첨 커트라인 (가점 정보) ✅ 구현 완료
| 항목 | 내용 |
|------|------|
| 내부 라우트 | `GET /api/winning-cutoff?id={주택관리번호}` |
| 소스 | `src/lib/api/applyhome-winner.ts` |
| 외부 API | `https://api.odcloud.kr/api/ApplyhomeInfoCmpetRtSvc/v1/getAptLttotPblancScore` |
| 출처 | 공공데이터포털 (15098905) — 한국부동산원_청약홈 청약접수 경쟁률 및 특별공급 신청현황 조회 서비스 |
| 반환 데이터 | 주택형 × 거주지역(해당지역/기타경기/기타지역)별 **최저(커트라인) / 평균 / 최고 가점**, 전체 요약 |
| 적용 화면 | 분양 상세 페이지 "당첨 커트라인 (가점)" 섹션 |
| 호출 예시 | `/api/winning-cutoff?id=2024000123` |

### 1-5. 특별공급 청약접수 현황 (타입별) ✅ 구현 완료
| 항목 | 내용 |
|------|------|
| 내부 라우트 | `GET /api/special-supply?id={주택관리번호}` |
| 소스 | `src/lib/api/applyhome-competition.ts` |
| 외부 API | `https://api.odcloud.kr/api/ApplyhomeInfoCmpetRtSvc/v1/getAPTSpsplyReqstStus` |
| 출처 | 공공데이터포털 (15098905) — 한국부동산원_청약홈 청약접수 경쟁률 및 특별공급 신청현황 조회 서비스 |
| 반환 데이터 | 주택형별 특별공급 배정 (**신혼부부 / 생애최초 / 다자녀 / 노부모부양 / 기관추천 / 청년**) + 유형별 합계 |
| 적용 화면 | 분양 상세 페이지 "특별공급 청약접수 현황" 섹션 |
| 호출 예시 | `/api/special-supply?id=2024000123` |

### 1-6. 지식산업센터 목록 (CSV 시드) ✅ 구현 완료
| 항목 | 내용 |
|------|------|
| 내부 라우트 | `GET /api/knowledge-centers?sido=&sigungu=&saleType=&buildStatus=&keyword=&limit=&offset=` |
| 소스 | `src/lib/api/knowledge-centers.ts` + `src/data/knowledge-centers.json` (임베드) |
| 변환 스크립트 | `scripts/convert-knowledge-centers.mjs` (CSV → JSON) |
| 외부 출처 | 한국산업단지공단_전국지식산업센터현황 (2025-06-30) — https://www.data.go.kr/data/15117154/fileData.do |
| 데이터 규모 | 전체 1,549개 → **분양/분양임대 977개** 필터링 (분양 796 + 분양/임대 181) |
| 건축상태 | 건축완료 789 / 건축중 42 / 미착공 110 / 빈값 36 |
| 컬럼 | 시도, 시군구, 지식산업센터명, 단지명, 분양형태, 건축상태, 회사명(시행), 산단구분, 면적(용지/건축/제조/부대), 주소(도로명/지번), 용도지역, 설치자(공공/민간) |
| 적용 화면 | 분양정보 페이지 "지식산업센터" 탭 자동 표시 |
| 갱신 방법 | 새 CSV 다운 → `node scripts/convert-knowledge-centers.mjs <CSV경로>` |

### 1-7. 공장등록 필지정보 (실시간 OpenAPI) ✅ 구현 완료
| 항목 | 내용 |
|------|------|
| 내부 라우트 | `GET /api/factory-land?fctryNm=&adres=&crmnNm=&prdcArtcl=&pageNo=&numOfRows=` |
| 소스 | `src/lib/api/factory-land.ts` |
| 외부 API | `http://apis.data.go.kr/B550624/fctryRegistLndpclInfo/getFctryLndpclService` |
| 출처 | 공공데이터포털 (15087615) — 한국산업단지공단_공장등록필지정보조회서비스 |
| 검색 조건 | 회사/공장명, 주소, 대표자명, 생산품목 |
| 응답 형식 | XML (기본) / JSON (`type=json`) — 내부에서 자동 파싱 |
| 비고 | 응답 필드는 첫 실호출 후 명세에 맞춰 매핑 정밀화 가능 (현재 raw 보존) |

---

## 2. 실거래가 / 시세

### 2-1. 주소 기반 주변 실거래가 (간이)
| 항목 | 내용 |
|------|------|
| 내부 라우트 | `GET /api/realprice?address=...&yearMonth=YYYYMM` |
| 소스 | `src/lib/api/realprice.ts` |
| 외부 API | `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade` |
| 출처 | 국토교통부_아파트매매 실거래가 자료 |
| 반환 | 평형별 거래가, 평균가, 평당가 |

### 2-2. 상세 실거래가 (매매/전월세/분양권 전매)
| 항목 | 내용 |
|------|------|
| 내부 라우트 | `GET /api/real-transaction` |
| 소스 | `src/lib/api/real-transaction.ts` |
| 외부 API | 매매: `https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev` <br> 전월세: `https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent` <br> 분양권 전매: `https://apis.data.go.kr/1613000/RTMSDataSvcSilvTrade/getRTMSDataSvcSilvTrade` |
| 형식 | XML 응답 → 내부 파서로 JSON 변환 |

### 2-3. 아파트 순위 / 경쟁단지 비교
| 항목 | 내용 |
|------|------|
| 내부 라우트 | `GET /api/apartment-ranking` |
| 소스 | `src/lib/api/apartment-ranking.ts` |
| 외부 API | `…/RTMSDataSvcAptTrade` + `…/RTMSDataSvcAptRent` 합성 |
| 산출 방식 | **복합 점수 = 거래량 × 0.4 + 평당가 × 0.3 + 상승률 × 0.3** |
| 카테고리 | 매매 평당가 / 전세 평당가 / 월세 평당가 / 거래량 |
| 활용 | **경쟁단지 가격 비교**, **지역 평당가 비교** 즉시 사용 가능 |

---

## 3. 주변 시설 (지도 마커용)

### 3-1. 버스 정류장
| 항목 | 내용 |
|------|------|
| 내부 라우트 | `GET /api/bus` |
| 소스 | `src/lib/api/bus.ts` |
| 외부 API | `https://api.odcloud.kr/api/15067528/v1/uddi:f74b9799-9db1-4754-a5d0-b66e2ae705f3` |
| 출처 | 전국버스정류장위치정보 |
| 반환 필드 | 정류장번호, 정류장명, 위경도, 도시명/코드 |

### 3-2. 지하철역
| 항목 | 내용 |
|------|------|
| 내부 라우트 | `GET /api/subway` |
| 소스 | `src/lib/api/subway.ts` + `src/data/subway-stations.json` |
| 출처 | 전국도시철도역사정보 표준데이터 (data.go.kr) — **정적 JSON 임베드** |
| 반환 필드 | 역명, 노선, 환승여부, 영문명 등 |

### 3-3. 초·중·고등학교
| 항목 | 내용 |
|------|------|
| 내부 라우트 | `GET /api/schools` |
| 소스 | `src/lib/api/school.ts` + `src/data/schools.json` |
| 출처 | 전국초중등학교위치 표준데이터 (data.go.kr) — **정적 JSON 임베드** (원본 API 서버 접속 불가로 엑셀 변환) |
| 반환 필드 | 학교명/유형, 공/사립, 도로명·지번 주소, 위경도 |

---

## 4. 보조 (이미지/스크래핑)

| 라우트 | 소스 | 용도 |
|--------|------|------|
| `GET /api/property-images` | `src/app/api/property-images/route.ts` | 단지 이미지 조회 |
| `GET /api/scrape-images` | `src/app/api/scrape-images/route.ts` | 외부 이미지 스크래핑 (Puppeteer) |

---

## 개발팀 5개 요청 항목 매핑

| 개발팀 요청 | 매핑 가능 여부 | 사용할 내부 라우트 |
|-------------|---------------|------------------|
| a-1. 지식산업센터 분양정보 | ✅ 사용 가능 | `/api/knowledge-centers` (CSV 시드) + `/api/factory-land` (실시간) |
| a-2. 상가 / 기타 | ⚠️ 자체 데이터 필요 | 청약홈/공공API에 없음 — 어드민 입력 또는 외부 사이트 연동 |
| b. 경쟁단지 가격 비교 | ✅ 사용 가능 | `/api/apartment-ranking` |
| c. 주변 분양단지 당첨 커트라인 | ✅ 사용 가능 | `/api/winning-cutoff?id={주택관리번호}` |
| d. 지역 평당가 비교 | ✅ 사용 가능 | `/api/apartment-ranking`, `/api/realprice` |
| e. 특별공급 청약접수 현황 (타입별) | ✅ 사용 가능 | `/api/special-supply?id={주택관리번호}` |

> **요약**: 5개 중 **5개 모두 구현 완료** (a는 지식산업센터만 / 상가는 별도 입력 시스템 필요).
> 모든 항목이 분양정보 / 분양 상세 페이지에 자동 표시됨.

---

## 환경설정

```bash
# .env.local
DATA_GO_KR_API_KEY=공공데이터포털_인증키
```

신청해야 할 공공데이터포털 활용 신청 목록:

### 이미 신청·사용 중
1. 한국부동산원_청약홈 분양정보 조회 서비스 (`ApplyhomeInfoDetailSvc`) — https://www.data.go.kr/data/15098547/openapi.do
2. 국토교통부_아파트매매 실거래가 자료 (`RTMSDataSvcAptTrade`)
3. 국토교통부_아파트매매 실거래 상세 자료 (`RTMSDataSvcAptTradeDev`)
4. 국토교통부_아파트 전월세 자료 (`RTMSDataSvcAptRent`)
5. 국토교통부_아파트 분양권 전매 신고 자료 (`RTMSDataSvcSilvTrade`)
6. 전국버스정류장위치정보 (`15067528`)

### 추가 신청·사용 중 (c, e 구현용)
7. **한국부동산원_청약홈 청약접수 경쟁률 및 특별공급 신청현황 조회 서비스** — https://www.data.go.kr/data/15098905/openapi.do
   - 용도: 당첨 가점(`getAptLttotPblancScore`) + 특별공급 유형별(`getAPTSpsplyReqstStus`)

### 선택 신청 (지역별 통계 — 보조 데이터)
8. 한국부동산원_청약홈 청약 신청·당첨자 정보 조회 서비스 (`ApplyhomeStatSvc`) — https://www.data.go.kr/data/15110812/openapi.do
   - 용도: 지역별/연령별 신청·당첨자 통계 (현재 미사용, 필요 시 추가)

### 지식산업센터 (a 항목)
9. **한국산업단지공단_공장등록필지정보조회** — https://www.data.go.kr/data/15087615/openapi.do
   - 용도: `/api/factory-land` (실시간 필지정보)
10. **한국산업단지공단_전국지식산업센터현황** (FileData / CSV) — https://www.data.go.kr/data/15117154/fileData.do
    - 용도: `/api/knowledge-centers` (시드 데이터, 977건)

> 모든 키는 동일한 `DATA_GO_KR_API_KEY` 하나로 사용 가능 (서비스별 활용신청만 각각 필요).
> 활용신청은 보통 **자동 승인** (즉시 사용 가능).

---

## 참고 자료
- [한국부동산원 공공데이터 자료실 (기술문서 다운로드)](https://www.reb.or.kr/reb/na/ntt/selectNttList.do?mi=10251&bbsId=1268)
- [공공데이터포털 — 한국부동산원 제공 데이터 전체 목록](https://www.data.go.kr/tcs/dss/selectDataSetList.do?orgFullName=%ED%95%9C%EA%B5%AD%EB%B6%80%EB%8F%99%EC%82%B0%EC%9B%90)

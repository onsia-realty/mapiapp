---
name: project_mapi_apk_analysis
description: "개발사 마피 APK는 SmartMaker 씬클라이언트 — 역분석 불가, 실기기 관찰로 재현해야 함"
metadata: 
  node_type: memory
  type: project
  originSessionId: cf0426fc-3da8-4b03-ade5-608e48dcb87b
---

개발사가 만든 마피 앱 APK(`mapi_apk.apk` = v2.1.0, 루트에 위치 / 구버전 `onsia-web/docs/mapi_1450484161.apk`)는 **SmartMaker(엠비즈메이커) 노코드 플랫폼으로 빌드된 씬 클라이언트**다.

- 패키지명: `com.knowledgeware.modelexecutor80.mapi_1450484161`, 액티비티: `com.SoftPower.SmartMaker.MainActivity`
- APK 내부엔 엔진(껍데기)만 있고 **앱 화면·데이터가 전혀 없음** (레이아웃 293개 전부 라이브러리 공통, 온시아 고유 화면 0개). 화면/데이터는 전부 서버에서 런타임에 받아옴.
- **∴ APK 역분석으로 UI를 복원/포팅하는 것은 불가능.** 실기기에서 동작 화면을 관찰해서 Next.js 데모(`onsia-web`)에 재현하는 방식이 유일한 정답.
- PC(BlueStacks)에서는 "서버접속에 실패" 뜸 — 하드코딩 엔진 도메인 `www.mbizmaker.com`이 DNS 소멸(NXDOMAIN). 단 **실제 폰에서는 정상 동작**함(서버 살아있음).

**목적(2026-07-02 회의용):** 개발사와 회의 때 동작하는 웹 데모를 띄워 "여기까지 됐는데 이런 부분이 부족/개선 필요, 더 디테일하게" 를 짚어줄 레퍼런스로 사용. 싸움이 아니라 협업 피드백용. 관련: [[project_mapi_live_app_capture]] [[project_3party_structure]]

# 개발사 질의 답변: SNS 로그인 KEY

> 외주 개발사 → 고객사 KEY 요청에 대한 답변
> 작성일: 2026-05-04
> 항목: 1번 (SNS 로그인 KEY)

---

## 1. 사용 제공자

**Kakao / Google / Apple 3개 제공자**로 확정 (네이버 제외, 2026-05-04 결정).

---

## 2. 제공자별 필요 KEY/자료

### 2.1 Kakao 로그인

발급처: [Kakao Developers](https://developers.kakao.com) → 내 애플리케이션

| 항목 | 용도 | 비고 |
|---|---|---|
| 네이티브 앱 키 | Android/iOS 앱 SDK | 플랫폼 등록 후 발급 |
| REST API 키 | 서버 OAuth 검증 | 서버측 토큰 검증용 |
| JavaScript 키 | 웹 SDK | 웹 로그인 사용 시 |
| Admin 키 | 관리자 API | 노출 금지 (서버 only) |

**플랫폼 등록 정보 (고객사 → 개발사 전달 필요):**
- Android 패키지명 + 키 해시 (Release/Debug)
- iOS Bundle ID
- 웹 사이트 도메인 (배포 도메인)

**동의 항목 설정**: 이메일, 프로필(닉네임/프로필사진) — 카카오 콘솔에서 활성화 필요.

---

### 2.2 Google 로그인

발급처: [Google Cloud Console](https://console.cloud.google.com) → API 및 서비스 → 사용자 인증 정보

| 항목 | 용도 | 비고 |
|---|---|---|
| OAuth 2.0 Client ID (Android) | Android 앱 | SHA-1 인증서 지문 등록 필요 |
| OAuth 2.0 Client ID (iOS) | iOS 앱 | Bundle ID 등록 필요 |
| OAuth 2.0 Client ID (Web) | 서버 ID 토큰 검증 | 서버측 검증 시 audience로 사용 |

**플랫폼 등록 정보 (고객사 → 개발사 전달 필요):**
- Android: 패키지명 + SHA-1 지문 (Release/Debug 각각)
- iOS: Bundle ID
- OAuth 동의 화면: 앱 이름, 로고, 지원 이메일, 개인정보처리방침 URL

---

### 2.3 Apple 로그인 (Sign in with Apple)

**전제 조건**: Apple Developer Program 멤버십 ($99/년) 필요.

발급처: [Apple Developer](https://developer.apple.com) → Certificates, Identifiers & Profiles

| 항목 | 용도 | 비고 |
|---|---|---|
| Team ID | 개발자 팀 식별자 | Apple Developer 계정 정보 |
| Bundle ID (App ID) | iOS 앱 식별자 | Sign in with Apple 활성화 필요 |
| Service ID (Identifier) | Android/Web에서 Apple 로그인 | iOS 외 플랫폼용 |
| Key ID + Private Key (.p8) | 서버 토큰 검증/생성 | 한 번 다운로드 후 재발급 불가 — 분실 주의 |

**App Store 정책**: 다른 소셜 로그인(Kakao/Google)을 제공하는 iOS 앱은 Apple 로그인도 **의무 제공**. iOS 출시 안 할 경우엔 Apple 로그인 자체 불필요.

---

## 3. 고객사 확인 필요 사항

### 3.1 iOS 출시 여부 ⚠️

- **iOS 출시 O**: Apple Developer Program 가입 + Apple 로그인 KEY 전체 발급 필요
- **iOS 출시 X (Android만)**: Apple 로그인 제외 가능 → Kakao/Google 2개로 축소

### 3.2 카카오 비즈니스 채널 보유 여부

- 로그인 자체엔 불필요하나, **항목 2번(알리고 카카오 알림톡)과 직결**되므로 같이 확인.
- 보유 시 채널 ID 전달 필요 / 미보유 시 카카오 비즈니스 채널 신규 개설 절차 필요.

---

## 4. 진행 체크리스트

- [ ] iOS 출시 여부 확정 → Apple 로그인 포함/제외 결정
- [ ] Kakao Developers 앱 등록 + 4종 키 발급
- [ ] Google Cloud Console OAuth Client ID 3종 발급 (Android/iOS/Web)
- [ ] (iOS 출시 시) Apple Developer Program 가입 + Service ID/Key ID/.p8 발급
- [ ] 개발사에 Bundle ID·패키지명·SHA-1 지문 요청 → 콘솔 등록
- [ ] 카카오 비즈니스 채널 보유 여부 확인 (2번 항목 사전 점검)

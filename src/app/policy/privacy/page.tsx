import { PolicyPage } from "../PolicyPage";

export default function PrivacyPage() {
  return <PolicyPage title="개인정보처리방침" sections={[
    { title: "수집 항목", body: "회원 유형, 이름, 이메일, 휴대전화번호와 서비스 이용 기록을 수집할 수 있습니다. 실제 수집 항목은 회원가입 및 입력 화면과 일치해야 합니다." },
    { title: "이용 목적", body: "회원 식별, 매물 및 공고 관리, 문의 응대, 결제 처리와 서비스 품질 개선을 위해 이용합니다." },
    { title: "보유 기간", body: "관련 법령에 따른 보존 기간 또는 회원 탈퇴 시까지 보유하며 목적 달성 후 안전한 방법으로 파기합니다." },
    { title: "이용자의 권리", body: "이용자는 개인정보 열람·정정·삭제·처리 정지를 요청할 수 있습니다. 실제 접수 채널은 출시 전 확정합니다." },
  ]} />;
}

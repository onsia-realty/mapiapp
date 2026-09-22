import { PolicyPage } from "../PolicyPage";

export default function BusinessPage() {
  return <PolicyPage title="사업자정보" sections={[
    { title: "사업자", body: "상호: 주식회사 온시아\n대표자: 데모 표기\n사업자등록번호: 출시 전 실제 정보 입력" },
    { title: "사업장", body: "주소: 출시 전 실제 사업장 주소 입력\n통신판매업 신고번호: 출시 전 확인 후 입력" },
    { title: "고객센터", body: "운영시간: 평일 09:00–18:00\n대표 전화 및 이메일: 출시 전 실제 상담 채널 입력" },
    { title: "서비스 안내", body: "마피는 부동산 및 구인구직 정보 제공 플랫폼이며 실제 거래 계약의 당사자가 아닙니다." },
  ]} />;
}

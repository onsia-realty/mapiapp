import { PolicyPage } from "../PolicyPage";

export default function RefundPage() {
  return <PolicyPage title="환불정책" sections={[
    { title: "환불 신청", body: "유료 상품 결제 후 사용하지 않은 경우 고객센터를 통해 환불을 요청할 수 있습니다." },
    { title: "이용 상품", body: "광고 노출이나 부스터가 시작된 상품은 이용 기간과 제공된 서비스를 기준으로 환불 금액을 산정할 수 있습니다." },
    { title: "처리 기간", body: "환불 승인 후 결제 수단에 따라 영업일 기준 3~7일이 소요될 수 있습니다." },
    { title: "데모 결제", body: "1차 데모에서는 실제 결제가 발생하지 않으므로 환불 처리도 실행되지 않습니다." },
  ]} />;
}

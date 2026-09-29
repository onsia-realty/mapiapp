export function BrokerageInfo({ phone }: { phone: string }) {
  return <section className="my-5 rounded-2xl border border-[#E7DFCF] bg-[#FFFBF2] p-4"><h2 className="text-sm font-bold">중개보수 안내</h2><p className="mt-3 text-sm font-bold">중개사 확인 후 협의</p><p className="mt-2 text-xs leading-6 text-[#756D7E]">계약 전 중개사에게 적용 요율, 보수 금액, 부가세 포함 여부를 확인해주세요. 현재 매물에는 확정된 중개보수 정보가 등록되지 않았습니다.</p>{phone.trim() && <a href={`tel:${phone.trim()}`} className="mt-3 inline-block text-xs font-bold text-[#7952D8] underline">중개보수 문의하기</a>}</section>;
}

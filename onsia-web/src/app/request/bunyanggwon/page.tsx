"use client";

import { RequestForm } from "@/components/request/RequestForm";

export default function BunyangRequestPage() {
  return (
    <RequestForm
      title="분양권 의뢰"
      dateLabel="준공예정일"
      optionLabel="분양가 옵션"
      options={["마이너스P", "원 분양가"]}
    />
  );
}

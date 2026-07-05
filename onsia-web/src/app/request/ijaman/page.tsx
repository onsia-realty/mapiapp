"use client";

import { RequestForm } from "@/components/request/RequestForm";

export default function IjamanRequestPage() {
  return (
    <RequestForm
      title="이자만 의뢰"
      dateLabel="입주예정일"
      optionLabel="이자만 옵션"
      options={["렌트프리", "월세 할인", "인테리어비용 지원"]}
    />
  );
}

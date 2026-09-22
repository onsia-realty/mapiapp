#!/usr/bin/env node
/**
 * 한국산업단지공단_전국지식산업센터현황 CSV → JSON 변환 스크립트
 * 분양형태 ∈ {분양, 분양/임대} 만 필터링
 *
 * 사용: node scripts/convert-knowledge-centers.mjs <CSV경로>
 * 출력: src/data/knowledge-centers.json
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("사용법: node convert-knowledge-centers.mjs <CSV경로>");
  process.exit(1);
}

const outputPath = path.join(ROOT, "src/data/knowledge-centers.json");

// CP949 → UTF-8 (Node 기본 디코더로 처리)
const buffer = fs.readFileSync(inputPath);
let text;
try {
  text = new TextDecoder("euc-kr").decode(buffer);
} catch {
  text = buffer.toString("utf8");
}

/**
 * RFC 4180 호환 CSV 파서 (따옴표 안 쉼표 처리)
 */
function parseCSV(input) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(field);
        field = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && input[i + 1] === "\n") i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += ch;
      }
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const allRows = parseCSV(text);
const header = allRows[0].map((h) => h.trim());
const dataRows = allRows.slice(1).filter((r) => r.length === header.length);

// 컬럼 인덱스 추출
const idx = (name) => header.indexOf(name);
const COL = {
  sido: idx("시도"),
  sigungu: idx("시군구"),
  centerName: idx("지식산업센터명"),
  position: idx("입지구분"),
  company: idx("회사명"),
  registration: idx("등록구분"),
  complexName: idx("단지명"),
  jurisdiction: idx("관할기관"),
  complexType: idx("산단구분"),
  status: idx("상태"),
  landUse: idx("지목"),
  landArea: idx("용지면적(제곱미터)"),
  buildingArea: idx("건축면적(제곱미터)"),
  manufactureArea: idx("제조면적(제곱미터)"),
  ancillaryArea: idx("부대면적(제곱미터)"),
  roadAddress: idx("공장대표주소(도로명)"),
  jibunAddress: idx("공장대표주소(지번)"),
  saleType: idx("분양형태"),
  buildStatus: idx("건축상태"),
  zoning1: idx("용도지역1"),
  zoning2: idx("용도지역2"),
  installer: idx("설치자"),
};

// 누락 컬럼 검증
const missing = Object.entries(COL).filter(([, v]) => v === -1);
if (missing.length > 0) {
  console.error("❌ 누락된 컬럼:", missing.map((m) => m[0]).join(", "));
  process.exit(1);
}

const trimNum = (v) => {
  const n = parseFloat(String(v ?? "").replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const t = (v) => String(v ?? "").trim();

// 분양형태 = 분양 또는 분양/임대 만 필터
const SALE_TYPES = new Set(["분양", "분양/임대"]);
const filtered = dataRows.filter((r) => SALE_TYPES.has(t(r[COL.saleType])));

const records = filtered.map((r, i) => ({
  id: `KIC-${String(i + 1).padStart(5, "0")}`,
  sido: t(r[COL.sido]),
  sigungu: t(r[COL.sigungu]),
  centerName: t(r[COL.centerName]),
  position: t(r[COL.position]),
  company: t(r[COL.company]),
  registration: t(r[COL.registration]),
  complexName: t(r[COL.complexName]),
  jurisdiction: t(r[COL.jurisdiction]),
  complexType: t(r[COL.complexType]),
  status: t(r[COL.status]),
  landUse: t(r[COL.landUse]),
  landArea: trimNum(r[COL.landArea]),
  buildingArea: trimNum(r[COL.buildingArea]),
  manufactureArea: trimNum(r[COL.manufactureArea]),
  ancillaryArea: trimNum(r[COL.ancillaryArea]),
  roadAddress: t(r[COL.roadAddress]),
  jibunAddress: t(r[COL.jibunAddress]),
  saleType: t(r[COL.saleType]),
  buildStatus: t(r[COL.buildStatus]),
  zoning1: t(r[COL.zoning1]),
  zoning2: t(r[COL.zoning2]),
  installer: t(r[COL.installer]),
}));

// 통계
const byBuildStatus = {};
const bySaleType = {};
const bySido = {};
records.forEach((r) => {
  byBuildStatus[r.buildStatus] = (byBuildStatus[r.buildStatus] || 0) + 1;
  bySaleType[r.saleType] = (bySaleType[r.saleType] || 0) + 1;
  bySido[r.sido] = (bySido[r.sido] || 0) + 1;
});

// 출력 폴더 보장
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const output = {
  meta: {
    source: "한국산업단지공단_전국지식산업센터현황",
    sourceUrl: "https://www.data.go.kr/data/15117154/fileData.do",
    referenceDate: "2025-06-30",
    generatedAt: new Date().toISOString(),
    totalRowsInCsv: dataRows.length,
    filteredCount: records.length,
    filterCondition: "분양형태 ∈ {분양, 분양/임대}",
  },
  stats: {
    bySaleType,
    byBuildStatus,
    bySido,
  },
  centers: records,
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");

console.log(`✅ 변환 완료: ${records.length}건 / 전체 ${dataRows.length}건`);
console.log(`📁 저장 위치: ${outputPath}`);
console.log("\n📊 분양형태:", bySaleType);
console.log("📊 건축상태:", byBuildStatus);
console.log("📊 시도별 (상위):");
Object.entries(bySido)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([k, v]) => console.log(`   ${k}: ${v}`));

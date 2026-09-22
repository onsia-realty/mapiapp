/**
 * 국토교통부 실거래가 API 라우트
 *
 * GET /api/real-transaction
 *   Query params:
 *   - lawdCd: 지역코드 (5자리, 필수)
 *   - dealYmd: 계약년월 (6자리 YYYYMM, 필수)
 *   - type: 조회 유형 (trade, rent, presale, all) - 기본값: all
 *   - aptName: 아파트명 필터 (선택)
 *
 * 예시:
 *   /api/real-transaction?lawdCd=11680&dealYmd=202512&type=all
 *   /api/real-transaction?lawdCd=41461&dealYmd=202512&type=presale&aptName=경남아너스빌
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchAptTrades, fetchAptRents, fetchAptPresales, PresaleTransaction } from '@/lib/api/real-transaction';
import { TradeTransaction, RentTransaction } from '@/types/real-transaction';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const lawdCd = searchParams.get('lawdCd');
    const dealYmd = searchParams.get('dealYmd');
    const type = searchParams.get('type') || 'all';
    const aptName = searchParams.get('aptName') || '';

    // 필수 파라미터 체크
    if (!lawdCd || !dealYmd) {
      return NextResponse.json(
        { error: 'lawdCd와 dealYmd는 필수 파라미터입니다.' },
        { status: 400 }
      );
    }

    // 파라미터 형식 검증
    if (!/^\d{5}$/.test(lawdCd)) {
      return NextResponse.json(
        { error: 'lawdCd는 5자리 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(dealYmd)) {
      return NextResponse.json(
        { error: 'dealYmd는 6자리 숫자(YYYYMM)여야 합니다.' },
        { status: 400 }
      );
    }

    let trades: TradeTransaction[] = [];
    let rents: RentTransaction[] = [];
    let presales: PresaleTransaction[] = [];

    // 타입에 따라 API 호출
    if (type === 'trade' || type === 'all') {
      trades = await fetchAptTrades({ lawdCd, dealYmd });
    }

    if (type === 'rent' || type === 'all') {
      rents = await fetchAptRents({ lawdCd, dealYmd });
    }

    if (type === 'presale' || type === 'all') {
      presales = await fetchAptPresales({ lawdCd, dealYmd });
    }

    // 아파트명 필터링
    if (aptName) {
      trades = trades.filter(
        t => t.aptName.includes(aptName) || aptName.includes(t.aptName)
      );
      rents = rents.filter(
        r => r.aptName.includes(aptName) || aptName.includes(r.aptName)
      );
      presales = presales.filter(
        p => p.aptName.includes(aptName) || aptName.includes(p.aptName)
      );
    }

    // 날짜 내림차순 정렬
    trades.sort((a, b) => b.contractDate.localeCompare(a.contractDate));
    rents.sort((a, b) => b.contractDate.localeCompare(a.contractDate));
    presales.sort((a, b) => b.contractDate.localeCompare(a.contractDate));

    // 전세/월세 분리
    const jeonse = rents.filter(r => r.type === 'jeonse');
    const monthly = rents.filter(r => r.type === 'monthly');

    return NextResponse.json({
      success: true,
      params: { lawdCd, dealYmd, type, aptName },
      data: {
        trades,
        rents,
        jeonse,
        monthly,
        presales,
      },
      count: {
        trades: trades.length,
        jeonse: jeonse.length,
        monthly: monthly.length,
        presales: presales.length,
        total: trades.length + rents.length + presales.length,
      },
    });
  } catch (error) {
    console.error('[API] /api/real-transaction 오류:', error);

    return NextResponse.json(
      {
        error: '실거래가 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

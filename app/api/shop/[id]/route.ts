import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const shopId = params.id;

  try {
    // 1. 매장 정보 조회
    const { data: shop, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .maybeSingle(); // 결과가 없으면 null 반환 (에러 아님)

    if (error) throw error;
    if (!shop) {
      return NextResponse.json({ error: '매장을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 2. [선택] 스캔 로그 저장 (속도 저하 방지를 위해 await 없이 실행)
    supabase.from('logs').insert({ shop_id: shopId, action_type: 'SCAN' }).then();

    return NextResponse.json({ shop });

  } catch (err) {
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 });
  }
}
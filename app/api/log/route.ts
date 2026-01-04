import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shopId, type } = body; // type: 'SCAN' | 'COPY' | 'BANNER'

    if (!shopId) return NextResponse.json({ error: 'Shop ID required' }, { status: 400 });

    // Supabase 'logs' 테이블에 저장
    const { error } = await supabase
      .from('logs')
      .insert({
        shop_id: shopId,
        action_type: type,
      });

    if (error) {
      console.error('Log Error:', error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
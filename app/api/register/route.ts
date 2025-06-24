
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      userId,
      name,
      phone,
      referrer,
      address,
      lat,
      lng,
      storeImage,
      idCardImage,
    } = body;

    const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbyN4kzwkpMGYy_j1snkgy3BEB7CjIL4gLJ0iFt6hu4/dev';

    const res = await fetch(googleAppsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        userId,
        name,
        phone,
        referrer,
        address,
        lat,
        lng,
        storeImage,
        idCardImage,
      }),
    });

    const result = await res.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาด ❌' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';

// ⛔️ Next.js App Router ใช้ export แบบนี้เพื่อปิด bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    // 👇 แปลง req.body เป็น readable stream เพื่อใช้กับ formidable
    const form = formidable({ multiples: false });

    const buffer = await req.arrayBuffer();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(buffer));
        controller.close();
      },
    });

    const { fields, files } = await new Promise<any>((resolve, reject) => {
      form.parse((req as any).req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // ⛳️ แปลงรูปภาพเป็น base64
    const storeImageFile = files.storeImage?.[0] || files.storeImage;
    const idCardImageFile = files.idCardImage?.[0] || files.idCardImage;

    const storeImageBase64 = storeImageFile ? fs.readFileSync(storeImageFile.filepath, 'base64') : '';
    const idCardImageBase64 = idCardImageFile ? fs.readFileSync(idCardImageFile.filepath, 'base64') : '';

    // 📤 เตรียมส่งไป Google Apps Script
    const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbyN4kzwkpMGYy_j1snkgy3BEB7CjIL4gLJ0iFt6hu4/dev/exec';

    const res = await fetch(googleAppsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        userId: fields.userId || '',
        name: fields.name || '',
        phone: fields.phone || '',
        referrer: fields.referrer || '',
        address: fields.address || '',
        lat: fields.lat || '',
        lng: fields.lng || '',
        storeImage: storeImageBase64,
        idCardImage: idCardImageBase64,
      }),
    });

    const result = await res.json();
    return NextResponse.json(result);
  } catch (err) {
    console.error('Error in /api/register:', err);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดที่ server proxy' },
      { status: 500 }
    );
  }
}

// 🧩 Helper: Convert ReadableStream to Node.js Readable for formidable
import { Readable } from 'stream';
function StreamToNodeReadable(stream: ReadableStream<Uint8Array>): Readable {
  const reader = stream.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) this.push(null);
      else this.push(value);
    },
  });
}
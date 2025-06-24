import type { NextApiRequest, NextApiResponse } from 'next';

const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbyN4kzwkpMGYy_j1snkgy3BEB7CjIL4gLJ0iFt6hu4/dev';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ตั้งค่า CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // จัดการ OPTIONS (Preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { username, password } = req.body;

    const response = await fetch(googleAppsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'login',
        username,
        password,
      }),
    });

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Login proxy error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดที่ server proxy',
      error: error.message || error.toString(),
    });
  }
}
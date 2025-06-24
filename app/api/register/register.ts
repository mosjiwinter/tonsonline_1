import type { NextApiRequest, NextApiResponse } from 'next';

// pages/api/register.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const formData = req.body;

    const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbyN4kzwkpMGYy_j1snkgy3BEB7CjIL4gLJ0iFt6hu4/dev/exec';

    const response = await fetch(googleAppsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'register',
        ...formData,
      }),
    });

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดที่ server proxy' });
  }
}
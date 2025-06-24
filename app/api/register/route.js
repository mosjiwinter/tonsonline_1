// pages/api/register.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const formData = req.body;

    const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbyW36T8ScV4o92bHSb_RslFJWxDlDnWiUOags0UgbgwSvmMocN06hCHPWTsj07Zp9jA/exec';

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
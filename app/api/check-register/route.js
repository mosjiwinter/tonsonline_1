import fetch from 'node-fetch';
export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  const url = `https://script.google.com/macros/s/AKfycbyW36T8ScV4o92bHSb_RslFJWxDlDnWiUOags0UgbgwSvmMocN06hCHPWTsj07Zp9jA/exec?userId=${userId}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from Google Apps Script' });
  }
}

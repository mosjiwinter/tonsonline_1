import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid userId' });
  }

  const url = `https://script.google.com/macros/s/AKfycbyN4kzwkpMGYy_j1snkgy3BEB7CjIL4gLJ0iFt6hu4/dev?userId=${encodeURIComponent(userId)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Apps Script responded with status ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from Google Apps Script' });
  }
}

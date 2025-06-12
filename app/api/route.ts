export async function POST(req: Request) {
  const body = await req.json();
  console.log('Received data:', body);

  // ส่งเข้า Google Sheets (ใช้ fetch ไปหา Google Apps Script Web App)
  await fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return new Response('OK');
}
'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';
import QRCode from 'qrcode';

export default function StaffPage() {
  const [profile, setProfile] = useState<any>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      await liff.init({ liffId: '2007552712-Ml60zkVe' });
      if (!liff.isLoggedIn()) liff.login();

      const p = await liff.getProfile();
      setProfile(p);

      // สร้าง URL สำหรับลูกค้า
      const registerUrl = `https://liff.line.me/2007552712-Ml60zkVe/register?ref=${p.userId}`;
      const qr = await QRCode.toDataURL(registerUrl);
      setQrImage(qr);
    };
    init();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>หน้าพนักงาน</h2>
      {profile && (
        <>
          <p><strong>ชื่อ:</strong> {profile.displayName}</p>
          <p><strong>LINE ID:</strong> {profile.userId}</p>
          <p style={{ marginTop: '16px' }}>📲 ให้ลูกค้าสแกน QR นี้:</p>
          {qrImage && <img src={qrImage} alt="qr" style={{ width: '200px', marginTop: '10px' }} />}
        </>
      )}
    </div>
  );
}

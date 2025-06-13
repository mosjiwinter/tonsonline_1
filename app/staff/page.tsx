'use client';

import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import liff from '@line/liff';
import QRCode from 'qrcode';

export default function StaffPage() {
  const [profile, setProfile] = useState<any>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await liff.init({ liffId: '2007552712-Ml60zkVe' });
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const p = await liff.getProfile();
        // เช็คว่าเป็น staff หรือไม่ (ตัวอย่างเช็คจาก userId)
        if (!isStaff(p.userId)) {
          notFound(); // จะ redirect ไปหน้า 404
          return;
        }

        setProfile(p);

        // สร้าง URL สำหรับลูกค้า
        const registerUrl = `https://liff.line.me/2007552712-Ml60zkVe/register?ref=${p.userId}`;
        const qr = await QRCode.toDataURL(registerUrl);
        setQrImage(qr);
      } catch (err) {
        console.error('Error:', err);
        notFound();
      }
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

// ฟังก์ชันเช็คว่าเป็น staff
function isStaff(userId: string) {
  // ตัวอย่าง: เช็คจาก userId ที่อนุญาต
  const allowedStaffIds = [
    'U1234567890abcdef', // แทนที่ด้วย userId ของ staff จริงๆ
    // เพิ่ม userId อื่นๆ ที่อนุญาต
  ];
  return allowedStaffIds.includes(userId);
}

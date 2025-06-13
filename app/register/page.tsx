'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [storeImage, setStoreImage] = useState<File | null>(null);
  const [idCardImage, setIdCardImage] = useState<File | null>(null);
  const [storeImagePreview, setStoreImagePreview] = useState<string | null>(null);
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [referrer, setReferrer] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get referrer from URL (e.g., ?ref=Uxxxxxxxxxxxx)
    const searchParams = new URLSearchParams(window.location.search);
    const ref = searchParams.get('ref');
    if (ref) setReferrer(ref);

    // Init LIFF
    liff.init({ liffId: '2007552712-Ml60zkVe' }).then(() => {
      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        liff.getProfile().then(profile => {
          setUserId(profile.userId);
        });
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('⏳ กำลังส่งข้อมูล...');

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('referrer', referrer || '');
    formData.append('name', name);
    formData.append('address', address);
    formData.append('lat', latLng?.lat.toString() || '');
    formData.append('lng', latLng?.lng.toString() || '');
    if (storeImage) formData.append('storeImage', storeImage);
    if (idCardImage) formData.append('idCardImage', idCardImage);

    try {
      const res = await fetch('YOUR_GOOGLE_APPS_SCRIPT_ENDPOINT', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      setMessage(result.message || '✅ บันทึกข้อมูลเรียบร้อยแล้ว');
    } catch (err) {
      setMessage('❌ เกิดข้อผิดพลาดในการส่งข้อมูล');
    }
  };

  const handleMapClick = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setLatLng({ lat, lng });
    });
  };

  const handleStoreImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStoreImage(file);
      setStoreImagePreview(URL.createObjectURL(file));
    }
  };

  const handleIdCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdCardImage(file);
      setIdCardPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>📋 ลงทะเบียนร้านค้า</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          placeholder="🛍️ ชื่อร้านค้า"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="📦 ที่อยู่จัดส่ง"
          value={address}
          onChange={e => setAddress(e.target.value)}
          rows={3}
          required
        />
        <button type="button" onClick={handleMapClick}>📍 ใช้ตำแหน่งร้าน (ปักหมุด)</button>
        {latLng && (
          <p style={{ margin: 0, fontSize: '14px' }}>
            ✅ ตำแหน่งร้าน: {latLng.lat}, {latLng.lng}
          </p>
        )}
        <div>
          <p>🖼️ รูปหน้าร้าน:</p>
          <input type="file" accept="image/*" onChange={handleStoreImageChange} required />
          {storeImagePreview && <img src={storeImagePreview} alt="store" width={150} />}
        </div>
        <div>
          <p>🪪 รูปบัตรประชาชน:</p>
          <input type="file" accept="image/*" onChange={handleIdCardChange} required />
          {idCardPreview && <img src={idCardPreview} alt="idcard" width={150} />}
        </div>
        <button type="submit" style={{ backgroundColor: '#00b900', color: '#fff', padding: 10, border: 'none', borderRadius: 5 }}>
          ✅ ส่งข้อมูลลงทะเบียน
        </button>
      </form>
      <p style={{ marginTop: 20 }}>{message}</p>
    </div>
  );
}

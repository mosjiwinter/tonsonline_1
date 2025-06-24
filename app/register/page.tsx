'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  TextField,
  Stack,
  Typography,
  Button,
  styled,
  Snackbar,
  Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';

const Map = dynamic(() => import('./LeafletMap'), { ssr: false });

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function RegisterPage() {
  const [referrer, setReferrer] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [storeImage, setStoreImage] = useState<File | null>(null);
  const [idCardImage, setIdCardImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const ref = new URL(window.location.href).searchParams.get('ref') || '';
    setReferrer(ref);

    navigator.geolocation.getCurrentPosition(
      (pos) => setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => showSnackbar('ไม่สามารถดึงพิกัดได้ กรุณาอนุญาต GPS หรือระบุตำแหน่งเอง', 'error')
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeName || !address || !latLng || !storeImage || !idCardImage || !phoneNumber) {
      showSnackbar('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
      return;
    }

    setLoading(true);
    setMessage('กำลังส่งข้อมูล...');

    const formData = new FormData();
    formData.append('userId', ''); // ไม่มี LIFF แล้ว ใส่ userId ว่างหรือจาก query ได้
    formData.append('name', storeName);
    formData.append('phone', phoneNumber);
    formData.append('referrer', referrer);
    formData.append('address', address);
    formData.append('lat', latLng.lat.toString());
    formData.append('lng', latLng.lng.toString());
    formData.append('storeImage', storeImage);
    formData.append('idCardImage', idCardImage);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      showSnackbar(result.message || 'ส่งข้อมูลสำเร็จ ✅', 'success');
      setTimeout(() => window.location.href = '/cms', 1500);
    } catch (err) {
      console.error(err);
      showSnackbar('เกิดข้อผิดพลาดในการส่งข้อมูล ❌', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <Typography variant="h5" gutterBottom>ลงทะเบียนร้านค้า</Typography>

      <Typography sx={{ mt: 2 }}><strong>รหัสผู้แนะนำ:</strong> {referrer}</Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2} mt={2}>
          <TextField label="ชื่อร้านค้า" value={storeName} onChange={(e) => setStoreName(e.target.value)} required fullWidth />
          <TextField label="ที่อยู่จัดส่ง" value={address} onChange={(e) => setAddress(e.target.value)} required fullWidth />
          <TextField label="เบอร์โทร" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required fullWidth />

          <Button variant="contained" onClick={() => {
            navigator.geolocation.getCurrentPosition(
              (pos) => setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
              () => showSnackbar('ไม่สามารถดึงพิกัดได้', 'error')
            );
          }}>
            📍 ใช้ GPS ปัจจุบัน
          </Button>

          <Map latLng={latLng} setLatLng={setLatLng} />
          {latLng && <Typography>📌 ตำแหน่ง: {latLng.lat}, {latLng.lng}</Typography>}

          <Stack spacing={1}>
            <Typography>อัปโหลดรูปหน้าร้าน</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                เลือกรูปหน้าร้าน
                <VisuallyHiddenInput type="file" accept="image/*" onChange={(e) => setStoreImage(e.target.files?.[0] || null)} />
              </Button>
              <Typography variant="body2">{storeImage ? storeImage.name : 'ยังไม่ได้เลือกรูป'}</Typography>
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Typography>อัปโหลดรูปบัตรประชาชน</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                เลือกรูปบัตร ปชช.
                <VisuallyHiddenInput type="file" accept="image/*" onChange={(e) => setIdCardImage(e.target.files?.[0] || null)} />
              </Button>
              <Typography variant="body2">{idCardImage ? idCardImage.name : 'ยังไม่ได้เลือกรูป'}</Typography>
            </Stack>
          </Stack>

          <Button
            type="submit"
            variant="contained"
            color="success"
            startIcon={<SaveIcon />}
            fullWidth
            disabled={loading}
          >
            {loading ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูล'}
          </Button>

          {message && <Typography color="primary">{message}</Typography>}
        </Stack>
      </form>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';
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

interface ProfilePlus {
  phoneNumber?: string;
}

export default function RegisterPage() {
  const [profile, setProfile] = useState<any>(null);
  const [referrer, setReferrer] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [storeImage, setStoreImage] = useState<File | null>(null);
  const [idCardImage, setIdCardImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Snackbar
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
    const init = async () => {
      await liff.init({ liffId: '2007552712-Ml60zkVe' });

      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: window.location.href });
        return;
      }

      const p = await liff.getProfile();
      const ref = new URL(window.location.href).searchParams.get('ref') || '';

      try {
        const res = await fetch(`/api/check-register/check_route_register.js?userId=${p.userId}`);
        const result = await res.json();

        if (result.registered) {
          setMessage('คุณได้ลงทะเบียนแล้ว');
          window.location.href = '/cms';
          return;
        } else {
          // ✅ เคลียร์และเตรียมฟอร์ม
          setMessage('กำลังเตรียมฟอร์ม...');
          setLoading(true);
          setReferrer(ref);
          setStoreName(p.displayName || '');
          setAddress('');
          setLatLng(null);
          setStoreImage(null);
          setIdCardImage(null);
          setPhoneNumber('');
          setProfile(p);
          // ✅ ดึงเบอร์
          try {
            const plus = await liff.getProfilePlus() as ProfilePlus;
            if (plus?.phoneNumber) {
              setPhoneNumber(plus.phoneNumber);
              showSnackbar('ดึงเบอร์โทรจาก LINE สำเร็จ ✅', 'success');
            } else {
              showSnackbar('ไม่พบเบอร์โทร กรุณากรอกเอง', 'info');
            }
          } catch (err) {
            console.error(err);
            showSnackbar('ไม่สามารถดึงเบอร์ได้ กรุณากรอกเอง', 'error');
          }

          // ✅ ดึงพิกัด GPS
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            (err) => {
              console.error(err);
              showSnackbar('ไม่สามารถดึงพิกัดได้ กรุณาอนุญาต GPS หรือระบุตำแหน่งเอง', 'error');
            }
          );

          setMessage('กรุณากรอกข้อมูลร้านค้า');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error checking registration:', err);
        showSnackbar('เกิดข้อผิดพลาดในการโหลดข้อมูลลงทะเบียน', 'error');
      }
    };

    init();
  }, []);

  // 1. อ่านไฟล์เป็น base64
  function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1]); // ตัด prefix "data:image/png;base64,"
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeName || !address || !latLng || !storeImage || !idCardImage || !phoneNumber) {
      showSnackbar('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
      return;
    }

    setLoading(true);
    setMessage('กำลังส่งข้อมูล...');

    const formData = new FormData();
    formData.append('userId', profile?.userId || '');
    formData.append('name', storeName);
    formData.append('phone', phoneNumber);
    formData.append('referrer', referrer);
    formData.append('address', address);
    if (latLng) {
      formData.append('lat', latLng.lat.toString());
      formData.append('lng', latLng.lng.toString());
    }
    if (storeImage) formData.append('storeImage', storeImage);
    if (idCardImage) formData.append('idCardImage', idCardImage);

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
      <Typography variant="h5" gutterBottom>
        ลงทะเบียนร้านค้า
      </Typography>

      {profile && (
        <Stack spacing={1}>
          <Typography><strong>LINE Name:</strong> {profile.displayName}</Typography>
          <Typography><strong>LINE ID:</strong> {profile.userId}</Typography>
        </Stack>
      )}

      <Typography sx={{ mt: 2 }}><strong>รหัสผู้แนะนำ:</strong> {referrer}</Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2} mt={2}>
          <TextField
            label="ชื่อร้านค้า"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="ที่อยู่จัดส่ง"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            fullWidth
          />
          <Stack direction="row" spacing={1}>
            <TextField
              label="เบอร์โทร"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              fullWidth
              helperText="หากไม่มีเบอร์จาก LINE ให้กรอกเอง"
            />
            <Button variant="outlined" onClick={() => {
              (async () => {
                try {
                  const res: any = await liff.getProfilePlus();
                  if (res?.phoneNumber) {
                    setPhoneNumber(res.phoneNumber);
                    showSnackbar('ดึงเบอร์โทรสำเร็จ ✅', 'success');
                  } else {
                    showSnackbar('ไม่พบเบอร์ กรุณากรอกเอง', 'info');
                  }
                } catch {
                  showSnackbar('เกิดข้อผิดพลาดในการดึงเบอร์', 'error');
                }
              })();
            }}>
              📱 ดึงเบอร์
            </Button>
          </Stack>

          <Button variant="contained" onClick={() => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
              },
              (err) => {
                showSnackbar('ไม่สามารถดึงพิกัดได้', 'error');
              }
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
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => setStoreImage(e.target.files?.[0] || null)}
                />
              </Button>
              <Typography variant="body2">
                {storeImage ? storeImage.name : 'ยังไม่ได้เลือกรูป'}
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Typography>อัปโหลดรูปบัตรประชาชน</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                เลือกรูปบัตร ปชช.
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIdCardImage(e.target.files?.[0] || null)}
                />
              </Button>
              <Typography variant="body2">
                {idCardImage ? idCardImage.name : 'ยังไม่ได้เลือกรูป'}
              </Typography>
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

      {/* Snackbar แจ้งเตือน */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
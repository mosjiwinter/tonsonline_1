'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ เช็ก sessionStorage หากเคย login แล้ว ให้ redirect ทันที
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isStaffLoggedIn');
    if (isLoggedIn === 'true') {
      window.location.href = '/staff';
    }

    // ✅ เรียก LINE LIFF init
    import('@line/liff').then(async (liff) => {
      try {
        await liff.default.init({ liffId: '2007552712-Ml60zkVe' }); // 🔁 ใส่ LIFF ID ของคุณ
        if (!liff.default.isLoggedIn()) {
          liff.default.login();
        } else {
          const profile = await liff.default.getProfile();
          sessionStorage.setItem('lineDisplayName', profile.displayName);
          sessionStorage.setItem('lineUserId', profile.userId);
        }
      } catch (err) {
        console.error('LIFF init error:', err);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const res = await fetch(
        'https://script.google.com/macros/s/AKfycbybbrJYXTslldzWjzjUOqLxXgG3ojB8YUsrRWktgPcUeyd_3aK8i1n5AEZUidMQonDL/exec', // 🔁 ใส่ URL ของ Google Apps Script ที่ใช้ตรวจสอบการ login
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),

        }
      );

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem('isStaffLoggedIn', 'true');
        sessionStorage.setItem('staffUserId', data.userId);    // จาก Google Sheet
        sessionStorage.setItem('staffName', data.name || '');  // จาก Google Sheet
        sessionStorage.setItem('staffRole', data.role || 'staff');
        // หลัง login สำเร็จ:
        if (data.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/staff';
        }
      } else {
        setError(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          เข้าสู่ระบบสำหรับพนักงาน
        </Typography>

        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <TextField
            fullWidth
            label="ชื่อผู้ใช้"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="รหัสผ่าน"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 2, backgroundColor: '#00b900', color: 'white' }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'กำลังเข้าสู่ระบบ' : 'เข้าสู่ระบบ'}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </form>
      </Box>
    </Container>
  );
}
'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import { Button, Typography, Container, Box, TextField } from '@mui/material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function AdminDashboard() {
  const [chartData, setChartData] = useState<{ name: string; count: number }[]>([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const fetchData = () => {
    let url = 'https://script.google.com/macros/s/xxxxxxxxxxx/exec';
    const query: string[] = [];
    if (filterDate) query.push(`date=${filterDate}`);
    if (filterMonth) query.push(`month=${filterMonth}`);
    if (query.length > 0) url += '?' + query.join('&');

    fetch(url)
      .then(res => res.json())
      .then(data => setChartData(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const COLORS = ['#8884d8', '#00bcd4', '#4caf50', '#ff9800', '#e91e63'];

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(chartData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Admin Summary');
    XLSX.writeFile(wb, `Admin-Summary-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.text('Admin Registration Summary', 14, 16);
    doc.autoTable({
      head: [['พนักงาน', 'จำนวน']],
      body: chartData.map(row => [row.name, row.count]),
    });
    doc.save(`admin-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard รวมยอดพนักงาน (Admin)
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <TextField
          label="เลือกวัน (YYYY-MM-DD)"
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="เลือกเดือน (YYYY-MM)"
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={fetchData}>ดึงข้อมูล</Button>
      </Box>

      <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="name"
              outerRadius={100}
              label
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#1976d2' }}
          onClick={handleExportExcel}
        >
          Export เป็น Excel
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={exportPdf}
        >
          Export เป็น PDF
        </Button>
      </Box>
    </Container>
  );
}

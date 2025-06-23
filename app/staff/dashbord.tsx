'use client';

import { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import { Button, Typography, Container, Box } from '@mui/material';
import * as XLSX from 'xlsx';

export default function StaffDashboard() {
    const [chartData, setChartData] = useState<{ name: string; count: number }[]>([]);

    useEffect(() => {
        fetch('https://script.google.com/macros/s/xxxxxxxxxxx/exec') // ✅ เปลี่ยนเป็น GAS URL จริง
            .then(res => res.json())
            .then(data => setChartData(data));
    }, []);

    const COLORS = ['#8884d8', '#00bcd4', '#4caf50', '#ff9800', '#e91e63'];

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(chartData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Staff Summary');
        XLSX.writeFile(wb, `Staff-Summary-${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    const exportPdf = async () => {
        if (!chartData.length) {
            alert('ไม่มีข้อมูลสำหรับ export');
            return;
        }

        const jsPDFModule = await import('jspdf');
        const jsPDF = jsPDFModule.default;
        await import('jspdf-autotable'); // ✅ dynamic import เพื่อแนบ method

        const doc = new jsPDF();
        doc.text('Staff Registration Summary', 14, 16);
        doc.autoTable({
            head: [['พนักงาน', 'จำนวน']],
            body: chartData.map(row => [row.name, row.count.toString()]),
        });
        doc.save(`staff-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                สรุปยอดลงทะเบียนต่อพนักงาน (วันนี้)
            </Typography>

            <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#00b900" />
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
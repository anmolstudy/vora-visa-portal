import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const CHART_COLORS = ['#3F51B5', '#00ACC1', '#7C3AED', '#F59E0B', '#EF4444', '#22C55E', '#0284C7'];

export default function ActivityPanel({ stats, cashFlow }) {
  const countryData = Object.entries(stats?.byCountry || {}).map(([name, value]) => ({ name, value }));
  const statusData  = Object.entries(stats?.byStatus || {})
    .filter(([k]) => k && k !== 'nan')
    .map(([name, value]) => ({ name: name.replace('COURIER TO MS OFFICE', 'Courier MS'), value }));
  const tradeData   = Object.entries(stats?.byTrade || {})
    .slice(0, 6)
    .map(([name, value]) => ({ name: name.length > 18 ? name.slice(0, 16) + '…' : name, value }));

  const cfCards = cashFlow ? [
    { label: 'Total Income',   value: `₹${(cashFlow.totalIn / 100000).toFixed(2)}L`,  color: '#16A34A', bg: '#DCFCE7' },
    { label: 'Total Paid Out', value: `₹${(cashFlow.totalOut / 100000).toFixed(2)}L`, color: '#DC2626', bg: '#FEE2E2' },
    { label: 'Small Expenses', value: `₹${(cashFlow.totalExp / 1000).toFixed(0)}K`,   color: '#B45309', bg: '#FEF3C7' },
    { label: 'Net Balance',    value: `₹${(cashFlow.balance / 100000).toFixed(2)}L`,  color: '#3F51B5', bg: '#EEF0FB' },
  ] : [];

  const cardSx = {
    elevation: 0,
    sx: { borderRadius: 3, border: '1px solid', borderColor: '#F3F4F6',
          transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.08)' } }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

      {/* Cash Flow Mini Cards */}
      {/* {cfCards.length > 0 && (
        <Card {...cardSx}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2} sx={{ fontSize: 14 }}>Cash Flow Summary</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {cfCards.map(c => (
                <Box key={c.label} sx={{
                  p: 1.5, bgcolor: c.bg, borderRadius: 2.5, textAlign: 'center',
                  border: '1px solid ' + c.color + '20',
                }}>
                  <Typography variant="body2" fontWeight={800} sx={{ color: c.color, fontSize: 15 }}>{c.value}</Typography>
                  <Typography variant="caption" sx={{ color: c.color, opacity: 0.75, fontSize: 11 }}>{c.label}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )} */}

      {/* PIE — Country Distribution */}
      <Card {...cardSx}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={1} sx={{ fontSize: 14 }}>Country Distribution</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={countryData} cx="50%" cy="50%" outerRadius={70} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false} fontSize={10}>
                {countryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v + ' candidates', n]}
                contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontFamily: '"Poppins", sans-serif', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* BAR — PP Status */}
      <Card {...cardSx}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={1} sx={{ fontSize: 14 }}>Passport Status</Typography>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={statusData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: '"Poppins", sans-serif' }} />
              <YAxis tick={{ fontSize: 10, fontFamily: '"Poppins", sans-serif' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontFamily: '"Poppins", sans-serif', fontSize: 12 }} />
              <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                {statusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* BAR — Top Trades */}
      {/* <Card {...cardSx}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={1} sx={{ fontSize: 14 }}>Top Job Trades</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tradeData} layout="vertical" margin={{ left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis type="number" tick={{ fontSize: 10, fontFamily: '"Poppins", sans-serif' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fontFamily: '"Poppins", sans-serif' }} width={100} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontFamily: '"Poppins", sans-serif', fontSize: 12 }} />
              <Bar dataKey="value" fill="#3F51B5" radius={[0, 5, 5, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}
    </Box>
  );
}

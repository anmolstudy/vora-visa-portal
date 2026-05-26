import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import BusinessIcon from '@mui/icons-material/Business';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function StatCards({ stats, cashFlow }) {
  const cards = [
    {
      title: 'Total Candidates', value: stats?.total || 0, sub: 'All countries',
      icon: <PeopleIcon />, color: '#3F51B5', bg: '#EEF0FB', accent: 'rgba(63,81,181,0.15)',
    },
    {
      title: 'In Mail (Processing)', value: stats?.inMail || 0, sub: 'Passport sent out',
      icon: <MarkunreadMailboxIcon />, color: '#7C3AED', bg: '#F3EEFF', accent: 'rgba(124,58,237,0.15)',
    },
    {
      title: 'In Office', value: stats?.inOffice || 0, sub: 'Docs at office',
      icon: <BusinessIcon />, color: '#00838F', bg: '#E0F7FA', accent: 'rgba(0,172,193,0.15)',
    },
    {
      title: 'Courier / Sent',
      value: (stats?.byStatus?.COURIER || 0) + (stats?.byStatus?.['COURIER TO MS OFFICE'] || 0),
      sub: 'Dispatched files',
      icon: <LocalShippingIcon />, color: '#B45309', bg: '#FEF3C7', accent: 'rgba(245,158,11,0.15)',
    },
    {
      title: 'Total Cash In',
      value: cashFlow ? `₹${(cashFlow.totalIn / 100000).toFixed(1)}L` : '—',
      sub: 'Revenue received',
      icon: <TrendingUpIcon />, color: '#16A34A', bg: '#DCFCE7', accent: 'rgba(34,197,94,0.15)',
    },
    {
      title: 'Current Balance',
      value: cashFlow ? `₹${(cashFlow.balance / 100000).toFixed(1)}L` : '—',
      sub: 'Available funds',
      icon: <AccountBalanceWalletIcon />, color: '#DC2626', bg: '#FEE2E2', accent: 'rgba(239,68,68,0.15)',
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={card.title}>
          <Card elevation={0} sx={{
            borderRadius: 3, border: '1px solid', borderColor: 'grey.100', height: '100%',
            position: 'relative', overflow: 'hidden',
            '&:hover': { boxShadow: '0 6px 24px rgba(0,0,0,0.10)', transform: 'translateY(-3px)', borderColor: card.color + '40' },
            transition: 'all 0.25s ease',
          }}>
            {/* Accent strip at top */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: card.color, borderRadius: '12px 12px 0 0' }} />
            <CardContent sx={{ pt: 2.5 }}>
              <Box sx={{
                width: 44, height: 44, borderRadius: 2.5, bgcolor: card.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: card.color, mb: 1.5,
                '& svg': { fontSize: 22 },
              }}>
                {card.icon}
              </Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: '#1A1A1A', lineHeight: 1, mb: 0.5 }}>
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
              </Typography>
              <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ fontSize: 13, mb: 0.3 }}>
                {card.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                {card.sub}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

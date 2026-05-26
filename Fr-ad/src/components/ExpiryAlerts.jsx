import { Box, Card, CardContent, Typography, Chip, List, ListItem, ListItemText, ListItemIcon, Divider, Alert } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import PaymentIcon from '@mui/icons-material/Payment';

// Days until a date
function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function ExpiryAlerts({ candidates }) {
  const today = new Date();

  // Passports expiring within 6 months
  const expiring = candidates
    .filter(c => {
      if (!c.ppExp) return false;
      const d = daysUntil(c.ppExp);
      return d !== null && d < 180;
    })
    .sort((a, b) => new Date(a.ppExp) - new Date(b.ppExp))
    .slice(0, 20);

  // Candidates with no payment recorded
  const noPayment = candidates.filter(c => !c.payment).slice(0, 15);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Expiry Alerts */}
      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: expiring.length > 0 ? '#ffcc02' : 'grey.100' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <WarningAmberIcon sx={{ color: '#f57f17' }} />
            <Typography variant="h6" fontWeight={700}>Passport Expiry Alerts</Typography>
            <Chip label={expiring.length} size="small"
              sx={{ bgcolor: expiring.length > 0 ? '#fff8e1' : '#f5f5f5', color: expiring.length > 0 ? '#f57f17' : '#9e9e9e', fontWeight: 700, ml: 'auto' }} />
          </Box>

          {expiring.length === 0 ? (
            <Alert severity="success">No passports expiring in the next 6 months 🎉</Alert>
          ) : (
            <List dense disablePadding>
              {expiring.map((c, i) => {
                const days = daysUntil(c.ppExp);
                const isUrgent = days < 30;
                return (
                  <Box key={c.id || i}>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {isUrgent
                          ? <ErrorIcon sx={{ color: '#c62828', fontSize: 20 }} />
                          : <WarningAmberIcon sx={{ color: '#f57f17', fontSize: 20 }} />}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography fontSize={13} fontWeight={700}>{c.name}</Typography>
                            <Typography fontSize={11} sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>{c.passport}</Typography>
                            <Chip label={c.country} size="small" variant="outlined" sx={{ fontSize: 10, height: 18 }} />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.3 }}>
                            <Typography fontSize={12} color="text.secondary">Expires: {c.ppExp}</Typography>
                            <Chip
                              label={days <= 0 ? 'EXPIRED' : `${days} days left`}
                              size="small"
                              sx={{
                                bgcolor: days <= 0 ? '#c62828' : days < 30 ? '#ffebee' : '#fff8e1',
                                color: days <= 0 ? '#fff' : days < 30 ? '#c62828' : '#f57f17',
                                fontWeight: 700, fontSize: 10
                              }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {i < expiring.length - 1 && <Divider sx={{ borderColor: 'grey.100' }} />}
                  </Box>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Pending Payments */}
      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PaymentIcon sx={{ color: '#3F51B5' }} />
            <Typography variant="h6" fontWeight={700}>Pending Payment Records</Typography>
            <Chip label={noPayment.length} size="small"
              sx={{ bgcolor: '#EEF0FB', color: '#3F51B5', fontWeight: 700, ml: 'auto' }} />
          </Box>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Candidates with no payment recorded:
          </Typography>
          <List dense disablePadding>
            {noPayment.map((c, i) => (
              <Box key={c.id || i}>
                <ListItem disablePadding sx={{ py: 0.8 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PaymentIcon sx={{ color: '#1565c0', fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography fontSize={13} fontWeight={600}>{c.name}</Typography>
                        <Chip label={c.country} size="small" variant="outlined" sx={{ fontSize: 10, height: 18 }} />
                        <Chip label={c.ppStatus} size="small" sx={{ fontSize: 10, height: 18, bgcolor: '#f5f5f5' }} />
                      </Box>
                    }
                    secondary={<Typography fontSize={11} color="text.secondary">Ref: {c.ref || 'Direct'}</Typography>}
                  />
                </ListItem>
                {i < noPayment.length - 1 && <Divider sx={{ borderColor: 'grey.100' }} />}
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}

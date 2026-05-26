import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Grid, Chip, Divider, Button,
  IconButton, Card, CardContent, Stepper, Step,
  StepLabel, Avatar, List, ListItem, ListItemIcon,
  ListItemText, Checkbox, LinearProgress, Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import PassportIcon from '@mui/icons-material/Badge';
import FlightIcon from '@mui/icons-material/Flight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import PaymentIcon from '@mui/icons-material/Payment';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// Visa processing steps
const VISA_STEPS = ['Applied', 'Processing', 'Approved', 'Stamped', 'Flew'];

// Documents checklist template
const DOC_CHECKLIST = [
  'Passport (Original)',
  'Passport Copy',
  'PCC (Police Clearance)',
  'JOL (Job Offer Letter)',
  'Medical Certificate',
  'IELTS / Language Test',
  'Educational Certificates',
  'Bank Statement',
  'Photographs',
  'Visa Application Form',
  'Embassy Fee Paid',
  'Flight Ticket',
];

// Determine visa step index from status
function getVisaStep(visa, ppStatus) {
  if (ppStatus === 'FLEW' || visa === 'FLEW') return 4;
  if (visa === 'STAMPED') return 3;
  if (visa === 'OK' || visa === 'APPROVED') return 2;
  if (ppStatus === 'IN MAIL' || ppStatus === 'COURIER') return 1;
  return 0;
}

// Check if passport is expiring within 6 months
function isExpiringSoon(ppExp) {
  if (!ppExp) return false;
  const exp = new Date(ppExp);
  const sixMonths = new Date();
  sixMonths.setMonth(sixMonths.getMonth() + 6);
  return exp < sixMonths;
}

export default function CandidateProfile({ open, onClose, candidate, onEdit, checkedDocs, onDocToggle }) {
  if (!candidate) return null;

  const visaStep   = getVisaStep(candidate.visa, candidate.ppStatus);
  const expiringSoon = isExpiringSoon(candidate.ppExp);
  const checked    = checkedDocs || [];
  const docProgress = Math.round((checked.length / DOC_CHECKLIST.length) * 100);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}>

      {/* Header */}
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ background: 'linear-gradient(135deg, #1a237e 0%, #3F51B5 100%)', p: 3, color: '#fff', borderRadius: '12px 12px 0 0' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#4fc3f7', width: 56, height: 56, fontSize: 22, fontWeight: 800, color: '#0f2557' }}>
                {candidate.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={800} sx={{ color: '#fff' }}>{candidate.name}</Typography>
                <Typography variant="body2" sx={{ color: '#C5CAE9', fontFamily: 'monospace' }}>
                  {candidate.passport}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                  <Chip label={candidate.country} size="small" sx={{ bgcolor: '#4DD0E1', color: '#1a237e', fontWeight: 700, fontSize: 11 }} />
                  <Chip label={candidate.ppStatus} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 11 }} />
                  {expiringSoon && (
                    <Chip icon={<WarningAmberIcon sx={{ fontSize: 13 }} />} label="PP Expiring Soon!" size="small"
                      sx={{ bgcolor: '#ff6f00', color: '#fff', fontWeight: 700, fontSize: 11 }} />
                  )}
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Edit Candidate">
                <IconButton onClick={onEdit} sx={{ color: '#90caf9', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <IconButton onClick={onClose} sx={{ color: '#90caf9', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>

          {/* ── LEFT COLUMN ── */}
          <Grid item xs={12} md={6}>

            {/* Basic Info */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'grey.100', borderRadius: 2, mb: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} mb={1.5} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Candidate Details
                </Typography>
                {[
                  { icon: <PersonIcon fontSize="small" />,  label: 'Full Name',      value: candidate.name },
                  { icon: <PassportIcon fontSize="small" />, label: 'Passport No.',  value: candidate.passport },
                  { icon: <PublicIcon fontSize="small" />,  label: 'Country',        value: candidate.country },
                  { icon: <WorkIcon fontSize="small" />,    label: 'Trade',          value: candidate.trade || '—' },
                  { icon: <GroupIcon fontSize="small" />,   label: 'Agent / Ref',    value: candidate.ref || 'Direct' },
                  { icon: <PaymentIcon fontSize="small" />, label: 'Payment',        value: candidate.payment ? `₹${candidate.payment.toLocaleString()}` : '—' },
                  { icon: <PassportIcon fontSize="small" />, label: 'PP Expiry',     value: candidate.ppExp || '—', warn: expiringSoon },
                  { icon: <FlightIcon fontSize="small" />,  label: 'Submission Date', value: candidate.subDate || '—' },
                ].map(row => (
                  <Box key={row.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Box sx={{ color: 'text.secondary', display: 'flex' }}>{row.icon}</Box>
                    <Typography variant="caption" color="text.secondary" sx={{ width: 100, flexShrink: 0 }}>{row.label}</Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ color: row.warn ? '#e65100' : 'text.primary' }}>
                      {row.value} {row.warn && '⚠️'}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Visa Timeline */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'grey.100', borderRadius: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} mb={2} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Visa Processing Timeline
                </Typography>
                <Stepper activeStep={visaStep} alternativeLabel>
                  {VISA_STEPS.map(label => (
                    <Step key={label}>
                      <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: 11 } }}>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <Box sx={{ mt: 2, p: 1.5, bgcolor: '#EEF0FB', borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="body2" fontWeight={600} color="primary">
                    Current Stage: {VISA_STEPS[visaStep]}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* ── RIGHT COLUMN ── */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'grey.100', borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Document Checklist
                  </Typography>
                  <Chip label={`${checked.length} / ${DOC_CHECKLIST.length}`} size="small"
                    sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700 }} />
                </Box>

                {/* Progress bar */}
                <Box sx={{ mb: 1.5 }}>
                  <LinearProgress variant="determinate" value={docProgress}
                    sx={{ height: 6, borderRadius: 3, bgcolor: '#e8eaf6',
                      '& .MuiLinearProgress-bar': { bgcolor: docProgress === 100 ? '#2e7d32' : '#1565c0' } }} />
                  <Typography variant="caption" color="text.secondary">{docProgress}% complete</Typography>
                </Box>

                {/* Checklist items — each is toggleable */}
                <List dense disablePadding>
                  {DOC_CHECKLIST.map(doc => {
                    const isChecked = checked.includes(doc);
                    return (
                      <ListItem key={doc} disablePadding
                        onClick={() => onDocToggle && onDocToggle(candidate.id, doc)}
                        sx={{ cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: '#f5f7ff' }, py: 0.3 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {isChecked
                            ? <CheckCircleIcon fontSize="small" sx={{ color: '#2e7d32' }} />
                            : <RadioButtonUncheckedIcon fontSize="small" sx={{ color: '#bdbdbd' }} />}
                        </ListItemIcon>
                        <ListItemText
                          primary={doc}
                          primaryTypographyProps={{
                            fontSize: 13,
                            fontWeight: isChecked ? 600 : 400,
                            color: isChecked ? '#2e7d32' : 'text.primary',
                            textDecoration: isChecked ? 'line-through' : 'none',
                          }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'grey.100' }}>
        <Button onClick={onClose} variant="outlined" color="inherit">Close</Button>
        {/* <Button onClick={onEdit} variant="contained" startIcon={<EditIcon />} sx={{ fontWeight: 700 }}>
          Edit Candidate
        </Button> */}
      </DialogActions>
    </Dialog>
  );
}

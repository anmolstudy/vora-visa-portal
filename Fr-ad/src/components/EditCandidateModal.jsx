import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, MenuItem, Select,
  FormControl, InputLabel, Typography, Box, Divider,
  IconButton, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

const COUNTRIES = [
  // Gulf / Middle East
  "Dubai", "Abu Dhabi", "Sharjah", "Kuwait", "Qatar", "Bahrain", "Oman", "Saudi Arabia", "Jordan",
  // Europe — Eastern & Balkan
  "Romania", "Croatia", "Bulgaria", "Serbia", "Bosnia", "Slovenia", "Slovakia", "Hungary", "Poland", "Czech Republic",
  // CIS / Eastern Europe
  "Russia", "Ukraine", "Moldova", "Georgia", "Azerbaijan", "Kazakhstan", "Uzbekistan",
  // Western Europe
  "Germany", "Italy", "Spain", "Portugal", "France", "Netherlands", "Belgium", "Austria", "Switzerland",
  // Other
  "Malta", "Cyprus", "Singapore", "Malaysia", "Other",
];
const PP_STATUSES = ['IN MAIL', 'IN OFFICE', 'COURIER', 'AT DELHI', 'COURIER TO MS OFFICE'];
const VISA_STATUS = ['', 'OK', 'PENDING', 'REJECTED', 'NOT APPLIED'];
const TRADES = [
  'WAREHOUSE HELPER', 'HELPER', 'STEEL FIXER', 'WALL PAINTER', 'SHUTTERING CARPENTER',
  'AGRICULTURE WORKER', 'VEGETABLE & FRUIT PROCESSING', 'MASON', 'PACKING HELPER',
  'HEAVY DRIVER', 'TAXI DRIVER', 'TAILOR', 'SEASONAL', 'CLEANER', 'UNSKILLED', 'Other',
];
const PIPELINE_STATUS = ['NEW', 'CONTACTED', 'PROCESSING', 'DOCUMENTS', 'VISA APPLIED', 'APPROVED', 'REJECTED'];

export default function EditCandidateModal({ open, onClose, onSave, candidate, agents }) {
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);

  // Load candidate data into form when opened
  useEffect(() => {
    if (candidate) {
      setForm({
        name: candidate.name || '',
        passport: candidate.passport || '',
        country: candidate.country || 'Romania',
        trade: candidate.trade || '',
        ref: candidate.ref || '',
        ppStatus: candidate.ppStatus || 'IN MAIL',
        visa: candidate.visa || '',
        payment: candidate.payment || '',
        ppExp: candidate.ppExp || '',
        subDate: candidate.subDate || '',
      });
      setSaved(false);
    }
  }, [candidate, open]);

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    onSave({ ...candidate, ...form, payment: form.payment ? parseInt(form.payment) : null });
    setSaved(true);
    setTimeout(() => onClose(), 700);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}>

      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box sx={{ bgcolor: '#fff3e0', p: 1, borderRadius: 2, color: '#e65100', display: 'flex' }}>
          <EditIcon />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700}>Edit Candidate</Typography>
          <Typography variant="caption" color="text.secondary">{candidate?.passport}</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ ml: 'auto' }}><CloseIcon /></IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {saved && <Alert severity="success" sx={{ mb: 2 }}>✅ Candidate updated!</Alert>}
        <Grid container spacing={2.5}>

          <Grid item xs={12}>
            <Typography variant="overline" color="text.secondary" fontWeight={700}>Basic Information</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Full Name" size="small" value={form.name}
              onChange={e => handleChange('name', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Passport No." size="small" value={form.passport}
              onChange={e => handleChange('passport', e.target.value)}
              inputProps={{ style: { fontFamily: 'monospace', textTransform: 'uppercase' } }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Country</InputLabel>
              <Select value={form.country || ''} label="Country" onChange={e => handleChange('country', e.target.value)}>
                {COUNTRIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Divider><Typography variant="overline" color="text.secondary" fontWeight={700}>Agent & Status</Typography></Divider>
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Agent / Ref</InputLabel>
              <Select value={form.ref || ''} label="Agent / Ref" onChange={e => handleChange('ref', e.target.value)}>
                <MenuItem value="">— Direct / None —</MenuItem>
                {(agents || []).map(a => <MenuItem key={a.id} value={a.name}>{a.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Passport Status</InputLabel>
              <Select value={form.ppStatus || ''} label="Passport Status" onChange={e => handleChange('ppStatus', e.target.value)}>
                {PP_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Visa Status</InputLabel>
              <Select value={form.visa || ''} label="Visa Status" onChange={e => handleChange('visa', e.target.value)}>
                {VISA_STATUS.map(s => <MenuItem key={s} value={s}>{s || '— Not Set —'}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Payment Received (₹)" size="small" type="number"
              value={form.payment} onChange={e => handleChange('payment', e.target.value)}
              InputProps={{ startAdornment: <Typography sx={{ mr: 0.5, color: 'text.secondary' }}>₹</Typography> }} />
          </Grid>

          <Grid item xs={12}>
            <Divider><Typography variant="overline" color="text.secondary" fontWeight={700}>Dates</Typography></Divider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Passport Expiry Date" size="small" type="date"
              value={form.ppExp || ''} onChange={e => handleChange('ppExp', e.target.value)}
              InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Submission Date" size="small" type="date"
              value={form.subDate || ''} onChange={e => handleChange('subDate', e.target.value)}
              InputLabelProps={{ shrink: true }} />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="warning" sx={{ px: 3, fontWeight: 700 }}>
          Update Candidate
        </Button>
      </DialogActions>
    </Dialog>
  );
}

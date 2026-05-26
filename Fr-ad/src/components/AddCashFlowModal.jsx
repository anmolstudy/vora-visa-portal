import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, MenuItem, Select,
  FormControl, InputLabel, Typography, Box, Divider,
  IconButton, Alert, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const TX_TYPES_IN  = ['Income – Candidate', 'Income – Other', 'Internal Transfer'];
const TX_TYPES_OUT = ['Payment Out – Partner', 'Office Expense', 'Salary', 'Refund Out', 'Internal Transfer'];
const MODES        = ['Cash', 'UPI', 'Bank Transfer', 'Cheque'];
const COUNTRIES = [
  '',
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

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  candidate: '', agent: '', service: '', country: '',
  mode: 'Cash', type: 'Income – Candidate',
  cashIn: '', cashOut: '', smallExp: '', remarks: '',
};

export default function AddCashFlowModal({ open, onClose, onSave, candidates, agents }) {
  const [form, setForm]     = useState(emptyForm);
  const [direction, setDir] = useState('in'); // 'in' | 'out' | 'exp'
  const [saved, setSaved]   = useState(false);

  useEffect(() => { if (open) { setForm(emptyForm); setDir('in'); setSaved(false); } }, [open]);

  function set(field, val) { setForm(p => ({ ...p, [field]: val })); }

  // Auto-switch type options based on direction
  const txTypes = direction === 'in' ? TX_TYPES_IN : TX_TYPES_OUT;

  function handleSave() {
    const entry = {
      ...form,
      cashIn:   direction === 'in'  ? parseFloat(form.cashIn)  || 0 : 0,
      cashOut:  direction === 'out' ? parseFloat(form.cashOut) || 0 : 0,
      smallExp: direction === 'exp' ? parseFloat(form.smallExp)|| 0 : 0,
    };
    onSave(entry);
    setSaved(true);
    setTimeout(() => onClose(), 700);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}>

      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box sx={{ bgcolor: '#e8f5e9', p: 1, borderRadius: 2, color: '#2e7d32', display: 'flex' }}>
          <AccountBalanceWalletIcon />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700}>Add Cash Flow Entry</Typography>
          <Typography variant="caption" color="text.secondary">Record a new transaction</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ ml: 'auto' }}><CloseIcon /></IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {saved && <Alert severity="success" sx={{ mb: 2 }}>✅ Transaction added!</Alert>}

        <Grid container spacing={2}>

          {/* Direction toggle */}
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Transaction Direction
            </Typography>
            <Box mt={1}>
              <ToggleButtonGroup value={direction} exclusive onChange={(_, v) => { if (v) { setDir(v); set('type', v === 'in' ? TX_TYPES_IN[0] : TX_TYPES_OUT[0]); } }} size="small" fullWidth>
                <ToggleButton value="in"  sx={{ '&.Mui-selected': { bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700 } }}>
                  <TrendingUpIcon sx={{ mr: 0.5, fontSize: 16 }} /> Cash In
                </ToggleButton>
                <ToggleButton value="out" sx={{ '&.Mui-selected': { bgcolor: '#ffebee', color: '#c62828', fontWeight: 700 } }}>
                  <TrendingDownIcon sx={{ mr: 0.5, fontSize: 16 }} /> Cash Out
                </ToggleButton>
                <ToggleButton value="exp" sx={{ '&.Mui-selected': { bgcolor: '#fff3e0', color: '#e65100', fontWeight: 700 } }}>
                  Small Expense
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>

          {/* Date */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Date" size="small" type="date"
              value={form.date} onChange={e => set('date', e.target.value)}
              InputLabelProps={{ shrink: true }} />
          </Grid>

          {/* Transaction Type */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Transaction Type</InputLabel>
              <Select value={form.type} label="Transaction Type" onChange={e => set('type', e.target.value)}>
                {txTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          {/* Amount */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" type="number"
              label={direction === 'in' ? 'Cash In (₹)' : direction === 'out' ? 'Cash Out (₹)' : 'Amount (₹)'}
              value={direction === 'in' ? form.cashIn : direction === 'out' ? form.cashOut : form.smallExp}
              onChange={e => set(direction === 'in' ? 'cashIn' : direction === 'out' ? 'cashOut' : 'smallExp', e.target.value)}
              InputProps={{ startAdornment: <Typography sx={{ mr: 0.5, color: 'text.secondary' }}>₹</Typography> }} />
          </Grid>

          {/* Mode */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Mode of Payment</InputLabel>
              <Select value={form.mode} label="Mode of Payment" onChange={e => set('mode', e.target.value)}>
                {MODES.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          {/* Candidate */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Candidate</InputLabel>
              <Select value={form.candidate} label="Candidate" onChange={e => set('candidate', e.target.value)}>
                <MenuItem value="">— None —</MenuItem>
                {(candidates || []).slice(0, 100).map(c => (
                  <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Agent */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Agent</InputLabel>
              <Select value={form.agent} label="Agent" onChange={e => set('agent', e.target.value)}>
                <MenuItem value="">— None —</MenuItem>
                {(agents || []).map(a => <MenuItem key={a.id} value={a.name}>{a.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          {/* Service */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Service / Purpose" size="small"
              value={form.service} onChange={e => set('service', e.target.value)}
              placeholder="e.g. Offer Letter, Permit, Visa Fee" />
          </Grid>

          {/* Country */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Country</InputLabel>
              <Select value={form.country} label="Country" onChange={e => set('country', e.target.value)}>
                {COUNTRIES.map(c => <MenuItem key={c} value={c}>{c || '— None —'}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          {/* Remarks */}
          <Grid item xs={12}>
            <TextField fullWidth label="Remarks" size="small" multiline rows={2}
              value={form.remarks} onChange={e => set('remarks', e.target.value)}
              placeholder="Any notes about this transaction..." />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">Cancel</Button>
        <Button onClick={handleSave} variant="contained" color={direction === 'in' ? 'success' : 'error'}
          sx={{ fontWeight: 700, px: 3 }}>
          Add Transaction
        </Button>
      </DialogActions>
    </Dialog>
  );
}

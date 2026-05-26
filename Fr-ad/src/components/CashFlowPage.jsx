import { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, TextField, InputAdornment,
  TablePagination, Select, MenuItem, FormControl, InputLabel, Button, IconButton, Tooltip
} from '@mui/material';
import SearchIcon      from '@mui/icons-material/Search';
import TrendingUpIcon  from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AddIcon         from '@mui/icons-material/Add';
import DownloadIcon    from '@mui/icons-material/Download';
import AddCashFlowModal from './AddCashFlowModal';
import { exportCashFlow } from '../utils/ExportUtils';

function TypeChip({ type }) {
  const map = {
    'Income – Candidate':    { bg: '#e8f5e9', color: '#2e7d32' },
    'Income – Other':        { bg: '#e8f5e9', color: '#2e7d32' },
    'Payment Out – Partner': { bg: '#ffebee', color: '#c62828' },
    'Office Expense':        { bg: '#fff3e0', color: '#e65100' },
    'Salary':                { bg: '#f3e5f5', color: '#6a1b9a' },
    'Refund Out':            { bg: '#fce4ec', color: '#c62828' },
    'Internal Transfer':     { bg: '#e3f2fd', color: '#1565c0' },
  };
  const s = map[type] || { bg: '#f5f5f5', color: '#616161' };
  return <Chip label={type || '—'} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: 10, borderRadius: 1.5 }} />;
}

export default function CashFlowPage({ cashFlow, onAddTransaction, candidates, agents }) {
  const [search, setSearch]       = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [page, setPage]           = useState(0);
  const [rowsPerPage, setRpp]     = useState(15);
  const [addOpen, setAddOpen]     = useState(false);

  const transactions = cashFlow?.transactions || [];
  const types = ['All', ...new Set(transactions.map(t => t.type).filter(Boolean))];

  const filtered = transactions.filter(t => {
    const ms = !search ||
      t.candidate?.toLowerCase().includes(search.toLowerCase()) ||
      t.agent?.toLowerCase().includes(search.toLowerCase()) ||
      t.service?.toLowerCase().includes(search.toLowerCase()) ||
      t.country?.toLowerCase().includes(search.toLowerCase());
    return ms && (typeFilter === 'All' || t.type === typeFilter);
  });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const totalIn  = filtered.reduce((s, t) => s + (t.cashIn  || 0), 0);
  const totalOut = filtered.reduce((s, t) => s + (t.cashOut || 0), 0);
  const totalExp = filtered.reduce((s, t) => s + (t.smallExp|| 0), 0);

  return (
    <Box>
      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Cash In',  value: `₹${totalIn.toLocaleString()}`,            color: '#2e7d32', bg: '#e8f5e9', icon: <TrendingUpIcon />  },
          { label: 'Total Paid Out', value: `₹${totalOut.toLocaleString()}`,           color: '#c62828', bg: '#ffebee', icon: <TrendingDownIcon /> },
          { label: 'Small Expenses', value: `₹${totalExp.toLocaleString()}`,           color: '#e65100', bg: '#fff3e0', icon: <TrendingDownIcon /> },
          { label: 'Net (filtered)', value: `₹${(totalIn-totalOut-totalExp).toLocaleString()}`, color: '#3F51B5', bg: '#EEF0FB', icon: <TrendingUpIcon /> },
        ].map(c => (
          <Card key={c.label} elevation={0} sx={{ flex: 1, minWidth: 160, borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: c.color, mb: 0.5 }}>
                {c.icon}
                <Typography variant="caption" fontWeight={600}>{c.label}</Typography>
              </Box>
              <Typography variant="h6" fontWeight={800} sx={{ color: c.color }}>{c.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Table */}
      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
            <Typography variant="h6" fontWeight={700}>
              Cash Flow Register <span style={{ fontWeight: 400, fontSize: 13, color: '#888' }}>({filtered.length} entries)</span>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField size="small" placeholder="Search candidate, agent..." value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }} sx={{ width: 200 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Type</InputLabel>
                <Select value={typeFilter} label="Type" onChange={e => { setTypeFilter(e.target.value); setPage(0); }}>
                  {types.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
              <Tooltip title="Export to CSV">
                <IconButton onClick={() => exportCashFlow(filtered)} sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {onAddTransaction && (
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}
                  sx={{ fontWeight: 700, borderRadius: 2, whiteSpace: 'nowrap' }}>
                  Add Entry
                </Button>
              )}
            </Box>
          </Box>

          <TableContainer sx={{ maxHeight: 500 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {['Date','Candidate','Agent','Service','Country','Type','Cash In','Cash Out','Exp','Balance','Mode'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary', bgcolor: '#fafafa' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((row, i) => (
                  <TableRow key={i}
                    sx={{ '&:hover': { bgcolor: '#F0F3FF' }, bgcolor: row.isNew ? '#f0fff4' : 'inherit' }}>
                    <TableCell sx={{ fontSize: 12, whiteSpace: 'nowrap' }}>{row.date || '—'}</TableCell>
                    <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>{row.candidate || '—'}</TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{row.agent || '—'}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{row.service || '—'}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{row.country || '—'}</TableCell>
                    <TableCell><TypeChip type={row.type} /></TableCell>
                    <TableCell sx={{ fontSize: 12, fontWeight: 600, color: '#2e7d32' }}>
                      {row.cashIn > 0 ? `₹${row.cashIn.toLocaleString()}` : ''}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, fontWeight: 600, color: '#c62828' }}>
                      {row.cashOut > 0 ? `₹${row.cashOut.toLocaleString()}` : ''}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: '#e65100' }}>
                      {row.smallExp > 0 ? `₹${row.smallExp.toLocaleString()}` : ''}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, fontWeight: 700, color: '#1565c0' }}>
                      {row.balance != null ? `₹${row.balance.toLocaleString()}` : ''}
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, color: 'text.secondary' }}>{row.mode || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination component="div" count={filtered.length} page={page}
            onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
            onRowsPerPageChange={e => { setRpp(+e.target.value); setPage(0); }}
            rowsPerPageOptions={[15, 25, 50]} />
        </CardContent>
      </Card>

      {/* Add Entry Modal */}
      <AddCashFlowModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={entry => { onAddTransaction && onAddTransaction(entry); setAddOpen(false); }}
        candidates={candidates}
        agents={agents}
      />
    </Box>
  );
}

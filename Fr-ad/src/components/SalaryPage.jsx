import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

export default function SalaryPage({ salary }) {
  const [data, setData] = useState(salary || []);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const defaultForm = {
    name: "",
    role: "",
    salary: "",
    mode: "Cash",
    remark: "",
  };

  const [form, setForm] = useState(defaultForm);

  // Filters
  const [nameFilter, setNameFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [remarkFilter, setRemarkFilter] = useState("");

  // Auto Month
  const month = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Filter Data
  const filteredData = data.filter((row) => {
    return (
      row.name?.toLowerCase().includes(nameFilter.toLowerCase()) &&
      row.month?.toLowerCase().includes(monthFilter.toLowerCase()) &&
      row.remark?.toLowerCase().includes(remarkFilter.toLowerCase())
    );
  });

  // Handle Input Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // SAVE
  const handleSave = () => {
    if (editIndex !== null) {
      const updated = [...data];
      updated[editIndex] = { ...form, month };
      setData(updated);
    } else {
      const newEntry = { ...form, month };
      setData([...data, newEntry]);
    }

    setOpen(false);
    setEditIndex(null);
    setForm(defaultForm);
  };

  // DELETE
  const handleDelete = (index) => {
    const updated = data.filter((_, i) => i !== index);
    setData(updated);
  };

  // EDIT
  const handleEdit = (row, index) => {
    setForm({
      name: row.name || "",
      role: row.role || "",
      salary: row.salary || "",
      mode: row.mode || "Cash",
      remark: row.remark || "",
    });

    setEditIndex(index);
    setOpen(true);
  };

  return (
    <Box>
      {/* ADD BUTTON */}
      <Box mb={2}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Salary
        </Button>
      </Box>

      {/* FILTERS */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          label="Filter by Name"
          size="small"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />

        <TextField
          label="Filter by Month"
          size="small"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        />

        <TextField
          label="Filter by Remark"
          size="small"
          value={remarkFilter}
          onChange={(e) => setRemarkFilter(e.target.value)}
        />

        <Button
          variant="outlined"
          onClick={() => {
            setNameFilter("");
            setMonthFilter("");
            setRemarkFilter("");
          }}
        >
          Reset
        </Button>
      </Box>

      {/* TABLE */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Salary Register
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>S No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Mode</TableCell>
                  <TableCell>Remark</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredData.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.month}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>₹{row.salary}</TableCell>
                    <TableCell>{row.mode}</TableCell>
                    <TableCell>{row.remark}</TableCell>

                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEdit(row, i)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => handleDelete(i)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {editIndex !== null ? "Edit Salary" : "Add Salary"}
        </DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
          />

          <TextField
            label="Salary"
            name="salary"
            type="number"
            value={form.salary}
            onChange={handleChange}
          />

          <TextField
            select
            label="Payment Mode"
            name="mode"
            value={form.mode}
            onChange={handleChange}
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
          </TextField>

          <TextField
            label="Remark"
            name="remark"
            multiline
            rows={2}
            value={form.remark}
            onChange={handleChange}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button variant="contained" onClick={handleSave}>
            {editIndex !== null ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} // import { useState } from "react";
// import {
// Card,
// CardContent,
// Typography,
// Box,
// Table,
// TableBody,
// TableCell,
// TableContainer,
// TableHead,
// TableRow,
// Button,
// Dialog,
// DialogTitle,
// DialogContent,
// DialogActions,
// TextField,
// MenuItem,
// } from "@mui/material";

// export default function SalaryPage({ salary }) {

// const [data, setData] = useState(salary || []);
// const [open, setOpen] = useState(false);
// const [editIndex, setEditIndex] = useState(null);

// const [form, setForm] = useState({
// name: "",
// role: "",
// salary: "",
// mode: "Cash",
// remark: "",
// });

// // Filters
// const [nameFilter, setNameFilter] = useState("");
// const [monthFilter, setMonthFilter] = useState("");
// const [remarkFilter, setRemarkFilter] = useState("");

// // Auto Month
// const month = new Date().toLocaleString("default", {
// month: "long",
// year: "numeric",
// });

// // Filtered Data
// const filteredData = data.filter((row) => {
// return (
// row.name?.toLowerCase().includes(nameFilter.toLowerCase()) &&
// row.month?.toLowerCase().includes(monthFilter.toLowerCase()) &&
// row.remark?.toLowerCase().includes(remarkFilter.toLowerCase())
// );
// });

// // SAVE
// const handleSave = () => {

// if (editIndex !== null) {
//   const updated = [...data];
//   updated[editIndex] = { ...form, month };
//   setData(updated);
// } else {
//   const newEntry = { ...form, month };
//   setData([...data, newEntry]);
// }

// setOpen(false);
// setEditIndex(null);

// setForm({
//   name: "",
//   role: "",
//   salary: "",
//   mode: "Cash",
//   remark: "",
// });
// ```

// };

// // DELETE
// const handleDelete = (index) => {
// const updated = data.filter((_, i) => i !== index);
// setData(updated);
// };

// // EDIT
// const handleEdit = (row, index) => {
// setForm(row);
// setEditIndex(index);
// setOpen(true);
// };

// return ( <Box>

// ```
//   {/* ADD BUTTON */}
//   <Box mb={2}>
//     <Button variant="contained" onClick={() => setOpen(true)}>
//       Add Salary
//     </Button>
//   </Box>

//   {/* FILTERS */}
//   <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>

//     <TextField
//       label="Filter by Name"
//       size="small"
//       value={nameFilter}
//       onChange={(e) => setNameFilter(e.target.value)}
//     />

//     <TextField
//       label="Filter by Month"
//       size="small"
//       value={monthFilter}
//       onChange={(e) => setMonthFilter(e.target.value)}
//     />

//     <TextField
//       label="Filter by Remark"
//       size="small"
//       value={remarkFilter}
//       onChange={(e) => setRemarkFilter(e.target.value)}
//     />

//     <Button
//       variant="outlined"
//       onClick={() => {
//         setNameFilter("");
//         setMonthFilter("");
//         setRemarkFilter("");
//       }}
//     >
//       Reset
//     </Button>

//   </Box>

//   {/* TABLE */}
//   <Card>
//     <CardContent>

//       <Typography variant="h6" mb={2}>
//         Salary Register
//       </Typography>

//       <TableContainer>
//         <Table size="small">

//           <TableHead>
//             <TableRow>
//               <TableCell>S No</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Month</TableCell>
//               <TableCell>Role</TableCell>
//               <TableCell>Salary</TableCell>
//               <TableCell>Mode</TableCell>
//               <TableCell>Remark</TableCell>
//               <TableCell>Action</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>

//             {filteredData.map((row, i) => (
//               <TableRow key={i}>

//                 <TableCell>{i + 1}</TableCell>
//                 <TableCell>{row.name}</TableCell>
//                 <TableCell>{row.month}</TableCell>
//                 <TableCell>{row.role}</TableCell>
//                 <TableCell>₹{row.salary}</TableCell>
//                 <TableCell>{row.mode}</TableCell>
//                 <TableCell>{row.remark}</TableCell>

//                 <TableCell>

//                   <Button
//                     size="small"
//                     variant="outlined"
//                     onClick={() => handleEdit(row, i)}
//                     sx={{ mr: 1 }}
//                   >
//                     Edit
//                   </Button>

//                   <Button
//                     size="small"
//                     color="error"
//                     variant="outlined"
//                     onClick={() => handleDelete(i)}
//                   >
//                     Delete
//                   </Button>

//                 </TableCell>

//               </TableRow>
//             ))}

//           </TableBody>

//         </Table>
//       </TableContainer>

//     </CardContent>
//   </Card>

//   {/* DIALOG */}
//   <Dialog open={open} onClose={() => setOpen(false)} fullWidth>

//     <DialogTitle>
//       {editIndex !== null ? "Edit Salary" : "Add Salary"}
//     </DialogTitle>

//     <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>

//       <TextField
//         label="Name"
//         value={form.name}
//         onChange={(e) =>
//           setForm({ ...form, name: e.target.value })
//         }
//       />

//       <TextField
//         label="Role"
//         value={form.role}
//         onChange={(e) =>
//           setForm({ ...form, role: e.target.value })
//         }
//       />

//       <TextField
//         label="Salary"
//         type="number"
//         value={form.salary}
//         onChange={(e) =>
//           setForm({ ...form, salary: e.target.value })
//         }
//       />

//       <TextField
//         select
//         label="Payment Mode"
//         value={form.mode}
//         onChange={(e) =>
//           setForm({ ...form, mode: e.target.value })
//         }
//       >
//         <MenuItem value="Cash">Cash</MenuItem>
//         <MenuItem value="UPI">UPI</MenuItem>
//         <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
//       </TextField>

//       <TextField
//         label="Remark"
//         multiline
//         rows={2}
//         value={form.remark}
//         onChange={(e) =>
//           setForm({ ...form, remark: e.target.value })
//         }
//       />

//     </DialogContent>

//     <DialogActions>

//       <Button onClick={() => setOpen(false)}>
//         Cancel
//       </Button>

//       <Button variant="contained" onClick={handleSave}>
//         {editIndex !== null ? "Update" : "Save"}
//       </Button>

//     </DialogActions>

//   </Dialog>

// </Box>

// );
// }
// // import {
// //   Card,
// //   CardContent,
// //   Typography,
// //   Box,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Chip,
// // } from "@mui/material";

// // export default function SalaryPage({ salary }) {
// //   const data = salary || [];

// //   // Group by staff member
// //   const byStaff = {};
// //   data.forEach((row) => {
// //     if (!byStaff[row.name])
// //       byStaff[row.name] = {
// //         name: row.name,
// //         role: row.role,
// //         total: 0,
// //         entries: [],
// //       };
// //     byStaff[row.name].total += row.salary || 0;
// //     byStaff[row.name].entries.push(row);
// //   });

// //   const totalSalary = data.reduce((s, r) => s + (r.salary || 0), 0);

// //   return (
// //     <Box>
// //       {/* Staff summary cards */}
// //       <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
// //         {Object.values(byStaff).map((staff) => (
// //           <Card
// //             key={staff.name}
// //             elevation={0}
// //             sx={{
// //               borderRadius: 3,
// //               border: "1px solid",
// //               borderColor: "grey.100",
// //               minWidth: 180,
// //             }}
// //           >
// //             <CardContent sx={{ p: 2 }}>
// //               <Typography fontWeight={700} fontSize={14}>
// //                 {staff.name}
// //               </Typography>
// //               <Chip
// //                 label={staff.role}
// //                 size="small"
// //                 sx={{ mb: 1, fontSize: 10 }}
// //               />
// //               <Typography variant="h6" fontWeight={800} color="primary">
// //                 ₹{staff.total.toLocaleString()}
// //               </Typography>
// //               <Typography variant="caption" color="text.secondary">
// //                 Total paid ({staff.entries.length} entries)
// //               </Typography>
// //             </CardContent>
// //           </Card>
// //         ))}
// //         <Card
// //           elevation={0}
// //           sx={{
// //             borderRadius: 3,
// //             border: "2px solid",
// //             borderColor: "primary.main",
// //             minWidth: 180,
// //           }}
// //         >
// //           <CardContent sx={{ p: 2 }}>
// //             <Typography fontWeight={700} fontSize={14} color="primary">
// //               Total Salary Paid
// //             </Typography>
// //             <Typography variant="h5" fontWeight={800} color="primary">
// //               ₹{totalSalary.toLocaleString()}
// //             </Typography>
// //             <Typography variant="caption" color="text.secondary">
// //               {data.length} salary entries
// //             </Typography>
// //           </CardContent>
// //         </Card>
// //       </Box>

// //       {/* Full table */}
// //       <Card
// //         elevation={0}
// //         sx={{ borderRadius: 3, border: "1px solid", borderColor: "grey.100" }}
// //       >
// //         <CardContent sx={{ p: 3 }}>
// //           <Typography variant="h6" fontWeight={700} mb={2}>
// //             Staff Salary Register
// //           </Typography>
// //           <TableContainer>
// //             <Table size="small">
// //               <TableHead>
// //                 <TableRow>
// //                   {[
// //                     "#",
// //                     "Month",
// //                     "Staff Name",
// //                     "Role",
// //                     "Salary (₹)",
// //                     "Mode",
// //                     "Remarks",
// //                   ].map((h) => (
// //                     <TableCell
// //                       key={h}
// //                       sx={{
// //                         fontWeight: 700,
// //                         fontSize: 11,
// //                         textTransform: "uppercase",
// //                         letterSpacing: 0.5,
// //                         color: "text.secondary",
// //                         bgcolor: "#fafafa",
// //                       }}
// //                     >
// //                       {h}
// //                     </TableCell>
// //                   ))}
// //                 </TableRow>
// //               </TableHead>
// //               <TableBody>
// //                 {data.map((row, i) => (
// //                   <TableRow key={i} sx={{ "&:hover": { bgcolor: "#f5f7ff" } }}>
// //                     <TableCell sx={{ fontSize: 12, color: "text.disabled" }}>
// //                       {i + 1}
// //                     </TableCell>
// //                     <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>
// //                       {row.month}
// //                     </TableCell>
// //                     <TableCell sx={{ fontSize: 13, fontWeight: 700 }}>
// //                       {row.name}
// //                     </TableCell>
// //                     <TableCell>
// //                       <Chip
// //                         label={row.role}
// //                         size="small"
// //                         variant="outlined"
// //                         sx={{ fontSize: 10, height: 20 }}
// //                       />
// //                     </TableCell>
// //                     <TableCell
// //                       sx={{ fontSize: 13, fontWeight: 700, color: "#2e7d32" }}
// //                     >
// //                       ₹{(row.salary || 0).toLocaleString()}
// //                     </TableCell>
// //                     <TableCell sx={{ fontSize: 12, color: "text.secondary" }}>
// //                       Cash/Transfer
// //                     </TableCell>
// //                     <TableCell
// //                       sx={{
// //                         fontSize: 11,
// //                         color: "text.secondary",
// //                         maxWidth: 200,
// //                       }}
// //                     >
// //                       {row.remarks?.slice(0, 60)}
// //                       {row.remarks?.length > 60 ? "…" : ""}
// //                     </TableCell>
// //                   </TableRow>
// //                 ))}
// //               </TableBody>
// //             </Table>
// //           </TableContainer>
// //         </CardContent>
// //       </Card>
// //     </Box>
// //   );
// // }

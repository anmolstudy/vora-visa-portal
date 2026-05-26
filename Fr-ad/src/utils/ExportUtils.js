/**
 * ExportUtils.js
 * Simple CSV/Excel export helpers — no extra libraries needed
 */

// Convert array of objects to CSV string
function toCSV(rows, columns) {
  const header = columns.map((c) => c.label).join(",");
  const lines = rows.map((row) =>
    columns
      .map((c) => {
        const val = row[c.key] ?? "";
        // Wrap in quotes if value contains comma or newline
        return String(val).includes(",") ? `"${val}"` : String(val);
      })
      .join(","),
  );
  return [header, ...lines].join("\n");
}

// Trigger browser download
function download(filename, content, mime = "text/csv") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── EXPORT CANDIDATES ──
export function exportCandidates(candidates) {
  const cols = [
    { key: "name", label: "Name" },
    { key: "passport", label: "Passport No" },
    { key: "country", label: "Country" },
    { key: "trade", label: "Trade" },
    { key: "ref", label: "Agent/Ref" },
    { key: "ppStatus", label: "PP Status" },
    { key: "visa", label: "Visa Status" },
    { key: "payment", label: "Payment (Rs)" },
    { key: "ppExp", label: "PP Expiry" },
    { key: "subDate", label: "Submission Date" },
  ];
  const csv = toCSV(candidates, cols);
  download(`candidates_${today()}.csv`, csv);
}

// ── EXPORT CASH FLOW ──
export function exportCashFlow(transactions) {
  const cols = [
    { key: "date", label: "Date" },
    { key: "candidate", label: "Candidate" },
    { key: "agent", label: "Agent" },
    { key: "service", label: "Service" },
    { key: "country", label: "Country" },
    { key: "type", label: "Type" },
    { key: "cashIn", label: "Cash In (Rs)" },
    { key: "cashOut", label: "Cash Out (Rs)" },
    { key: "smallExp", label: "Small Exp (Rs)" },
    { key: "balance", label: "Balance (Rs)" },
    { key: "mode", label: "Mode" },
    { key: "remarks", label: "Remarks" },
  ];
  const csv = toCSV(transactions, cols);
  download(`cashflow_${today()}.csv`, csv);
}

// ── EXPORT AGENTS ──
export function exportAgents(agents) {
  const cols = [
    { key: "name", label: "Agent Name" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
    { key: "notes", label: "Notes" },
  ];
  download(`agents_${today()}.csv`, toCSV(agents, cols));
}

// ── PAYMENT RECEIPT (simple HTML → print) ──
export function printReceipt(candidate, amount) {
  const html = `
    <html>
    <head>
      <title>Payment Receipt</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #222; }
        .header { text-align: center; border-bottom: 2px solid #1565c0; pb: 16px; }
        h1 { color: #1565c0; margin: 0; }
        .receipt-box { border: 1px solid #ddd; border-radius: 8px; padding: 24px; margin-top: 20px; }
        .row { display: flex; justify-content: space-between; margin: 8px 0; }
        .label { color: #666; }
        .value { font-weight: bold; }
        .amount { font-size: 24px; color: #2e7d32; text-align: center; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>VORA</h1>
        <p>Payment Receipt</p>
      </div>
      <div class="receipt-box">
        <div class="row"><span class="label">Receipt Date</span><span class="value">${new Date().toLocaleDateString("en-IN")}</span></div>
        <div class="row"><span class="label">Candidate Name</span><span class="value">${candidate?.name || "—"}</span></div>
        <div class="row"><span class="label">Passport No.</span><span class="value">${candidate?.passport || "—"}</span></div>
        <div class="row"><span class="label">Country</span><span class="value">${candidate?.country || "—"}</span></div>
        <div class="row"><span class="label">Trade</span><span class="value">${candidate?.trade || "—"}</span></div>
        <div class="row"><span class="label">Agent / Ref</span><span class="value">${candidate?.ref || "Direct"}</span></div>
        <div class="amount">Amount Paid: ₹${(amount || candidate?.payment || 0).toLocaleString("en-IN")}</div>
        <div class="row"><span class="label">Payment Status</span><span class="value" style="color:#2e7d32">✅ Received</span></div>
      </div>
      <div class="footer">
        <p>VORA — Visa & Overseas Recruitment Services</p>
        <p>Generated on ${new Date().toLocaleString("en-IN")}</p>
      </div>
    </body>
    </html>
  `;
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
}

// Helper: today's date string for filenames
function today() {
  return new Date().toISOString().split("T")[0];
}

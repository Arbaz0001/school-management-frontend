function escapeCsv(value) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportRowsToCsv({ columns, rows, fileName }) {
  const header = columns.map((col) => escapeCsv(col.label)).join(",");
  const lines = rows.map((row) => columns.map((col) => escapeCsv(row[col.key])).join(","));
  const csv = [header, ...lines].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName || "report.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printRowsReport({ title, columns, rows, summaryCards = [] }) {
  const reportTitle = title || "Module Report";
  const generatedAt = new Date().toLocaleString();

  const htmlRows = rows
    .map(
      (row) =>
        `<tr>${columns
          .map((col) => `<td>${String(row[col.key] ?? "-")}</td>`)
          .join("")}</tr>`,
    )
    .join("");

  const summaryHtml = summaryCards.length
    ? `<section class="summary">${summaryCards
        .map((card) => `<div class="card"><span>${card.label}</span><strong>${card.value}</strong></div>`)
        .join("")}</section>`
    : "";

  const printWindow = window.open("", "_blank", "width=1000,height=700");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>${reportTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
          .header { border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; background: #f8fafc; margin-bottom: 14px; }
          .brand { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
          .brand h1 { margin: 0; font-size: 22px; }
          .brand p { margin: 4px 0 0; font-size: 12px; color: #475569; }
          .meta { text-align: right; font-size: 12px; color: #334155; }
          h2 { margin: 14px 0 8px; }
          p { margin-top: 0; color: #475569; }
          .summary { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin: 16px 0 20px; }
          .card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; }
          .card span { display: block; font-size: 12px; color: #64748b; }
          .card strong { font-size: 18px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-size: 13px; }
          th { background: #f1f5f9; }
          .footer { margin-top: 16px; border-top: 1px solid #cbd5e1; padding-top: 8px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <header class="header">
          <div class="brand">
            <div>
              <h1>School Management System</h1>
              <p>Academic and Financial Reporting</p>
            </div>
            <div class="meta">
              <div><strong>Report:</strong> ${reportTitle}</div>
              <div><strong>Generated:</strong> ${generatedAt}</div>
            </div>
          </div>
        </header>

        <h2>${reportTitle}</h2>
        ${summaryHtml}
        <table>
          <thead>
            <tr>${columns.map((col) => `<th>${col.label}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${htmlRows}
          </tbody>
        </table>

        <footer class="footer">
          <span>School Management System • Confidential Internal Report</span>
          <span>Page 1 of 1</span>
        </footer>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

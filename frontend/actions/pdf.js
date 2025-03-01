

import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Generates and downloads a PDF with the provided data.
 * @param {Array} data - Array of user data objects.
 * @param {String} pledgeType - The type of pledge for which data is being downloaded.
 */
export const handleDownloadPDF = (data, pledgeType) => {
  const doc = new jsPDF();
  const title = `Report for Pledge Type: ${pledgeType || "All Members"}`;

  // Add title to PDF
  doc.setFontSize(16);
  doc.text(title, 14, 20);

  // Table headers and data rows
  const headers = [["Name", "Phone", "Pledged", "Paid", "Remaining"]];
  const rows = data.map((user) => {
    const pledgeData = user.pledges[pledgeType] || 0;
    const paidData =
      user.pledges[
        `paid${pledgeType.charAt(0).toUpperCase() + pledgeType.slice(1)}`
      ] || 0;
    const remainingData = pledgeData - paidData;

    return [
      user.name,
      user.phone,
      pledgeData,
      paidData,
      remainingData,
    ];
  });

  // Add table to PDF
  doc.autoTable({
    startY: 30,
    head: headers,
    body: rows,
  });

  // Save PDF
  doc.save(`pledge_report_${pledgeType || "all"}.pdf`);
};

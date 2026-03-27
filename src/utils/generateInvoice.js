import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (order) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Chinu Inventory Invoice", 14, 20);

  // Client Info
  doc.setFontSize(12);
  doc.text(`Client: ${order.clientName}`, 14, 30);
  doc.text(`Phone: ${order.clientPhone}`, 14, 36);
  doc.text(`Date: ${order.createdAt}`, 14, 42);

  // Items Table
  const tableData = order.items.map(item => {
    const rate = item.rate || item.price || item.sellingPrice || 0;
    return [
      item.productName,
      item.quantity,
      rate,
      item.quantity * rate
    ];
  });

  autoTable(doc, {
    startY: 50,
    head: [["Product", "Qty", "Rate", "Amount"]],
    body: tableData
  });

  // Total
  const finalY = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(12);

    doc.text(`Packing: Rs. ${order.packingCharges || 0}`, 14, finalY);
    doc.text(`Other: Rs. ${order.otherCharges || 0}`, 14, finalY + 8);
    doc.text(`GST: Rs. ${order.gstAmount || 0}`, 14, finalY + 16);

    doc.setFontSize(14);
    doc.text(`Total: Rs. ${order.total || 0}`, 14, finalY + 28);

  // Save
  doc.save(`Invoice_${order.id}.pdf`);
};
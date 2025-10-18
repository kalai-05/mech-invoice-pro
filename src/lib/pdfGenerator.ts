import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  amount: number;
}

export interface InvoiceData {
  clientName: string;
  invoiceDate: string;
  items: InvoiceItem[];
  notes: string;
  invoiceNumber: string;
}

export const generateInvoicePDF = async (data: InvoiceData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add company header
  doc.setFillColor(46, 46, 46); // #2E2E2E
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('MechaInvoice', 15, 20);
  
  doc.setFontSize(10);
  doc.text('Precision Mechanical Engineering', 15, 28);
  doc.text('123 Industrial Ave, Engineering City, EC 12345', 15, 33);
  doc.text('Tel: (555) 123-4567 | Email: info@mechainvoice.com', 15, 38);

  // Invoice details
  doc.setTextColor(46, 46, 46);
  doc.setFontSize(18);
  doc.text('INVOICE', 15, 55);
  
  doc.setFontSize(10);
  doc.text(`Invoice #: ${data.invoiceNumber}`, 15, 65);
  doc.text(`Date: ${data.invoiceDate}`, 15, 71);
  doc.text(`Client: ${data.clientName}`, 15, 77);

  // Items table
  const tableData = data.items.map(item => [
    item.description,
    item.quantity.toString(),
    `$${item.unitPrice.toFixed(2)}`,
    `${item.tax}%`,
    `$${item.amount.toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 85,
    head: [['Description', 'Qty', 'Unit Price', 'Tax', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [46, 46, 46],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 30, halign: 'right' }
    }
  });

  // Calculate totals
  const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalTax = data.items.reduce((sum, item) => sum + ((item.quantity * item.unitPrice * item.tax) / 100), 0);
  const total = subtotal + totalTax;

  const finalY = (doc as any).lastAutoTable.finalY || 85;

  // Totals section
  doc.setFontSize(10);
  doc.text('Subtotal:', 140, finalY + 10);
  doc.text(`$${subtotal.toFixed(2)}`, 180, finalY + 10, { align: 'right' });
  
  doc.text('Tax:', 140, finalY + 16);
  doc.text(`$${totalTax.toFixed(2)}`, 180, finalY + 16, { align: 'right' });
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Total:', 140, finalY + 24);
  doc.text(`$${total.toFixed(2)}`, 180, finalY + 24, { align: 'right' });

  // Notes
  if (data.notes) {
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Notes:', 15, finalY + 35);
    const splitNotes = doc.splitTextToSize(data.notes, 180);
    doc.text(splitNotes, 15, finalY + 42);
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(46, 46, 46);
  doc.rect(0, pageHeight - 20, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('Thank you for your business!', 105, pageHeight - 12, { align: 'center' });
  doc.text('MechaInvoice © 2025 | www.mechainvoice.com', 105, pageHeight - 7, { align: 'center' });

  return doc;
};

export const downloadPDF = async (data: InvoiceData) => {
  const doc = await generateInvoicePDF(data);
  doc.save(`invoice-${data.invoiceNumber}.pdf`);
};

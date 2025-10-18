import { CompanyHeader } from "./CompanyHeader";
import { CompanyFooter } from "./CompanyFooter";
import { InvoiceData } from "@/lib/pdfGenerator";

interface InvoicePreviewProps {
  data: InvoiceData;
}

export const InvoicePreview = ({ data }: InvoicePreviewProps) => {
  const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalTax = data.items.reduce((sum, item) => sum + ((item.quantity * item.unitPrice * item.tax) / 100), 0);
  const total = subtotal + totalTax;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <CompanyHeader />
      
      <div className="p-6 space-y-6">
        {/* Invoice Details */}
        <div className="border-b pb-4">
          <h2 className="text-3xl font-bold text-[#2E2E2E] mb-4">INVOICE</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Invoice Number:</p>
              <p>{data.invoiceNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Date:</p>
              <p>{data.invoiceDate}</p>
            </div>
            <div className="col-span-2">
              <p className="font-semibold">Client:</p>
              <p>{data.clientName}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#2E2E2E] text-white">
              <tr>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-center">Tax %</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.description}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right">${item.unitPrice.toFixed(2)}</td>
                  <td className="p-3 text-center">{item.tax}%</td>
                  <td className="p-3 text-right font-semibold">${item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax:</span>
              <span>${totalTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-[#00C853]">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="border-t pt-4">
            <p className="font-semibold text-sm mb-2">Notes:</p>
            <p className="text-sm text-gray-700">{data.notes}</p>
          </div>
        )}
      </div>

      <CompanyFooter />
    </div>
  );
};

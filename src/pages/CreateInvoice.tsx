import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InvoicePreview } from "@/components/InvoicePreview";
import { downloadPDF, InvoiceData, InvoiceItem } from "@/lib/pdfGenerator";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Download, Eye, ArrowLeft } from "lucide-react";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    clientName: "",
    invoiceDate: new Date().toISOString().split('T')[0],
    items: [
      { description: "", quantity: 1, unitPrice: 0, tax: 0, amount: 0 }
    ],
    notes: "",
    invoiceNumber: `INV-${Date.now()}`
  });

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: "", quantity: 1, unitPrice: 0, tax: 0, amount: 0 }]
    });
  };

  const removeItem = (index: number) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData({
        ...invoiceData,
        items: invoiceData.items.filter((_, i) => i !== index)
      });
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...invoiceData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate amount
    const quantity = newItems[index].quantity;
    const unitPrice = newItems[index].unitPrice;
    const tax = newItems[index].tax;
    newItems[index].amount = quantity * unitPrice * (1 + tax / 100);
    
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const saveInvoice = async () => {
    try {
      await addDoc(collection(db, "invoices"), {
        ...invoiceData,
        createdAt: new Date().toISOString()
      });
      
      toast({
        title: "Invoice saved!",
        description: "Invoice has been saved to database.",
      });
      
      navigate("/invoices");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving invoice",
        description: error.message,
      });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await downloadPDF(invoiceData);
      toast({
        title: "PDF downloaded!",
        description: "Invoice has been saved as PDF.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error generating PDF",
        description: error.message,
      });
    }
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Edit
            </Button>
            <Button onClick={saveInvoice} className="bg-accent hover:bg-accent-green-hover">
              <Save className="mr-2 h-4 w-4" />
              Save Invoice
            </Button>
            <Button onClick={handleDownloadPDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
          <InvoicePreview data={invoiceData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Create Invoice</h1>
          <Button onClick={() => setShowPreview(true)} className="bg-accent hover:bg-accent-green-hover">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>

        <div className="bg-card rounded-lg p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceData.invoiceNumber}
                onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceData.invoiceDate}
                onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={invoiceData.clientName}
                onChange={(e) => setInvoiceData({ ...invoiceData, clientName: e.target.value })}
                placeholder="Enter client name"
              />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Items</Label>
              <Button onClick={addItem} size="sm" className="bg-accent hover:bg-accent-green-hover">
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            {invoiceData.items.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Item {index + 1}</span>
                  {invoiceData.items.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="md:col-span-2 space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      placeholder="Item description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit Price ($)</Label>
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax (%)</Label>
                    <Input
                      type="number"
                      value={item.tax}
                      onChange={(e) => updateItem(index, "tax", parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold">
                    Amount: ${item.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={invoiceData.notes}
              onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
              placeholder="Add any additional notes or terms..."
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button onClick={() => setShowPreview(true)} className="bg-accent hover:bg-accent-green-hover">
              <Eye className="mr-2 h-4 w-4" />
              Preview & Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, Trash2, Download } from "lucide-react";
import { InvoiceData, downloadPDF } from "@/lib/pdfGenerator";

interface SavedInvoice extends InvoiceData {
  id: string;
  createdAt: string;
}

const InvoiceList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<SavedInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "invoices"));
      const invoiceData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SavedInvoice[];
      
      setInvoices(invoiceData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading invoices",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    
    try {
      await deleteDoc(doc(db, "invoices", id));
      setInvoices(invoices.filter(inv => inv.id !== id));
      toast({
        title: "Invoice deleted",
        description: "Invoice has been removed.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting invoice",
        description: error.message,
      });
    }
  };

  const handleDownload = async (invoice: SavedInvoice) => {
    try {
      await downloadPDF(invoice);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Invoice History</h1>
          <div className="w-20" />
        </div>

        {invoices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold mb-2">No invoices yet</p>
              <p className="text-muted-foreground mb-4">Create your first invoice to get started</p>
              <Button onClick={() => navigate("/create")} className="bg-accent hover:bg-accent-green-hover">
                Create Invoice
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {invoices.map((invoice) => {
              const total = invoice.items.reduce((sum, item) => sum + item.amount, 0);
              
              return (
                <Card key={invoice.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{invoice.invoiceNumber}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {invoice.clientName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-accent">
                          ${total.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(invoice)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteInvoice(invoice.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;

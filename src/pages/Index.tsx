import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { ImageSlider } from "@/components/ImageSlider";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { FileText, LogOut, Plus, History } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (!currentUser) {
        navigate("/auth");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate("/auth");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="MechaInvoice" className="w-12 h-12" />
            <div>
              <h1 className="text-xl font-bold">MechaInvoice</h1>
              <p className="text-xs text-muted-foreground">Precision Engineering</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:block">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Banner Slider */}
        <section>
          <ImageSlider />
        </section>

        {/* Welcome Section */}
        <section className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Professional Invoice Management
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create, manage, and download professional invoices for your mechanical engineering business with ease.
          </p>
        </section>

        {/* Action Cards */}
        <section className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/create")}
            className="group relative overflow-hidden rounded-lg border-2 border-accent bg-card p-8 text-left transition-all hover:shadow-xl hover:scale-105"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-accent text-white">
                  <Plus className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold">Create Invoice</h3>
              </div>
              <p className="text-muted-foreground">
                Generate a new professional invoice with our easy-to-use form
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => navigate("/invoices")}
            className="group relative overflow-hidden rounded-lg border-2 border-border bg-card p-8 text-left transition-all hover:shadow-xl hover:scale-105"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-primary text-primary-foreground">
                  <History className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold">View History</h3>
              </div>
              <p className="text-muted-foreground">
                Access and manage all your previously created invoices
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </section>

        {/* Features */}
        <section className="max-w-4xl mx-auto pt-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="flex justify-center">
                <FileText className="h-12 w-12 text-accent" />
              </div>
              <h4 className="font-semibold">A4 Format</h4>
              <p className="text-sm text-muted-foreground">
                Professional letterhead with company branding
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center">
                <svg className="h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-semibold">PDF Export</h4>
              <p className="text-sm text-muted-foreground">
                Download invoices as print-ready PDF files
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center">
                <svg className="h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h4 className="font-semibold">Cloud Storage</h4>
              <p className="text-sm text-muted-foreground">
                Securely store all your invoices in Firebase
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;

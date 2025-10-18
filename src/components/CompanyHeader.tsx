import logo from "@/assets/logo.png";

export const CompanyHeader = () => {
  return (
    <div className="bg-[#2E2E2E] text-white p-6 rounded-t-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logo} alt="MechaInvoice" className="w-16 h-16" />
          <div>
            <h1 className="text-2xl font-bold">MechaInvoice</h1>
            <p className="text-sm text-gray-300">Precision Mechanical Engineering</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <p>123 Industrial Avenue</p>
          <p>Engineering City, EC 12345</p>
          <p className="mt-1">Tel: (555) 123-4567</p>
          <p>Email: info@mechainvoice.com</p>
        </div>
      </div>
    </div>
  );
};

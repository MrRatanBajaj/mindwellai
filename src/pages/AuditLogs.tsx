import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AuditLogViewer from '@/components/ui-custom/AuditLogViewer';

export default function AuditLogs() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-mindwell-50 to-white">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Audit Logs</h1>
            <p className="text-muted-foreground">
              Complete access history of your medical data for HIPAA compliance and transparency
            </p>
          </div>
          
          <AuditLogViewer />
        </div>
      </main>

      <Footer />
    </div>
  );
}
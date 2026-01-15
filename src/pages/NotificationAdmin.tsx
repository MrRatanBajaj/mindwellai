import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { NotificationAdmin } from "@/components/ui-custom/NotificationAdmin";

const NotificationAdminPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Notification Dashboard
          </h1>
          <NotificationAdmin />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotificationAdminPage;

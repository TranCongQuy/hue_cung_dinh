import { Outlet } from "react-router";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { ToastContainer } from "../components/common/UI";
import { CartDrawer } from "../components/common/CartDrawer";

export function RootLayout() {
  return (
    <div className="root-layout-wrapper">
      <Header />
      <main className="root-main-content">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
      <CartDrawer />
    </div>
  );
}


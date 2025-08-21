import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./pages/Layouts/AppLayout";
import HomePage from "./pages/HomePage.jsx";
import KiosPage from "./pages/KiosPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import DetailMenuPage from "./pages/DetailMenuPage.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";
import TimeEstimatePage from "./pages/TimeEstimatePage.jsx";
import { CartProvider } from "./context/CartContext"; // 1. Import Provider

function App() {
  // Semua logika state dan useEffect sudah dipindahkan ke CartProvider
  return (
    // 2. Bungkus semua rute dengan CartProvider
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            {/* 3. Halaman-halaman ini tidak perlu lagi menerima props keranjang */}
            <Route index element={<HomePage />} />
            <Route path="KiosPage" element={<KiosPage />} />
            <Route path="MenuPage/:kiosId" element={<MenuPage />} />
            <Route path="DetailMenuPage/:id" element={<DetailMenuPage />} />
            <Route
              path="OrderConfirmationPage"
              element={<OrderConfirmationPage />}
            />
            <Route path="TimeEstimatePage" element={<TimeEstimatePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

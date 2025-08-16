import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AppLayout from "./pages/Layouts/AppLayout";
import HomePage from "./pages/HomePage.jsx";
import KiosPage from "./pages/KiosPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import DetailMenuPage from "./pages/DetailMenuPage.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";

const menuItemsData = [
  {
    id: 1,
    name: "Nasi Katsu",
    price: 15000,
    description: "Teh manis segar dingin atau panas sesuai selera",
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Nasi Ayam Teriyaki",
    price: 18000,
    description: "Teh manis segar dingin atau panas sesuai selera",
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Mie Hot Plate",
    price: 20000,
    description: "Nasi dengan ayam katsu renyah disajikan dengan saus spesial",
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Ayam Crispy",
    price: 17000,
    description: "Nasi dengan ayam katsu renyah disajikan dengan saus spesial",
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&q=80",
  },
];

function App() {
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route
            index
            element={
              <HomePage
                cart={cart}
                setCart={setCart}
                showCart={showCart}
                setShowCart={setShowCart}
              />
            }
          />
          <Route
            path="KiosPage"
            element={
              <KiosPage
                cart={cart}
                setCart={setCart}
                showCart={showCart}
                setShowCart={setShowCart}
              />
            }
          />

          <Route
            path="MenuPage/:kiosId"
            element={
              <MenuPage
                cart={cart}
                setCart={setCart}
                showCart={showCart}
                setShowCart={setShowCart}
              />
            }
          />
          <Route
            path="DetailMenuPage/:id"
            element={
              <DetailMenuPage
                cart={cart}
                setCart={setCart}
                showCart={showCart}
                setShowCart={setShowCart}
                menuItems={menuItemsData}
              />
            }
          />

          <Route
            path="OrderConfirmationPage"
            element={<OrderConfirmationPage cart={cart} setCart={setCart} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

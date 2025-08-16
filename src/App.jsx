import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AppLayout from "./pages/Layouts/AppLayout";
import HomePage from "./pages/HomePage.jsx";
import KiosPage from "./pages/KiosPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import DetailMenuPage from "./pages/DetailMenuPage.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";

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

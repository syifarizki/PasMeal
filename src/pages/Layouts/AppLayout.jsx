import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <main id="maincontent">
      <Outlet />
    </main>
  );
};

export default AppLayout;

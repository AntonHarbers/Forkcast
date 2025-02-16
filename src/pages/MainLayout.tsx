import { Outlet } from "react-router";
import Navbar from "../components/Navbar";


export default function MainLayout() {

  return (
    <>
      <div className="sticky top-0 z-50 ">
        <Navbar />

      </div>
      <Outlet />
    </>
  );
}

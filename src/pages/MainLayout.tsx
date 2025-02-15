import { Outlet } from "react-router";
import Navbar from "../components/Navbar";


export default function MainLayout() {

  return (
    <>
      <div className="sticky top-0 ">
        <Navbar />

      </div>
      <Outlet />
    </>
  );
}

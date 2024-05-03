import { Button } from "@/components/ui/button";
import { Outlet } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
        <div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
          <div className="flex h-14 items-center justify-between border-b border-zinc-200">
            <div className="flex z-40 font-semibold">ReactFlowCraft</div>

            <div className="hidden items-center space-x-4 sm:flex text-blue-600">
              {/* <Button style={{color: 'rgb(37, 99, 235)'}} >Sign In</Button> */}
              <Button variant="ghost">Sign In</Button>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

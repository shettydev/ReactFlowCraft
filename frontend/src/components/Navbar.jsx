import { Button } from "@/components/ui/button";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logoutUserQuery } from "../api/auth";
import { toast } from "sonner";
import LogoImage from "../assets/logo.png";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const userLogout = logoutUserQuery();

  const navigate = useNavigate();

  // Checking if the user is already logged in
  useEffect(() => {
    setUserLoggedIn(
      window.localStorage.getItem("token") === "true" ? true : false
    );
    if (window.localStorage.getItem("token") === "false") {
      navigate("/signin");
      toast.warning("User not logged in.");
    }
  }, [window.localStorage.getItem("token")]);

  // Sign out function handler
  const onClick = () => {
    userLogout.mutate();
    window.localStorage.setItem("token", false);
    toast.error("User logged out.");
    navigate("/");
  };

  return (
    <>
      <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
        <div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
          <div className="flex h-14 items-center justify-between border-b border-zinc-200">
            <div className="flex z-40 font-semibold">
              <NavLink to="/">
                <Button
                  variant="link"
                  className="hover:text-blue-600 transition-all"
                >
                  <img src={LogoImage} className="w-12 h-12" />
                  ReactFlowCraft
                </Button>
              </NavLink>
            </div>

            <div className="hidden items-center space-x-4 sm:flex text-blue-600">
              {userLoggedIn ? (
                <>
                  <NavLink to="/dashboard">
                    <Button variant="ghost" className="text-sm">
                      Dashboard
                    </Button>
                  </NavLink>
                  <Button
                    onClick={onClick}
                    variant="ghost"
                    className="text-sm text-zinc-600 hover:text-red-500"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <NavLink to="/signin">
                    <Button variant="ghost" className="text-sm">
                      Sign In
                    </Button>
                  </NavLink>
                  <NavLink to="/signup">
                    <Button variant="ghost" className="text-sm">
                      Sign Up
                    </Button>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}

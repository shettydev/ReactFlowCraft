import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Ghost } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Dashboard() {
  const [isLoading, setLoading] = useState(false);

  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setUserLoggedIn(
      window.localStorage.getItem("token") === "true" ? true : false
    );

    if (window.localStorage.getItem("token") === "false") {
      navigate("/signin");
      toast.warning("User not logged in.");
    }
  }, [window.localStorage.getItem("token")]);

  return (
    <div className="w-full h-screen grainy">
      <main className="mx-auto max-w-7xl md:p-10">
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
          <h1 className="mb-3 font-bold text-5xl text-gray-900">My Flows</h1>

          <NavLink to="/workflow">
            <Button
              variant="secondary"
              className="bg-blue-600 text-white hover:bg-blue-500 transition-all"
            >
              Upload
            </Button>
          </NavLink>
        </div>

        {/* display all user files */}
        {false ? (
          <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
            <li>
              <a
                href="#"
                className="flex items-center justify-between rounded-lg p-4 text-sm hover:bg-zinc-100"
              >
                Hi
              </a>
            </li>
          </ul>
        ) : isLoading ? (
          <Skeleton height={100} className="my-2" count={3} />
        ) : (
          <div className="mt-16 flex flex-col items-center gap-2">
            <Ghost className="h-8 w-8 text-zinc-800" />
            <h3 className="font-semibold text-xl">Pretty empty around here</h3>
            <p>Let&apos;s upload your first React Flow.</p>
          </div>
        )}
      </main>
    </div>
  );
}

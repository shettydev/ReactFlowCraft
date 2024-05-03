import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Page404 from "./components/Page404";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

function App() {
  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      errorElement: <Page404 />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "signin",
          element: <SignIn />,
        },
        {
          path: "signup",
          element: <SignUp />,
        },
      ],
    },
  ]);

  return <RouterProvider router={browserRouter} />;
}

export default App;

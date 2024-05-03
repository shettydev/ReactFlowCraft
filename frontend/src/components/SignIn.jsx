import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { loginUserQuery } from "../api/auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function SignIn() {
  const loginUser = loginUserQuery();

  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);

  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    setUserLoggedIn(
      window.localStorage.getItem("token") === "true" ? true : false
    );

    if (window.localStorage.getItem("token") === "true") {
      navigate("/dashboard");
      toast.warning("User is already logged in.");
    }
  }, [window.localStorage.getItem("token")]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // console.log(data);
    loginUser.mutate(data, {
      onSuccess: (data) => {
        toast.success("User logged in!");
        navigate("/dashboard");
        window.localStorage.setItem("token", true);
      },
      onError: (err) => {
        console.log("ERROR", err);
        toast.error("Unable to login.");
      },
    });
  };

  return (
    <>
      <div className="flex h-[92vh] border border-1 w-screen items-center overflow-hidden px-2 grainy">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative flex w-96 flex-col space-y-5 rounded-lg border bg-white px-5 py-10 shadow-2xl sm:mx-auto"
        >
          <div className="-z-10 absolute top-4 left-1/2 h-full w-5/6 -translate-x-1/2 rounded-lg bg-blue-600 sm:-right-10 sm:top-auto sm:left-auto sm:w-full sm:translate-x-0"></div>
          <div className="mx-auto mb-2 space-y-3">
            <h1 className="text-center text-3xl font-bold text-zinc-700">
              Sign in
            </h1>
            <p className="text-gray-500">Sign in to access your account</p>
          </div>

          <div>
            {errors.username && (
              <span className="text-red-500 text-xs">
                This field is required
              </span>
            )}
            <div className="relative mt-2 w-full">
              <input
                type="text"
                id="email"
                className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                placeholder=" "
                {...register("username", {
                  required: true,
                })}
              />
              <label
                for="email"
                className="origin-[0] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 absolute left-1 top-2 z-10 -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300"
              >
                {" "}
                Enter Your Email{" "}
              </label>
            </div>
          </div>

          <div>
            {errors.password && (
              <span className="text-red-500 text-xs">
                This field is required
              </span>
            )}
            <div className="relative mt-2 w-full">
              <input
                type="password"
                id="password"
                className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                placeholder=" "
                {...register("password", {
                  required: true,
                })}
              />
              <label
                for="password"
                className="origin-[0] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 absolute left-1 top-2 z-10 -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300"
              >
                {" "}
                Enter Your Password
              </label>
            </div>
          </div>
          <div className="flex w-full items-center justify-end">
            {/* <button className="shrink-0 inline-block w-36 rounded-lg bg-blue-600 py-3 font-bold text-white">
              Login
            </button> */}
            <Button
              type="submit"
              variant="outline"
              className="hover:bg-blue-600 hover:text-white transition-all"
            >
              Sign In
            </Button>
          </div>
          <p className="text-center text-gray-600">
            Don't have an account?
            <NavLink to="/signup">
              <Button variant="link" className="hover:text-blue-600">
                Sign Up
              </Button>
            </NavLink>
          </p>
        </form>
      </div>
    </>
  );
}

import { Button } from "@/components/ui/button";
import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deleteGraphQuery, getGraphQuery } from "../api/graph";
import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const queryClient = useQueryClient();

  const { isLoading, isError, data: graphs, isFetching } = getGraphQuery();

  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const [deleteLoader, setDeleteLoader] = useState(null);

  const deleteFlow = deleteGraphQuery();

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
        {graphs && graphs.length !== 0 ? (
          <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
            {graphs
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((graph) => (
                <>
                  <li
                    key={graph._id}
                    className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
                  >
                    <NavLink
                      to={`/workflow/${graph._id}`}
                      className="flex flex-col gap-2"
                    >
                      <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                        <div className="flex-1 truncate">
                          <div className="flex items-center space-x-3">
                            <h3 className="truncate text-lg font-medium text-zinc-900">
                              {graph.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </NavLink>

                    <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        {format(new Date(graph.createdAt), "MMM yyyy")}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* <MessageSquare className="h-4 w-4" />
                      mocked */}
                      </div>

                      <Button
                        onClick={() => {
                          setDeleteLoader(graph._id);
                          setTimeout(() => {
                            deleteFlow.mutate(graph._id, {
                              onSuccess: () => {
                                toast.error("Flow deleted.");
                                queryClient.invalidateQueries(["graphs"]);
                                setDeleteLoader(null);
                              },
                              onError: () => {
                                toast.warning("Flow not deleted.");
                                setDeleteLoader(null);
                              },
                            });
                          }, 1000);
                        }}
                        size="sm"
                        className="w-full"
                        variant="destructive"
                      >
                        {/* Todo: add loader */}
                        {deleteLoader === graph._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </li>
                </>
              ))}
          </ul>
        ) : isFetching || isLoading  ? (
          <Skeleton height={100} className="mt-10" count={3} />
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

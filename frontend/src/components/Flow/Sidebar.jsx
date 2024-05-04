import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createGraphQuery } from "@/src/api/graph";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Sidebar({ addNode, setNodes, nodes, edges }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");

  const createGraph = createGraphQuery();

  const navigate = useNavigate();


  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleCreate = () => {
    // Create a new node data object based on the sidebar input
    const newNode = {
      id: Math.random().toString(),
      type: "default",
      data: { label: `${name}(${username})` }, // Customize the label based on the sidebar input
      position: { x: 0, y: 0 }, // You can adjust the position as needed
      //   sourcePosition: "left",
      //   targetPosition: "right",
    };
    // Pass the new node to the parent component for adding it to the workflow
    addNode(newNode);
  };

  return (
    <>
      <aside className="w-full h-full flex flex-col p-4">
        <div className="flex w-full justify-end">
          {/* <Button className="mb-4 bg-blue-600 text-white hover:bg-blue-500">
            Save
          </Button> */}
          <Button
            variant="ghost"
            onClick={() => {
              setNodes([]);
            }}
            className="mb-4 text-red-500 hover:bg-red-400 hover:text-white"
          >
            Clear
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Create a node</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Custom Node</SheetTitle>
              <SheetDescription>
                Make customized node here. Click on create when you're done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" onClick={handleCreate}>
                  Create
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <hr className="my-6" />
        <div className="w-full">
          <div className="my-2">
            <p className="text-zinc-600 text-sm italic">
              You can drag these nodes to the pane on the left.
            </p>
          </div>

          <div className="flex mt-10 flex-col gap-5">
            <Button
              variant="outline"
              className="border-red-200"
              onDragStart={(event) => onDragStart(event, "Send Email")}
              draggable
            >
              Send Email
            </Button>
            <Button
              variant="outline"
              className="border-purple-200"
              onDragStart={(event) => onDragStart(event, "Wait")}
              draggable
            >
              Wait
            </Button>
            <Button
              variant="outline"
              className="border-green-200"
              onDragStart={(event) => onDragStart(event, "Decision")}
              draggable
            >
              Decision
            </Button>
          </div>
        </div>
        <div className="h-full flex items-end justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                // variant="outline"
                className="mb-4 bg-blue-500 hover:bg-blue-400 hover:text-white"
              >
                Save
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Save your workflow</DialogTitle>
                <DialogDescription>
                  Give a name to your workflow. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="title"
                    className="col-span-3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    const data = {
                      name: title,
                      nodes,
                      edges,
                    };

                    console.log(data);

                    createGraph.mutate(data, {
                      onSuccess: (data) => {
                        toast.success("Flow saved.");
                        navigate("/dashboard");
                      },
                      onError: (err) => {
                        console.log("ERROR", err);
                        toast.error("Try again later.");
                      },
                    });
                  }}
                  type="submit"
                >
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </aside>
    </>
  );
}
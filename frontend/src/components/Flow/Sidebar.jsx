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
import { useState } from "react";

export default function Sidebar({ addNode }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleCreate = () => {
    // Create a new node data object based on the sidebar input
    const newNode = {
      id: Math.random().toString(),
      type: "input",
      data: { label: `${name} (${username})` }, // Customize the label based on the sidebar input
      position: { x: 0, y: 0 }, // You can adjust the position as needed
      sourcePosition: "right",
    };
    // Pass the new node to the parent component for adding it to the workflow
    addNode(newNode);
  };

  return (
    <>
      <aside className="w-full flex flex-col p-4">
        <div className="flex w-full justify-end">
          <Button className="mb-4 bg-blue-600 text-white hover:bg-blue-500">
            Save
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Create a node</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" onClick={handleCreate}>
                  Save changes
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
      </aside>
    </>
  );
}

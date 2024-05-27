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
import { createGraphQuery, updateGraphQuery } from "@/src/api/graph";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Info,
  Loader2,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { Controller, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";

export default function PredefinedNodes({ onDragStart, addNode }) {
  const form = useForm();

  const [sourceToggle, setSourceToggle] = useState(false);
  const [targetToggle, setTargetToggle] = useState(false);
  const [selectedButton, setSelectedButton] = useState("");

  // Function for creating the node
  const handleCreate = () => {
    const data = form.getValues();

    if (!data.text || (sourceToggle ? !data.source : !data.target)) {
      toast.error("All fields are required");
      return;
    }

    // // Create a new node data object based on the sidebar input

    const newNode = {
      id: Math.random().toString(),
      type: "custom",
      data: {
        label: `${data.text}`,
        source: data.source,
        target: data.target,
        // color: data.color,
        type: selectedButton,
      },
      position: { x: 0, y: 0 },
    };

    // Pass the new node to the parent component for adding it to the workflow
    addNode(newNode);

    setTargetToggle(false);
    setSourceToggle(false);

    toast.success("Node added");
    form.reset({
      source: "",
      text: "",
    });
  };

  return (
    <Form {...form}>
      {/* Create Text Node */}

      <Sheet>
        <SheetTrigger asChild>
          <div className="flex mt-10 flex-col gap-5">
            <Button
              variant="outline"
              className="border-red-200"
              onDragStart={(event) => onDragStart(event, "Send")}
              onClick={() => setSelectedButton("Send")}
              draggable
            >
              Send
            </Button>

            <Button
              variant="outline"
              className="border-purple-200"
              onDragStart={(event) => onDragStart(event, "Wait")}
              onClick={() => setSelectedButton("Wait")}
              draggable
            >
              Wait
            </Button>

            <Button
              variant="outline"
              className="border-green-200"
              onDragStart={(event) => onDragStart(event, "Decision")}
              onClick={() => setSelectedButton("Decision")}
              draggable
            >
              Decision
            </Button>
          </div>
        </SheetTrigger>

        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {selectedButton === "Send"
                ? "Send"
                : selectedButton === "Decision"
                ? "Decision"
                : "Wait"}{" "}
              Node{" "}
              <span
                className={`px-2.5 ml-2 rounded-xl ${
                  selectedButton === "Send"
                    ? "bg-red-200"
                    : selectedButton === "Decision"
                    ? "bg-green-200"
                    : "bg-purple-200"
                }`}
              ></span>
            </SheetTitle>
            <SheetDescription>
              {selectedButton === "Send"
                ? "Add text for the Send node here. Click on create when you're done."
                : selectedButton === "Decision"
                ? "Add text for the Decision node here. Click on create when you're done."
                : "Add text for the Wait node here. Click on create when you're done."}
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[450px]">
            <div className="grid gap-10 py-4 px-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Text
                </Label>
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <>
                      <FormControl>
                        <Textarea
                          className="col-span-3 w-full"
                          placeholder="Enter text here..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs col-span-4 w-full text-center" />
                    </>
                  )}
                />
              </div>

              {/* Source Switch */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="flex gap-2">
                          Source
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-zinc-300">
                        <p className="text-xs">
                          A node can have only one source
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>

                <Switch
                  checked={sourceToggle}
                  onCheckedChange={() => {
                    // if (!targetToggle) {
                    setSourceToggle(!sourceToggle);
                    // } else {
                    //   toast.error("Source and target cannot be enabled.");
                    // }
                  }}
                  className="col-span-3"
                />
              </div>

              {/* Source Group */}
              {sourceToggle && (
                <>
                  <Controller
                    name="source"
                    control={form.control}
                    render={({ field }) => (
                      <>
                        <FormControl>
                          <ToggleGroup
                            type="single"
                            className="grid grid-cols-4 items-center gap-4"
                            variant="outline"
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <div className="col-span-4 text-center">
                              <ToggleGroupItem
                                value="Top"
                                className={`${
                                  field.value === "Top" ? "bg-green-200" : ""
                                }`}
                              >
                                <ArrowUp />
                              </ToggleGroupItem>
                            </div>
                            <div className="col-span-4 gap-6 flex justify-between">
                              <ToggleGroupItem
                                value="Left"
                                className={`${
                                  field.value === "Left" ? "bg-green-200" : ""
                                }`}
                              >
                                <ArrowLeft />
                              </ToggleGroupItem>
                              <div className="border border-1 border-zinc-800 rounded-md px-6 flex items-center">
                                <p className="text-center text-xs">
                                  Select the direction of the source
                                </p>
                              </div>
                              <ToggleGroupItem
                                value="Right"
                                className={`${
                                  field.value === "Right" ? "bg-green-200" : ""
                                }`}
                              >
                                <ArrowRight />
                              </ToggleGroupItem>
                            </div>
                            <div className="col-span-4 text-center">
                              <ToggleGroupItem
                                value="Bottom"
                                className={`${
                                  field.value === "Bottom" ? "bg-green-200" : ""
                                }`}
                              >
                                <ArrowDown />
                              </ToggleGroupItem>
                            </div>
                          </ToggleGroup>
                        </FormControl>
                        <FormMessage className="text-xs col-span-4 w-full text-center" />
                      </>
                    )}
                  />
                </>
              )}

              {/* Toggle Switch */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="flex gap-2">
                          Target
                          <Info className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-zinc-300">
                        <p className="text-xs">
                          Source and Target cannot have the same direction
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Switch
                  checked={targetToggle}
                  onCheckedChange={() => {
                    // if (!sourceToggle) {
                    setTargetToggle(!targetToggle);
                    // } else {
                    //   toast.error("Source and target cannot be enabled.");
                    // }
                  }}
                  className="col-span-3"
                />
              </div>

              {/* Toggle Group */}
              {targetToggle && (
                <>
                  <Controller
                    name="target"
                    control={form.control}
                    render={({ field }) => (
                      <>
                        <FormControl>
                          <ToggleGroup
                            type="single"
                            className="grid grid-cols-4 items-center gap-4"
                            variant="outline"
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <div className="col-span-4 text-center">
                              <ToggleGroupItem
                                value="Top"
                                className={`${
                                  form.getValues().source === "Top" &&
                                  "opacity-50 cursor-not-allowed"
                                }`}
                                disabled={
                                  form.getValues().source === "Top"
                                    ? true
                                    : false
                                }
                              >
                                <ArrowUp />
                              </ToggleGroupItem>
                            </div>
                            <div className="col-span-4 gap-6 flex items-center justify-between">
                              <ToggleGroupItem
                                value="Left"
                                className={`${
                                  form.getValues().source === "Left" &&
                                  "opacity-50 cursor-not-allowed"
                                }`}
                                disabled={
                                  form.getValues().source === "Left"
                                    ? true
                                    : false
                                }
                              >
                                <ArrowLeft />
                              </ToggleGroupItem>
                              <div className="border border-1 border-zinc-800 rounded-md px-6 flex items-center">
                                <p className="text-center text-xs">
                                  Select the direction of the target,{" "}
                                  <div className="text-xs text-zinc-500">
                                    (Only source will connect to this point)
                                  </div>
                                </p>
                              </div>
                              <ToggleGroupItem
                                value="Right"
                                className={`${
                                  form.getValues().source === "Right" &&
                                  "opacity-50 cursor-not-allowed"
                                }`}
                                disabled={
                                  form.getValues().source === "Right"
                                    ? true
                                    : false
                                }
                              >
                                <ArrowRight />
                              </ToggleGroupItem>
                            </div>
                            <div className="col-span-4 text-center">
                              <ToggleGroupItem
                                value="Bottom"
                                className={`${
                                  form.getValues().source === "Bottom" &&
                                  "opacity-50 cursor-not-allowed"
                                }`}
                                disabled={
                                  form.getValues().source === "Bottom"
                                    ? true
                                    : false
                                }
                              >
                                <ArrowDown />
                              </ToggleGroupItem>
                            </div>
                          </ToggleGroup>
                        </FormControl>
                        <FormMessage className="text-xs col-span-4 w-full text-center" />
                      </>
                    )}
                  />
                </>
              )}
            </div>
          </ScrollArea>
          <SheetFooter>
            <SheetClose asChild>
              <Button onClick={handleCreate} type="submit">
                Create
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Form>
  );
}

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
  Hand,
  Info,
  Loader2,
  Mouse,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PredefinedNodes from "./PredefinedNodes";
import { Textarea } from "@/components/ui/textarea";

export default function Sidebar({
  addNode,
  setNodes,
  nodes,
  edges,
  data,
  isLoading: graphIsLoading,
  isFetching,
}) {
  const formSchema = z.object({
    text: z.string().min(1, {
      message: "This field cannot be empty.",
    }),
    source: z.string().nonempty({
      message: "Source is required.",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const [sourceToggle, setSourceToggle] = useState(false);
  const [targetToggle, setTargetToggle] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createGraph = createGraphQuery();
  const updateGraph = updateGraphQuery();

  const queryClient = useQueryClient();

  useEffect(() => {
    setTitle(data?.name || "");
  }, [graphIsLoading, isFetching]);

  const navigate = useNavigate();

  // Dragging the node
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // Creating a node
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
      },
      position: { x: 0, y: 0 },
      // sourcePosition: sourceToggle ? data.source : null,
      // targetPosition: targetToggle ? data.target : null,
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

  // Saving the flow
  const handleSave = () => {
    setIsLoading(true);

    const nodeIdsWithEdges = new Set(
      edges.flatMap((edge) => [edge.source, edge.target])
    );
    const nodesWithoutEdges = nodes.filter(
      (node) => !nodeIdsWithEdges.has(node.id)
    );

    // Validation check: if there are no nodes
    if (nodes.length < 1) {
      toast.warning("There are no nodes to save.");
      setIsLoading(false);
      return;
    }

    // Validation check: if there are more than 1 node
    if (nodesWithoutEdges.length > 1) {
      toast.warning("There are more than one nodes with no connections.");
      setIsLoading(false);
      return;
    }

    const finalData = {
      name: title,
      nodes,
      edges,
    };

    if (data) {
      finalData.id = data._id;

      // API called to update the data
      updateGraph.mutate(finalData, {
        onSuccess: (data) => {
          toast.success("Flow updated.");
          navigate("/dashboard");
          queryClient.invalidateQueries(["graphs"]);
          setIsLoading(false);
        },
        onError: (err) => {
          console.log("ERROR", err);
          toast.error("Try again later.");
          setIsLoading(false);
        },
      });
    } else {

      // API call to create the data
      createGraph.mutate(finalData, {
        onSuccess: (data) => {
          toast.success("Flow saved.");
          navigate("/dashboard");
          setIsLoading(false);
        },
        onError: (err) => {
          console.log("ERROR", err);
          toast.error("Try again later.");
          setIsLoading(false);
        },
      });
    }
  };

  return (
    <>
      <aside className="w-full h-full flex flex-col p-4">
        <div className="flex w-full justify-end">
          <Button
            variant="ghost"
            onClick={() => {
              setNodes([]);
              toast.error("All nodes & edges cleared.");
            }}
            className="mb-4 text-red-500 hover:bg-red-400 hover:text-white"
          >
            Clear
          </Button>
        </div>

        {/* Custom node form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreate)}>
            {/* Create Text Node */}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">Create a node</Button>
              </SheetTrigger>

              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Custom Node</SheetTitle>
                  <SheetDescription>
                    Make customized node here. Click on create when you're done.
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
                                        field.value === "Top"
                                          ? "bg-green-200"
                                          : ""
                                      }`}
                                    >
                                      <ArrowUp />
                                    </ToggleGroupItem>
                                  </div>
                                  <div className="col-span-4 gap-6 flex justify-between">
                                    <ToggleGroupItem
                                      value="Left"
                                      className={`${
                                        field.value === "Left"
                                          ? "bg-green-200"
                                          : ""
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
                                        field.value === "Right"
                                          ? "bg-green-200"
                                          : ""
                                      }`}
                                    >
                                      <ArrowRight />
                                    </ToggleGroupItem>
                                  </div>
                                  <div className="col-span-4 text-center">
                                    <ToggleGroupItem
                                      value="Bottom"
                                      className={`${
                                        field.value === "Bottom"
                                          ? "bg-green-200"
                                          : ""
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
                                          (Only source will connect to this
                                          point)
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
          </form>
        </Form>
        <hr className="my-6" />

        {/* Predefined Nodes */}
        <div className="w-full">
          <div className="my-2">
            <p className="text-zinc-600 text-xs italic flex">
              <Hand className="h-4 w-4 mr-2" />
              You can drag these nodes to the pane on the left.
            </p>

            <p className="text-zinc-600 text-xs italic flex mt-4">
              <Mouse className="h-4 w-4 mr-2" /> Or you can click on them
              to customize.
            </p>
          </div>

          <PredefinedNodes addNode={addNode} onDragStart={onDragStart} />
        </div>

        {/* Save workflow & Modal */}
        <div className="h-full flex items-end justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                // variant="outline"
                disabled={graphIsLoading || isFetching}
                className="mb-4 bg-blue-500 hover:bg-blue-400 hover:text-white"
              >
                Save
              </Button>
            </DialogTrigger>

            {/* Workflow Name Modal */}
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
                <Button onClick={handleSave} type="submit">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </aside>
    </>
  );
}

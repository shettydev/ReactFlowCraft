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
import { Textarea } from "@/components/ui/textarea";

export function EditNode({
  editText,
  handleTextChange,
  handleSave,
  handleDelete,
  open,
  setOpen,
}) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit text</SheetTitle>
          <SheetDescription>
            Make changes to your node text here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text" className="text-right">
              Text
            </Label>
            <Textarea
              id="text"
              value={editText}
              onChange={handleTextChange}
              className="col-span-3"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose className="flex w-full h-full justify-between">
            <Button
              variant="outline"
              onClick={handleDelete}
              className="hover:bg-red-500 hover:text-white transition-all"
            >
              Delete
            </Button>
            <Button type="button" onClick={handleSave}>
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

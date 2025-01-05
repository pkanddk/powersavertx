import { SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function AuthHeader() {
  return (
    <SheetHeader>
      <SheetTitle className="text-left">
        <div className="flex items-center gap-2">
          <img
            src="/lovable-uploads/744a7305-260a-491c-bf1a-b65c96416fdf.png"
            alt="Power Saver TX Logo"
            className="h-10 w-10"
          />
          <span>Power Saver TX</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            Beta
          </span>
        </div>
      </SheetTitle>
    </SheetHeader>
  );
}
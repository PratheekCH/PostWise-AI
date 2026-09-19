import { Dialog, DialogContent } from "@/components/ui/dialog";

export const FullScreenModal = ({ open, onOpenChange, children }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      className="fixed inset-0 m-0 max-w-none rounded-none border-0 p-0 overflow-hidden"
    >
      {children}
    </DialogContent>
  </Dialog>
);

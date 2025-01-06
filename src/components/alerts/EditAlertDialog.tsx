import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertSettings } from "@/pages/ManageAlerts";

interface EditAlertDialogProps {
  alert: AlertSettings | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (alert: AlertSettings, newThreshold: number) => Promise<void>;
}

export function EditAlertDialog({ alert, isOpen, onClose, onSave }: EditAlertDialogProps) {
  const [newThreshold, setNewThreshold] = useState(alert?.price_threshold.toString() || "");

  const handleSave = async () => {
    if (!alert) return;
    await onSave(alert, parseFloat(newThreshold));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Price Alert</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>New Price Threshold (¢/kWh)</Label>
            <Input
              type="number"
              step="0.1"
              value={newThreshold}
              onChange={(e) => setNewThreshold(e.target.value)}
              placeholder="e.g., 12.5"
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
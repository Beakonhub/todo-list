"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PRESET_COLORS = ["#EE6B5C", "#3B7DDD", "#2FB872", "#F5A623", "#9B59B6", "#1ABC9C"];

export function CategoryFormDialog({
  open,
  onClose,
  onSubmit,
  initialName = "",
  initialColor = PRESET_COLORS[0],
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; color: string }) => Promise<void>;
  initialName?: string;
  initialColor?: string;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={initialName ? "Edit category" : "New category"}>
      {/* Keyed by `open` so state resets to fresh initial values each time the dialog opens */}
      <CategoryForm key={String(open)} onClose={onClose} onSubmit={onSubmit} initialName={initialName} initialColor={initialColor} />
    </Dialog>
  );
}

function CategoryForm({
  onClose,
  onSubmit,
  initialName,
  initialColor,
}: {
  onClose: () => void;
  onSubmit: (values: { name: string; color: string }) => Promise<void>;
  initialName: string;
  initialColor: string;
}) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);
  const [submitting, setSubmitting] = useState(false);

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitting(true);
          await onSubmit({ name, color });
          setSubmitting(false);
          onClose();
        }}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="category-name">Name</Label>
          <Input
            id="category-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Personal"
          />
        </div>
        <div>
          <Label>Color</Label>
          <div className="flex gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Select color ${c}`}
                onClick={() => setColor(c)}
                className={cn(
                  "h-7 w-7 rounded-full border-2",
                  color === c ? "border-strip" : "border-transparent"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            Save
          </Button>
        </div>
      </form>
    </>
  );
}

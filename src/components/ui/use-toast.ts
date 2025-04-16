"use client";

import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
};

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    if (variant === "destructive") {
      sonnerToast.error(title, {
        description,
      });
    } else if (variant === "success") {
      sonnerToast.success(title, {
        description,
      });
    } else {
      sonnerToast(title, {
        description,
      });
    }
  };

  return { toast };
} 
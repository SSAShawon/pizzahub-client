"use client";

import { toast as sonnerToast } from "sonner";

type ToastKind = "success" | "error" | "warning" | "info";

const durations: Record<ToastKind, number> = {
  success: 3500,
  error: 5000,
  warning: 5000,
  info: 4000,
};

const show = (kind: ToastKind, message: string, id?: string) => {
  sonnerToast[kind](message, {
    id: id ?? message,
    duration: durations[kind],
  });
};

export const notify = {
  success: (message: string, id?: string) => show("success", message, id),
  error: (message: string, id?: string) => show("error", message, id),
  warning: (message: string, id?: string) => show("warning", message, id),
  info: (message: string, id?: string) => show("info", message, id),
};

export function messageFromError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error) {
    return error;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message
  ) {
    return error.message;
  }

  return fallback;
}

export function notifyError(error: unknown, fallback: string, id?: string) {
  notify.error(messageFromError(error, fallback), id ?? fallback);
}

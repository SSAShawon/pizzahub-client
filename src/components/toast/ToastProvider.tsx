"use client";

import { Toaster } from "sonner";
import "./toast.css";

export default function ToastProvider() {
  return (
    <Toaster
      className="pizzahub-toaster"
      position="top-right"
      duration={4000}
      closeButton
      visibleToasts={4}
      mobileOffset="1rem"
      toastOptions={{
        classNames: {
          toast: "pizzahub-toast",
          title: "pizzahub-toast-title",
          description: "pizzahub-toast-description",
          closeButton: "pizzahub-toast-close",
          icon: "pizzahub-toast-icon",
        },
      }}
    />
  );
}

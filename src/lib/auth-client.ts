
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://pizzahub-ssas.vercel.app",

  fetchOptions: {
    credentials: "include",
  },

  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: ["customer", "vendor", "admin"],
          required: false,
        },
        isBlocked: {
          type: "boolean",
          required: false,
        },
        deliveryAddress: {
          type: "string",
          required: false,
        },
        phoneNumber: {
          type: "string",
          required: false,
        },
      },
    }),
  ],
});

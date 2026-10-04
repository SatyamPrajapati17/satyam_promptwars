import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional().default(""),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional().default(""),
  NEXT_PUBLIC_GOOGLE_AUTH_ENABLED: z
    .string()
    .optional()
    .default("false")
    .transform((val) => val === "true"),
});

const serverEnvSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().optional().default(""),
  NVIDIA_API_KEY: z.string().optional().default(""),
  NVIDIA_BASE_URL: z.string().default("https://integrate.api.nvidia.com/v1"),
  NVIDIA_MODEL: z.string().default("meta/llama-3.3-70b-instruct"),
  GMAIL_USER: z.string().optional().default(""),
  GMAIL_APP_PASSWORD: z.string().optional().default(""),
  MAIL_FROM_NAME: z.string().default("The Unbias"),
  GOOGLE_SHEETS_CLIENT_EMAIL: z.string().optional().default(""),
  GOOGLE_SHEETS_PRIVATE_KEY: z.string().optional().default(""),
  GOOGLE_SHEETS_SPREADSHEET_ID: z.string().optional().default(""),
  SHEETS_HASH_SALT: z.string().default("FBmQqVTZMp74e5iVTVbLFEPrF5PUVPOcMxy8HjITDgp2ETKM"),
  SHARE_COOKIE_SECRET: z.string().default("gIKPp1P5igbPKxzwIIXWW-h8PbxRpyBoxQtRCyb_2h-AD8aC"),
  CRON_SECRET: z.string().default("o2azw4RSPjq2fzSsL7ca_yRcuomtO_XoUQqY5c_3uXY850Yy"),
  ADMIN_EMAIL: z.string().optional().default(""),
});

const rawPublic = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_GOOGLE_AUTH_ENABLED: process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED,
};

const rawServer = {
  SUPABASE_SECRET_KEY:
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  NVIDIA_API_KEY: process.env.NVIDIA_API_KEY,
  NVIDIA_BASE_URL:
    process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",
  NVIDIA_MODEL: process.env.NVIDIA_MODEL || "meta/llama-3.3-70b-instruct",
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
  MAIL_FROM_NAME: process.env.MAIL_FROM_NAME || "The Unbias",
  GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  GOOGLE_SHEETS_PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
  GOOGLE_SHEETS_SPREADSHEET_ID: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  SHEETS_HASH_SALT:
    process.env.SHEETS_HASH_SALT ||
    "FBmQqVTZMp74e5iVTVbLFEPrF5PUVPOcMxy8HjITDgp2ETKM",
  SHARE_COOKIE_SECRET:
    process.env.SHARE_COOKIE_SECRET ||
    "gIKPp1P5igbPKxzwIIXWW-h8PbxRpyBoxQtRCyb_2h-AD8aC",
  CRON_SECRET:
    process.env.CRON_SECRET ||
    "o2azw4RSPjq2fzSsL7ca_yRcuomtO_XoUQqY5c_3uXY850Yy",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
};

export const publicEnv = publicEnvSchema.parse(rawPublic);

export const serverEnv =
  typeof window === "undefined"
    ? serverEnvSchema.parse(rawServer)
    : ({} as z.infer<typeof serverEnvSchema>);

export function isConfigured(service: "supabase" | "ai" | "sheets" | "gmail") {
  switch (service) {
    case "supabase":
      return Boolean(
        publicEnv.NEXT_PUBLIC_SUPABASE_URL &&
          publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
          serverEnv.SUPABASE_SECRET_KEY
      );
    case "ai":
      return Boolean(serverEnv.NVIDIA_API_KEY);
    case "sheets":
      return Boolean(
        serverEnv.GOOGLE_SHEETS_CLIENT_EMAIL &&
          serverEnv.GOOGLE_SHEETS_PRIVATE_KEY &&
          serverEnv.GOOGLE_SHEETS_SPREADSHEET_ID
      );
    case "gmail":
      return Boolean(serverEnv.GMAIL_USER && serverEnv.GMAIL_APP_PASSWORD);
  }
}

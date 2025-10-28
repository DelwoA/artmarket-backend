import cors from "cors";

// Allowlist comes from env (comma-separated), with sensible defaults for local dev
const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const whitelist = new Set(
  [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://artmarket-frontend.vercel.app",
    ...envOrigins,
  ].filter(Boolean)
);

const corsOptions = {
  optionsSuccessStatus: 200,
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || whitelist.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Creates a CORS middleware with custom origin validation
// Used to control which domains can access the API from browsers
export default cors(corsOptions);

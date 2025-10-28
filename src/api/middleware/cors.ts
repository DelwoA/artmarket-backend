import cors from "cors";

const whitelist = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://artmarket-frontend.vercel.app",
]);

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

// Express is a small, popular web framework. We use it to build our API:
// it gives us an easy way to define routes and run middleware.
import express from "express";
// CORS = Cross-Origin Resource Sharing. Our React app runs on a different
// port (e.g. 5173) than this server (e.g. 3001). Browsers block requests
// between different origins by default, so we enable CORS to allow them.
import cors from "cors";
// Our GitHub routes, kept in their own file to keep this one tidy.
import githubRouter from "./routes/github.js";

// The port to listen on. Hosting platforms (like Render) provide a PORT
// environment variable; locally we fall back to 3001.
const PORT = process.env.PORT || 3001;

// Create the Express application. We attach our middleware and routes to it.
const app = express();

// --- Middleware: small functions that run on every incoming request ---

// Allow the browser frontend to call this API from its own origin.
app.use(cors());
// Parse incoming JSON request bodies and put the result on `req.body`.
// We don't need it yet, but it's standard for an API and harmless here.
app.use(express.json());

// --- Routes ---

// A simple health check. Hitting this confirms the server is alive.
// Hosting platforms also use endpoints like this to monitor the service.
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// All GitHub-related routes live under /api/github
// (for example /api/github/torvalds).
app.use("/api/github", githubRouter);

// --- Central error handler ---
// Express treats a middleware with FOUR arguments as an error handler.
// Whenever a route calls next(err), the request ends up here, so every
// error response is defined in this one place instead of in each route.
// (The `next` argument is unused but must be present for Express to
// recognise this as an error handler.)
app.use((err, req, res, next) => {
  // The requested user doesn't exist on GitHub.
  if (err.code === "not_found") {
    return res.status(404).json({ error: "User not found" });
  }

  // We've hit GitHub's rate limit; ask the user to try again soon.
  if (err.code === "rate_limit") {
    return res
      .status(429)
      .json({ error: "GitHub rate limit reached, please try again shortly" });
  }

  // Anything else: a network problem or an unexpected GitHub response.
  return res.status(502).json({ error: "Could not reach GitHub" });
});

// Start the server and listen for requests. The callback runs once it's ready.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

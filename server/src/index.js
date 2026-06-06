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

// Start the server and listen for requests. The callback runs once it's ready.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

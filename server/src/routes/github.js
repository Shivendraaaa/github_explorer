// This file defines the GitHub-related URLs our backend responds to.
import { Router } from "express";
import { getUser } from "../services/github.js";

// A Router is a mini Express app for grouping related routes. We'll
// mount it under "/api/github" in index.js, so the paths here are
// relative to that.
const router = Router();

// GET /api/github/:username  ->  the user's public profile.
router.get("/:username", async (req, res) => {
  try {
    // req.params.username is the part of the URL the user typed,
    // for example "torvalds" in /api/github/torvalds.
    const profile = await getUser(req.params.username);
    res.json(profile);
  } catch (err) {
    // For now we handle errors right here so the route works on its own.
    // In a later step we'll move this into one central error handler that
    // both routes share, so we don't repeat ourselves.
    if (err.status === 404) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(502).json({ error: "Could not reach GitHub" });
    }
  }
});

export default router;

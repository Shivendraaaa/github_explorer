// This file defines the GitHub-related URLs our backend responds to.
import { Router } from "express";
import { getUser, getRepos } from "../services/github.js";

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

// GET /api/github/:username/repos?page=1  ->  one page of public repos.
router.get("/:username/repos", async (req, res) => {
  try {
    // Read the page number from the query string (?page=2). It's optional,
    // so Number(...) || 1 turns a missing or invalid value into page 1.
    const page = Number(req.query.page) || 1;
    const repos = await getRepos(req.params.username, page);
    res.json(repos);
  } catch (err) {
    // Same error handling as above. We'll centralize this in a later step.
    if (err.status === 404) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(502).json({ error: "Could not reach GitHub" });
    }
  }
});

export default router;

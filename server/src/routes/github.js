// This file defines the GitHub-related URLs our backend responds to.
import { Router } from "express";
import { getUser, getRepos } from "../services/github.js";
import { get, set } from "../utils/cache.js";

// A Router is a mini Express app for grouping related routes. We'll
// mount it under "/api/github" in index.js, so the paths here are
// relative to that.
const router = Router();

// GET /api/github/:username  ->  the user's public profile.
router.get("/:username", async (req, res, next) => {
  try {
    // Use the full request path as the cache key, e.g. "/api/github/torvalds".
    const key = req.originalUrl;

    // If we already have a fresh copy cached, return it right away and
    // label the response HIT so we can see the cache is working.
    const cached = get(key);
    if (cached !== undefined) {
      res.set("x-cache", "HIT");
      return res.json(cached);
    }

    // Otherwise ask GitHub, save the result for next time, then send it.
    // req.params.username is the value from the URL, e.g. "torvalds".
    const profile = await getUser(req.params.username);
    set(key, profile);
    res.set("x-cache", "MISS");
    res.json(profile);
  } catch (err) {
    // Hand the error to the central error handler in index.js, which turns
    // it into the correct status code and message.
    next(err);
  }
});

// GET /api/github/:username/repos?page=1  ->  one page of public repos.
router.get("/:username/repos", async (req, res, next) => {
  try {
    // The cache key is the full path including the page, so each page is
    // cached separately, e.g. "/api/github/torvalds/repos?page=2".
    const key = req.originalUrl;

    const cached = get(key);
    if (cached !== undefined) {
      res.set("x-cache", "HIT");
      return res.json(cached);
    }

    // Read the page number from the query string (?page=2). It's optional,
    // so Number(...) || 1 turns a missing or invalid value into page 1.
    const page = Number(req.query.page) || 1;
    const repos = await getRepos(req.params.username, page);
    set(key, repos);
    res.set("x-cache", "MISS");
    res.json(repos);
  } catch (err) {
    // Hand the error to the central error handler in index.js.
    next(err);
  }
});

export default router;

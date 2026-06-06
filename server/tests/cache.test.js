import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { get, set } from "../src/utils/cache.js";

describe("cache", () => {
  // Fake timers let us control "the clock" so we can test the 60-second
  // expiry instantly, without actually waiting 60 seconds.
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns a value that was just stored", () => {
    set("fresh", { hello: "world" });
    expect(get("fresh")).toEqual({ hello: "world" });
  });

  it("forgets a value after the 60s TTL passes", () => {
    set("stale", "value");
    expect(get("stale")).toBe("value"); // still fresh

    // Jump forward 61 seconds, past the cache's 60-second lifetime.
    vi.advanceTimersByTime(61_000);

    expect(get("stale")).toBeUndefined(); // expired, treated as a miss
  });
});

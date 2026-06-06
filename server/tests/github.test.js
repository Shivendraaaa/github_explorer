import { describe, it, expect, afterEach, vi } from "vitest";
import { getUser } from "../src/services/github.js";

// A small helper to build a fake fetch Response with just the bits our code
// uses: ok, status, a headers.get(), and json().
function fakeResponse({ ok, status, body }) {
  return {
    ok,
    status,
    headers: { get: () => null },
    json: async () => body,
  };
}

describe("getUser", () => {
  afterEach(() => {
    // Undo the fake fetch after each test so tests stay isolated.
    vi.unstubAllGlobals();
  });

  it("throws a 'not_found' error when GitHub returns 404", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => fakeResponse({ ok: false, status: 404, body: {} }))
    );

    await expect(getUser("nope")).rejects.toHaveProperty("code", "not_found");
  });

  it("returns only the trimmed fields for a valid user", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        fakeResponse({
          ok: true,
          status: 200,
          body: {
            login: "octocat",
            name: "The Octocat",
            avatar_url: "http://example.com/a.png",
            bio: "hi",
            followers: 1,
            following: 2,
            public_repos: 3,
            // An extra field our API should NOT pass through.
            email: "secret@example.com",
          },
        })
      )
    );

    const profile = await getUser("octocat");

    expect(profile).toEqual({
      login: "octocat",
      name: "The Octocat",
      avatar_url: "http://example.com/a.png",
      bio: "hi",
      followers: 1,
      following: 2,
      public_repos: 3,
    });
    // The extra field must not leak through.
    expect(profile.email).toBeUndefined();
  });
});

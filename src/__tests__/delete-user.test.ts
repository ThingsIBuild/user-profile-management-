import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// Mock jsonwebtoken before any imports that use it
vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
    sign: vi.fn().mockReturnValue("mock-token"),
  },
}));

// Mock the user services to avoid MongoDB calls
vi.mock("../services/user.services", () => ({
  deleteUserProfile: vi.fn().mockResolvedValue(null),
  getUserProfile: vi.fn().mockResolvedValue(null),
}));

import app from "../app";
import jwt from "jsonwebtoken";
import { deleteUserProfile } from "../services/user.services";

describe("DELETE /api/users/:id - Role-Based Access Control", () => {
  const targetUserId = "target-user-id-456";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(deleteUserProfile).mockResolvedValue(null);
  });

  it("should allow admin user to delete a user (200)", async () => {
    vi.mocked(jwt.verify).mockReturnValue({
      userId: "admin-id-123",
      role: "admin",
    } as any);

    const res = await request(app)
      .delete(`/api/users/${targetUserId}`)
      // Note: cookie name is "acessToken" (one 's') — matches the typo in auth.middleware.ts
      .set("Cookie", ["acessToken=fake-admin-token"]);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User profile deleted successfully");
    expect(deleteUserProfile).toHaveBeenCalledOnce();
    expect(deleteUserProfile).toHaveBeenCalledWith(targetUserId);
  });

  it("should block regular user with 403 Forbidden", async () => {
    vi.mocked(jwt.verify).mockReturnValue({
      userId: "regular-user-789",
      role: "user",
    } as any);

    const res = await request(app)
      .delete(`/api/users/${targetUserId}`)
      .set("Cookie", ["acessToken=fake-user-token"]);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Forbidden");
    expect(deleteUserProfile).not.toHaveBeenCalled();
  });

  it("should return 401 when no token is provided", async () => {
    const res = await request(app).delete(`/api/users/${targetUserId}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(deleteUserProfile).not.toHaveBeenCalled();
  });

  it("should return 401 when token is invalid or expired", async () => {
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error("jwt expired");
    });

    const res = await request(app)
      .delete(`/api/users/${targetUserId}`)
      .set("Cookie", ["acessToken=expired-token"]);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
    expect(jwt.verify).toHaveBeenCalled();
    expect(deleteUserProfile).not.toHaveBeenCalled();
  });
});

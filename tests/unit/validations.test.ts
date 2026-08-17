import { describe, expect, it } from "vitest";
import { createTaskSchema } from "@/lib/validations/task";
import { loginSchema, signupSchema } from "@/lib/validations/auth";
import { createCategorySchema } from "@/lib/validations/category";

describe("createTaskSchema", () => {
  it("accepts a minimal valid task", () => {
    const result = createTaskSchema.safeParse({ title: "Walk the dog" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = createTaskSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid image URL", () => {
    const result = createTaskSchema.safeParse({ title: "x", imageUrl: "not-a-url" });
    expect(result.success).toBe(false);
  });
});

describe("auth schemas", () => {
  it("rejects short passwords on login", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "short" }).success).toBe(false);
  });

  it("accepts a valid signup payload", () => {
    expect(
      signupSchema.safeParse({ name: "Sundar", email: "sundar@example.com", password: "password123" }).success
    ).toBe(true);
  });
});

describe("createCategorySchema", () => {
  it("defaults color when omitted", () => {
    const result = createCategorySchema.parse({ name: "Work" });
    expect(result.color).toBe("#F26A5A");
  });

  it("rejects an invalid hex color", () => {
    expect(createCategorySchema.safeParse({ name: "Work", color: "red" }).success).toBe(false);
  });
});

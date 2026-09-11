import { describe, expect, it } from "vitest";

import { LOGIN_COPY } from "@/copy/login-copy";
import { resetPasswordSchema } from "@/lib/schemas/reset-password-schema";

describe("resetPasswordSchema", () => {
  it("requires at least eight characters", () => {
    const result = resetPasswordSchema.safeParse({
      password: "short",
      confirmPassword: "short",
    });

    expect(result.error?.issues[0]?.message).toBe(
      LOGIN_COPY.resetPassword.errors.tooShort,
    );
  });

  it("requires both passwords to match", () => {
    const result = resetPasswordSchema.safeParse({
      password: "password123",
      confirmPassword: "password456",
    });

    expect(result.error?.issues[0]?.message).toBe(
      LOGIN_COPY.resetPassword.errors.mismatch,
    );
  });
});

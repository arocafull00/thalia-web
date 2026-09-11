import { describe, expect, it } from "vitest";

import { getRecoveryLinkDestination } from "@/lib/auth/recovery-link-route";

describe("getRecoveryLinkDestination", () => {
  it("moves a recovery hash from the dashboard to the reset page", () => {
    const url = new URL(
      "https://thalia-app.es/dashboard#access_token=access&refresh_token=refresh&type=recovery",
    );

    expect(getRecoveryLinkDestination(url)).toBe(
      "/reset-password#access_token=access&refresh_token=refresh&type=recovery",
    );
  });

  it("moves an expired recovery error from login to the reset page", () => {
    const url = new URL(
      "https://thalia-app.es/login#error=access_denied&error_code=otp_expired",
    );

    expect(getRecoveryLinkDestination(url)).toBe(
      "/reset-password#error=access_denied&error_code=otp_expired",
    );
  });

  it("moves an expired recovery query from login to the reset page", () => {
    const url = new URL(
      "https://thalia-app.es/login?error=access_denied&error_code=otp_expired",
    );

    expect(getRecoveryLinkDestination(url)).toBe(
      "/reset-password?error=access_denied&error_code=otp_expired",
    );
  });

  it("does not redirect a recovery link already on the reset page", () => {
    const url = new URL(
      "https://thalia-app.es/reset-password#access_token=access&type=recovery",
    );

    expect(getRecoveryLinkDestination(url)).toBeNull();
  });

  it("does not treat an unrelated login error as password recovery", () => {
    const url = new URL(
      "https://thalia-app.es/login#error=access_denied&error_code=provider_error",
    );

    expect(getRecoveryLinkDestination(url)).toBeNull();
  });
});

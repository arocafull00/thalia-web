const RESET_PASSWORD_PATH = "/reset-password";

export function getRecoveryLinkDestination(url: URL) {
  if (url.pathname === RESET_PASSWORD_PATH) {
    return null;
  }

  const hashParams = new URLSearchParams(url.hash.slice(1));
  const isRecoveryLink = hashParams.get("type") === "recovery";
  const errorCode =
    hashParams.get("error_code") ?? url.searchParams.get("error_code");
  const isExpiredRecoveryLink = errorCode === "otp_expired";

  if (!isRecoveryLink && !isExpiredRecoveryLink) {
    return null;
  }

  return `${RESET_PASSWORD_PATH}${url.search}${url.hash}`;
}

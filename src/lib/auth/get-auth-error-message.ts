const AUTH_ERROR_COPY = {
  default: "No se pudo completar la operación. Inténtalo de nuevo.",
  emailInUse: "Ya existe una cuenta con este email.",
  invalidCredentials: "El email o la contraseña no son correctos.",
  invalidEmail: "Introduce un email válido.",
  passwordTooShort: "La contraseña debe tener al menos 8 caracteres.",
  rateLimited: "Demasiados intentos. Inténtalo de nuevo más tarde.",
  resetLinkExpired:
    "El enlace ha expirado. Solicita un nuevo enlace de recuperación.",
  emailNotConfirmed: "Confirma tu email antes de iniciar sesión.",
} as const;

export function getAuthErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("already registered")) {
    return AUTH_ERROR_COPY.emailInUse;
  }

  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid credentials")
  ) {
    return AUTH_ERROR_COPY.invalidCredentials;
  }

  if (message.includes("email not confirmed")) {
    return AUTH_ERROR_COPY.emailNotConfirmed;
  }

  if (message.includes("invalid email")) {
    return AUTH_ERROR_COPY.invalidEmail;
  }

  if (message.includes("password should be at least")) {
    return AUTH_ERROR_COPY.passwordTooShort;
  }

  if (message.includes("rate limit") || message.includes("too many")) {
    return AUTH_ERROR_COPY.rateLimited;
  }

  if (message.includes("expired")) {
    return AUTH_ERROR_COPY.resetLinkExpired;
  }

  return AUTH_ERROR_COPY.default;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeInviteEmails(emails: string[]): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const raw of emails) {
    const trimmed = raw.trim().toLowerCase();

    if (!trimmed || seen.has(trimmed)) {
      continue;
    }

    seen.add(trimmed);
    normalized.push(trimmed);
  }

  return normalized;
}

export function validateInviteEmails(emails: string[]): string | null {
  const normalized = normalizeInviteEmails(emails);

  if (normalized.length === 0) {
    return null;
  }

  const invalid = normalized.find((email) => !EMAIL_PATTERN.test(email));

  if (invalid) {
    return `Correo no válido: ${invalid}`;
  }

  return null;
}

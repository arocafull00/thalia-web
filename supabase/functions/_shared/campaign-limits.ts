export const MAX_SENT_CAMPAIGNS = 2;
export const MAX_CAMPAIGN_RECIPIENTS = 50;

export const CAMPAIGN_LIMIT_ERROR_CODES = {
  sentLimitReached: "campaign_sent_limit_reached",
  recipientLimitExceeded: "campaign_recipient_limit_exceeded",
  sendInProgress: "campaign_send_in_progress",
} as const;

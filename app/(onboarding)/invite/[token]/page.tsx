import InvitePageClient from "@/components/onboarding/invite-page-client";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function InvitePage({ params }: Props) {
  const { token } = await params;
  return <InvitePageClient token={token} />;
}

import { redirect } from "next/navigation";

export default async function ChatIdRedirect({
  params,
}: {
  params: Promise<{ persona: string; chatId: string }>;
}) {
  const { persona } = await params;
  redirect(`/chat/${persona}`);
}

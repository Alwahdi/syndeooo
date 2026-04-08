import { currentUser } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Metadata } from "next";
import { Header } from "../components/header";
import { MessagesList } from "./messages-list";

export const metadata: Metadata = {
  title: "Messages — SyndeoCare",
  description: "Your conversations",
};

export default async function MessagesPage() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const clinicRole = await database.userRole.findFirst({
    where: { userId: user.id, role: "clinic" },
  });

  const isClinic = !!clinicRole;

  type ConversationResult = {
    id: string;
    clinic?: { id: string; name: string | null; logoUrl: string | null };
    professional?: {
      id: string;
      fullName: string | null;
      avatarUrl: string | null;
    };
    messages: { content: string | null; createdAt: Date; senderId: string }[];
  }[];

  let conversations: ConversationResult;

  if (isClinic) {
    const clinic = await database.clinic.findUnique({
      where: { userId: user.id },
    });
    conversations = clinic
      ? await database.conversation.findMany({
          where: { clinicId: clinic.id },
          include: {
            professional: {
              select: { id: true, fullName: true, avatarUrl: true },
            },
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
              select: { content: true, createdAt: true, senderId: true },
            },
          },
          orderBy: { lastMessageAt: "desc" },
          take: 50,
        })
      : [];
  } else {
    const profile = await database.profile.findUnique({
      where: { userId: user.id },
    });
    conversations = profile
      ? await database.conversation.findMany({
          where: { professionalId: profile.id },
          include: {
            clinic: {
              select: { id: true, name: true, logoUrl: true },
            },
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
              select: { content: true, createdAt: true, senderId: true },
            },
          },
          orderBy: { lastMessageAt: "desc" },
          take: 50,
        })
      : [];
  }

  return (
    <>
      <Header page="Messages" pages={["SyndeoCare"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <MessagesList
          conversations={JSON.parse(JSON.stringify(conversations))}
          currentUserId={user.id}
          isClinic={isClinic}
        />
      </div>
    </>
  );
}
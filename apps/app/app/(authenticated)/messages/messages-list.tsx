"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design-system/components/ui/avatar";
import { Card, CardContent } from "@repo/design-system/components/ui/card";
import { MessageSquareIcon } from "lucide-react";
import Link from "next/link";

interface Conversation {
  clinic?: { id: string; name: string | null; logoUrl: string | null };
  id: string;
  messages: {
    content: string | null;
    createdAt: string;
    senderId: string;
  }[];
  professional?: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
}

interface MessagesListProps {
  conversations: Conversation[];
  currentUserId: string;
  isClinic: boolean;
}

export function MessagesList({
  conversations,
  currentUserId,
  isClinic,
}: MessagesListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <MessageSquareIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 font-medium text-lg text-muted-foreground">
            No messages yet
          </p>
          <p className="text-muted-foreground text-sm">
            Start a conversation after booking a shift
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const otherName = isClinic
          ? conversation.professional?.fullName
          : conversation.clinic?.name;
        const otherImage = isClinic
          ? conversation.professional?.avatarUrl
          : conversation.clinic?.logoUrl;
        const lastMessage = conversation.messages[0];
        const initials =
          otherName
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() ?? "?";

        return (
          <Link href={`/messages/${conversation.id}`} key={conversation.id}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center gap-3 p-4">
                <Avatar>
                  <AvatarImage src={otherImage ?? undefined} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium">{otherName ?? "Unknown"}</p>
                  {lastMessage && (
                    <p className="truncate text-muted-foreground text-sm">
                      {lastMessage.senderId === currentUserId ? "You: " : ""}
                      {lastMessage.content}
                    </p>
                  )}
                </div>
                {lastMessage && (
                  <span className="text-muted-foreground text-xs">
                    {new Date(lastMessage.createdAt).toLocaleDateString()}
                  </span>
                )}
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

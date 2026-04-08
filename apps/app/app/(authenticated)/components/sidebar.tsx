"use client";

import { UserButton } from "@repo/auth/components/user-button";
import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/design-system/components/ui/sidebar";
import { NotificationsTrigger } from "@repo/notifications/components/trigger";
import {
  BriefcaseIcon,
  CalendarIcon,
  HeartPulseIcon,
  HomeIcon,
  LifeBuoyIcon,
  MessageSquareIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface GlobalSidebarProperties {
  readonly children: ReactNode;
  readonly role: string;
}

const professionalNavItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Find Shifts",
    url: "/shifts",
    icon: SearchIcon,
  },
  {
    title: "My Bookings",
    url: "/bookings",
    icon: CalendarIcon,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquareIcon,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: UserIcon,
  },
];

const clinicNavItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Manage Shifts",
    url: "/shifts",
    icon: BriefcaseIcon,
  },
  {
    title: "Bookings",
    url: "/bookings",
    icon: CalendarIcon,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquareIcon,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: UserIcon,
  },
];

const secondaryNav = [
  {
    title: "Settings",
    url: "/settings",
    icon: SettingsIcon,
  },
  {
    title: "Support",
    url: "/settings",
    icon: LifeBuoyIcon,
  },
];

export const GlobalSidebar = ({ children, role }: GlobalSidebarProperties) => {
  const pathname = usePathname();

  const mainNav = role === "clinic" ? clinicNavItems : professionalNavItems;

  return (
    <>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg">
                <Link className="flex items-center gap-2" href="/">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <HeartPulseIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">SyndeoCare</span>
                    <span className="text-muted-foreground text-xs">
                      Healthcare Staffing
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === item.url ||
                      (item.url !== "/" && pathname.startsWith(item.url))
                    }
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {secondaryNav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <UserButton showName />
              <div className="flex shrink-0 items-center gap-px">
                <ModeToggle />
                <Button
                  asChild
                  className="shrink-0"
                  size="icon"
                  variant="ghost"
                >
                  <div className="h-4 w-4">
                    <NotificationsTrigger />
                  </div>
                </Button>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </>
  );
};

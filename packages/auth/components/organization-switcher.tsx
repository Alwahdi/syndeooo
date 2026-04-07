"use client";

import { organization, useSession } from "../client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface OrganizationSwitcherProps {
  afterSelectOrganizationUrl?: string;
  hidePersonal?: boolean;
}

interface Organization {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
}

export const OrganizationSwitcher = ({
  afterSelectOrganizationUrl,
  hidePersonal,
}: OrganizationSwitcherProps) => {
  const { data: session } = useSession();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const fetchOrgs = async () => {
      try {
        const result = await organization.list();
        if (result.data && mounted) {
          setOrgs(result.data as unknown as Organization[]);
        }
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      }
    };

    fetchOrgs();

    return () => {
      mounted = false;
    };
  }, []);

  const activeOrgId = session?.session?.activeOrganizationId;
  const activeOrg = orgs.find((org) => org.id === activeOrgId);

  const handleSelectOrg = async (orgId: string) => {
    await organization.setActive({ organizationId: orgId });
    setOpen(false);

    if (afterSelectOrganizationUrl) {
      router.push(afterSelectOrganizationUrl);
    } else {
      router.refresh();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Filter out personal workspace if hidePersonal is true
  const filteredOrgs = hidePersonal
    ? orgs.filter((org) => org.slug !== null)
    : orgs;

  return (
    <div className="relative">
      <button
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
        onClick={() => setOpen(!open)}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {activeOrg?.logo ? (
          <img
            alt={activeOrg.name}
            className="h-6 w-6 shrink-0 rounded"
            src={activeOrg.logo}
          />
        ) : (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary text-xs font-medium text-primary-foreground">
            {activeOrg?.name?.[0]?.toUpperCase() ?? "O"}
          </div>
        )}
        <span className="truncate font-medium">
          {activeOrg?.name ?? "Select organization"}
        </span>
      </button>
      {open && filteredOrgs.length > 0 && (
        <div
          className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md"
          role="listbox"
          onKeyDown={handleKeyDown}
        >
          {filteredOrgs.map((org) => (
            <button
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              key={org.id}
              onClick={() => handleSelectOrg(org.id)}
              type="button"
              role="option"
              aria-selected={org.id === activeOrgId}
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-xs">
                {org.name[0]?.toUpperCase()}
              </div>
              <span className="truncate">{org.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
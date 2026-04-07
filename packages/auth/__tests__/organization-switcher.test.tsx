import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock next/navigation
const mockRouterRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: mockRouterRefresh,
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock the auth client
const mockOrgList = vi.fn();
const mockOrgSetActive = vi.fn();
const mockUseSession = vi.fn();
vi.mock("../client", () => ({
  organization: {
    list: (...args: unknown[]) => mockOrgList(...args),
    setActive: (...args: unknown[]) => mockOrgSetActive(...args),
  },
  useSession: () => mockUseSession(),
}));

const { OrganizationSwitcher } = await import(
  "../components/organization-switcher"
);

describe("OrganizationSwitcher component", () => {
  let mockReload: ReturnType<typeof vi.fn>;
  let originalLocation: Location;

  beforeEach(() => {
    mockOrgList.mockReset();
    mockOrgSetActive.mockReset();
    mockUseSession.mockReset();

    // Mock window.location.reload
    mockReload = vi.fn();
    originalLocation = window.location;
    Object.defineProperty(window, "location", {
      value: { reload: mockReload },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore original location
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it("renders with default text when no active org", async () => {
    mockUseSession.mockReturnValue({
      data: { session: { activeOrganizationId: null } },
    });
    mockOrgList.mockResolvedValue({ data: [] });

    render(<OrganizationSwitcher />);

    expect(screen.getByText("Select organization")).toBeInTheDocument();
  });

  it("displays active organization name", async () => {
    mockUseSession.mockReturnValue({
      data: { session: { activeOrganizationId: "org-1" } },
    });
    mockOrgList.mockResolvedValue({
      data: [
        { id: "org-1", name: "Acme Corp", slug: "acme", logo: null },
        { id: "org-2", name: "Other Corp", slug: "other", logo: null },
      ],
    });

    render(<OrganizationSwitcher />);

    await waitFor(() => {
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    });
  });

  it("shows org logo when available", async () => {
    mockUseSession.mockReturnValue({
      data: { session: { activeOrganizationId: "org-1" } },
    });
    mockOrgList.mockResolvedValue({
      data: [
        {
          id: "org-1",
          name: "Acme",
          slug: "acme",
          logo: "https://example.com/logo.png",
        },
      ],
    });

    render(<OrganizationSwitcher />);

    await waitFor(() => {
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "https://example.com/logo.png");
      expect(img).toHaveAttribute("alt", "Acme");
    });
  });

  it("toggles dropdown on click", async () => {
    mockUseSession.mockReturnValue({
      data: { session: { activeOrganizationId: null } },
    });
    mockOrgList.mockResolvedValue({
      data: [
        { id: "org-1", name: "Acme", slug: "acme", logo: null },
        { id: "org-2", name: "Beta", slug: "beta", logo: null },
      ],
    });

    const user = userEvent.setup();
    render(<OrganizationSwitcher />);

    // Wait for orgs to load
    await waitFor(() => {
      expect(mockOrgList).toHaveBeenCalled();
    });

    // Dropdown should not be visible initially
    expect(screen.queryByText("Acme")).not.toBeInTheDocument();

    // Click to open
    await user.click(
      screen.getByRole("button", { name: /Select organization/i })
    );

    await waitFor(() => {
      expect(screen.getByText("Acme")).toBeInTheDocument();
      expect(screen.getByText("Beta")).toBeInTheDocument();
    });
  });

  it("switches organization on selection", async () => {
    mockUseSession.mockReturnValue({
      data: { session: { activeOrganizationId: "org-1" } },
    });
    mockOrgList.mockResolvedValue({
      data: [
        { id: "org-1", name: "Acme", slug: "acme", logo: null },
        { id: "org-2", name: "Beta", slug: "beta", logo: null },
      ],
    });
    mockOrgSetActive.mockResolvedValue({});

    const user = userEvent.setup();
    render(<OrganizationSwitcher />);

    // Wait for orgs to load and active org name to appear
    await waitFor(() => {
      expect(screen.getByText("Acme")).toBeInTheDocument();
    });

    // Open dropdown
    await user.click(screen.getByRole("button", { name: /Acme/i }));

    // Wait for dropdown to appear, then click Beta
    await waitFor(() => {
      expect(screen.getByText("Beta")).toBeInTheDocument();
    });

    // Get all buttons that match Beta (there might be the org initial too)
    const betaButtons = screen.getAllByText("Beta");
    const betaButton = betaButtons[0].closest("button");
    expect(betaButton).not.toBeNull();
    await user.click(betaButton!);

    await waitFor(() => {
      expect(mockOrgSetActive).toHaveBeenCalledWith({
        organizationId: "org-2",
      });
    });

    expect(mockRouterRefresh).toHaveBeenCalled();
  });

  it("shows first letter initial when no logo", async () => {
    mockUseSession.mockReturnValue({
      data: { session: { activeOrganizationId: "org-1" } },
    });
    mockOrgList.mockResolvedValue({
      data: [{ id: "org-1", name: "Acme", slug: "acme", logo: null }],
    });

    render(<OrganizationSwitcher />);

    await waitFor(() => {
      expect(screen.getByText("A")).toBeInTheDocument();
    });
  });

  it("fetches organizations on mount", async () => {
    mockUseSession.mockReturnValue({
      data: { session: {} },
    });
    mockOrgList.mockResolvedValue({ data: [] });

    render(<OrganizationSwitcher />);

    await waitFor(() => {
      expect(mockOrgList).toHaveBeenCalledTimes(1);
    });
  });

  it("shows default initial when no active org", () => {
    mockUseSession.mockReturnValue({
      data: { session: { activeOrganizationId: null } },
    });
    mockOrgList.mockResolvedValue({ data: [] });

    render(<OrganizationSwitcher />);

    // Default "O" initial
    expect(screen.getByText("O")).toBeInTheDocument();
  });
});

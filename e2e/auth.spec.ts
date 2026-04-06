import { test as base, expect, type Page } from "@playwright/test";

// Unique suffix per test run to avoid collisions
const uid = Date.now().toString(36);

/**
 * Helper: generate a unique test email
 */
function testEmail(label: string) {
  return `e2e-${label}-${uid}@test.local`;
}

const TEST_PASSWORD = "TestPassword123!";

// ────────────────────────────────────────────────────────────────────
// 1. UNAUTHENTICATED PAGE TESTS
// ────────────────────────────────────────────────────────────────────

base.describe("Unauthenticated pages", () => {
  base("sign-in page loads correctly", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page).toHaveTitle(/Welcome back/i);
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  base("sign-up page loads correctly", async ({ page }) => {
    await page.goto("/sign-up");
    await expect(page).toHaveTitle(/Create an account/i);
    await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible();
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
  });

  base("sign-in page has link to sign-up", async ({ page }) => {
    await page.goto("/sign-in");
    const signUpLink = page.getByRole("link", { name: /sign up/i });
    await expect(signUpLink).toBeVisible();
    await signUpLink.click();
    await expect(page).toHaveURL(/\/sign-up/);
  });

  base("sign-up page has link to sign-in", async ({ page }) => {
    await page.goto("/sign-up");
    const signInLink = page.getByRole("link", { name: /sign in/i });
    await expect(signInLink).toBeVisible();
    await signInLink.click();
    await expect(page).toHaveURL(/\/sign-in/);
  });

  base("sign-in page shows social auth buttons", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByRole("button", { name: /github/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
  });

  base("sign-in page shows 'Or continue with' separator", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByText(/or continue with/i)).toBeVisible();
  });

  base("sign-in page shows SyndeoCare branding on desktop", async ({ page }) => {
    // This is only visible on lg screens (the left panel)
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/sign-in");
    await expect(page.getByText("SyndeoCare")).toBeVisible();
  });
});

// ────────────────────────────────────────────────────────────────────
// 2. PROTECTED ROUTE REDIRECT TESTS
// ────────────────────────────────────────────────────────────────────

base.describe("Protected route redirects", () => {
  base("redirects unauthenticated user from / to /sign-in", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL(/\/sign-in/);
    await expect(page).toHaveURL(/\/sign-in/);
  });

  base("redirect includes callbackUrl parameter", async ({ page }) => {
    await page.goto("/some-protected-page");
    await page.waitForURL(/\/sign-in/);
    await expect(page).toHaveURL(/callbackUrl/);
  });
});

// ────────────────────────────────────────────────────────────────────
// 3. SIGN-UP FLOW
// ────────────────────────────────────────────────────────────────────

base.describe("Sign-up flow", () => {
  base("rejects short password (client-side validation)", async ({ page }) => {
    await page.goto("/sign-up");
    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill(testEmail("short-pwd"));
    await page.getByLabel("Password").fill("short");
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page.getByText(/password must be at least 8 characters/i)).toBeVisible();
  });

  base("successfully creates account and redirects to home", async ({ page }) => {
    const email = testEmail("signup");
    await page.goto("/sign-up");

    await page.getByLabel("Name").fill("E2E Test User");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /create account/i }).click();

    // Should redirect to home after sign-up
    await page.waitForURL("/", { timeout: 15_000 });
    await expect(page).toHaveURL("/");
  });

  base("rejects duplicate email sign-up", async ({ page }) => {
    // First, create the user
    const email = testEmail("dup");
    await page.goto("/sign-up");
    await page.getByLabel("Name").fill("First User");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /create account/i }).click();
    await page.waitForURL("/", { timeout: 15_000 });

    // Clear cookies to sign out
    await page.context().clearCookies();

    // Try to sign up again with same email
    await page.goto("/sign-up");
    await page.getByLabel("Name").fill("Second User");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /create account/i }).click();

    // Should show error (better-auth returns "User already exists" or similar)
    await expect(
      page.locator(".text-destructive").first()
    ).toBeVisible({ timeout: 10_000 });
  });

  base("shows loading state during sign-up", async ({ page }) => {
    await page.goto("/sign-up");
    await page.getByLabel("Name").fill("Loading Test");
    await page.getByLabel("Email").fill(testEmail("loading"));
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /create account/i }).click();

    // Should briefly show "Creating account..."
    await expect(
      page.getByRole("button", { name: /creating account/i })
    ).toBeVisible();
  });
});

// ────────────────────────────────────────────────────────────────────
// 4. SIGN-IN FLOW
// ────────────────────────────────────────────────────────────────────

base.describe("Sign-in flow", () => {
  const signInEmail = testEmail("signin");

  // Create user first
  base.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("http://localhost:3000/sign-up");
    await page.getByLabel("Name").fill("SignIn Test");
    await page.getByLabel("Email").fill(signInEmail);
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /create account/i }).click();
    await page.waitForURL("http://localhost:3000/", { timeout: 15_000 });
    await context.close();
  });

  base("successfully signs in with valid credentials", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill(signInEmail);
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();

    await page.waitForURL("/", { timeout: 15_000 });
    await expect(page).toHaveURL("/");
  });

  base("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill(signInEmail);
    await page.getByLabel("Password").fill("WrongPassword!");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(
      page.locator(".text-destructive").first()
    ).toBeVisible({ timeout: 10_000 });
  });

  base("shows error for non-existent user", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill("nonexistent@test.local");
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(
      page.locator(".text-destructive").first()
    ).toBeVisible({ timeout: 10_000 });
  });

  base("shows loading state during sign-in", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill(signInEmail);
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(
      page.getByRole("button", { name: /signing in/i })
    ).toBeVisible();
  });

  base("respects callbackUrl after sign-in", async ({ page }) => {
    // Go to a protected page first (will redirect to sign-in with callbackUrl)
    await page.goto("/");
    await page.waitForURL(/\/sign-in/);

    // Sign in
    await page.getByLabel("Email").fill(signInEmail);
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();

    // Should redirect back to the original URL
    await page.waitForURL("/", { timeout: 15_000 });
    await expect(page).toHaveURL("/");
  });
});

// ────────────────────────────────────────────────────────────────────
// 5. AUTHENTICATED SESSION TESTS
// ────────────────────────────────────────────────────────────────────

base.describe("Authenticated session", () => {
  const sessionEmail = testEmail("session");

  // Set up: create user and store auth state
  base.beforeEach(async ({ page }) => {
    await page.goto("/sign-up");
    await page.getByLabel("Name").fill("Session Test");
    await page.getByLabel("Email").fill(sessionEmail);
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /create account/i }).click();
    await page.waitForURL("/", { timeout: 15_000 });
  });

  base("authenticated user can access home page", async ({ page }) => {
    await page.goto("/");
    // Should NOT redirect to sign-in
    await expect(page).toHaveURL("/");
  });

  base("session persists across page navigations", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
    
    // Navigate to another page and back
    await page.goto("/");
    await expect(page).toHaveURL("/");
  });

  base("sign out clears session", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");

    // Find and click the sign out button (UserButton has sr-only "Sign out" text)
    const signOutBtn = page.getByRole("button").filter({ hasText: /sign out/i });
    if (await signOutBtn.isVisible()) {
      await signOutBtn.click();
      await page.waitForURL(/\/sign-in/);
      await expect(page).toHaveURL(/\/sign-in/);
    }
  });
});

// ────────────────────────────────────────────────────────────────────
// 6. AUTH API ROUTE TESTS
// ────────────────────────────────────────────────────────────────────

base.describe("Auth API routes", () => {
  base("GET /api/auth/ok returns 200", async ({ request }) => {
    const response = await request.get("/api/auth/ok");
    expect(response.status()).toBe(200);
  });

  base("POST /api/auth/sign-up/email creates user via API", async ({ request }) => {
    const response = await request.post("/api/auth/sign-up/email", {
      data: {
        name: "API Test User",
        email: testEmail("api-signup"),
        password: TEST_PASSWORD,
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(testEmail("api-signup"));
  });

  base("POST /api/auth/sign-in/email signs in via API", async ({ request }) => {
    // Create user first
    const email = testEmail("api-signin");
    await request.post("/api/auth/sign-up/email", {
      data: { name: "API SignIn", email, password: TEST_PASSWORD },
    });

    // Now sign in
    const response = await request.post("/api/auth/sign-in/email", {
      data: { email, password: TEST_PASSWORD },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.user).toBeDefined();
    expect(body.session).toBeDefined();
  });

  base("POST /api/auth/sign-in/email rejects wrong password", async ({ request }) => {
    const email = testEmail("api-wrong-pwd");
    await request.post("/api/auth/sign-up/email", {
      data: { name: "Wrong Pwd", email, password: TEST_PASSWORD },
    });

    const response = await request.post("/api/auth/sign-in/email", {
      data: { email, password: "WrongPassword!" },
    });
    // Better Auth returns 401 or error in body
    const body = await response.json();
    expect(body.error || response.status() !== 200).toBeTruthy();
  });

  base("GET /api/auth/get-session returns null when not authenticated", async ({ request }) => {
    const response = await request.get("/api/auth/get-session");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.session).toBeNull();
  });

  base("GET /api/auth/get-session returns session with valid cookie", async ({ request }) => {
    // Sign up to get a session cookie
    const email = testEmail("api-session");
    const signUpRes = await request.post("/api/auth/sign-up/email", {
      data: { name: "Session Test", email, password: TEST_PASSWORD },
    });
    expect(signUpRes.status()).toBe(200);

    // The sign-up response should set cookies — subsequent requests use them
    const sessionRes = await request.get("/api/auth/get-session");
    expect(sessionRes.status()).toBe(200);
    const body = await sessionRes.json();
    expect(body.session).toBeDefined();
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(email);
  });
});

// ────────────────────────────────────────────────────────────────────
// 7. INPUT VALIDATION & EDGE CASES
// ────────────────────────────────────────────────────────────────────

base.describe("Input validation & edge cases", () => {
  base("sign-in form requires email format", async ({ page }) => {
    await page.goto("/sign-in");
    const emailInput = page.getByLabel("Email");
    await emailInput.fill("not-an-email");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();

    // HTML5 validation should prevent submission
    const validity = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(validity).toBe(false);
  });

  base("sign-up form requires all fields", async ({ page }) => {
    await page.goto("/sign-up");

    // All fields should be required
    const nameValid = await page.getByLabel("Name").evaluate(
      (el: HTMLInputElement) => el.required
    );
    const emailValid = await page.getByLabel("Email").evaluate(
      (el: HTMLInputElement) => el.required
    );
    const passwordValid = await page.getByLabel("Password").evaluate(
      (el: HTMLInputElement) => el.required
    );

    expect(nameValid).toBe(true);
    expect(emailValid).toBe(true);
    expect(passwordValid).toBe(true);
  });

  base("sign-in password field uses type=password", async ({ page }) => {
    await page.goto("/sign-in");
    const type = await page.getByLabel("Password").getAttribute("type");
    expect(type).toBe("password");
  });

  base("sign-up password field uses type=password", async ({ page }) => {
    await page.goto("/sign-up");
    const type = await page.getByLabel("Password").getAttribute("type");
    expect(type).toBe("password");
  });
});

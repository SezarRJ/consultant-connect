/**
 * AppLayout.tsx
 * ─────────────────────────────────────────────────────────────────
 * Root shell: sidebar + engagement banner + page content.
 * Banner is inside main so every page gets the shared context strip.
 * ─────────────────────────────────────────────────────────────────
 */
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { ActiveEngagementBanner } from "./ActiveEngagementBanner";

export function AppLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <ActiveEngagementBanner />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Bell, X, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAppStore } from "@/store/appStore";
import { useNotifications } from "@/hooks/useNotifications";

const getPageTitle = (pathname: string): string => {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/clients/")) return "Client Workspace";
  if (pathname === "/clients") return "Clients";
  if (pathname === "/agents") return "AI Agents";
  if (pathname === "/knowledge") return "Knowledge Base";
  if (pathname === "/insights") return "Insights";
  if (pathname === "/deliverables") return "Deliverables";
  if (pathname === "/documents") return "Document Hub";
  if (pathname === "/settings") return "Settings";
  return "AI Consulting Brain";
};

export function AppLayout() {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const [bellOpen, setBellOpen] = useState(false);

  // G-26 FIX: start SSE notification stream
  useNotifications();

  // G-26 FIX: read live count + list from store
  const notificationCount = useAppStore((s) => s.notificationCount);
  const notifications = useAppStore((s) => s.notifications);
  const markAllRead = useAppStore((s) => s.markAllRead);
  const dismissNotification = useAppStore((s) => s.dismissNotification);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border bg-card px-4 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <span className="text-sm font-semibold text-foreground">{pageTitle}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* G-26 FIX: Popover notification list wired to store */}
              <Popover open={bellOpen} onOpenChange={setBellOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-8 w-8">
                    <Bell className="h-4 w-4" />
                    {notificationCount > 0 && (
                      <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <span className="text-sm font-semibold">Notifications</span>
                    {notificationCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => markAllRead()}
                      >
                        <CheckCheck className="mr-1 h-3 w-3" /> Mark all read
                      </Button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.map((n: any) => (
                        <div
                          key={n.id}
                          className="flex items-start gap-3 px-4 py-3 border-b last:border-0 hover:bg-muted/40"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{n.title ?? "New alert"}</p>
                            {n.message && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {n.message}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={() => dismissNotification(n.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold select-none">
                AT
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

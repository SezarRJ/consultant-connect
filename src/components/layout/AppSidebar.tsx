import { Brain, LayoutDashboard, Users, BookOpen, Bot, Lightbulb, FileText, FolderOpen, Settings, Languages } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const isRouteActive = (itemUrl: string, pathname: string): boolean => {
  if (itemUrl === "/") return pathname === "/";
  return pathname === itemUrl || pathname.startsWith(itemUrl + "/");
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { t, lang, setLang } = useI18n();

  const navItems = [
    { title: t.nav_dashboard,    url: "/",             icon: LayoutDashboard },
    { title: t.nav_clients,      url: "/clients",      icon: Users           },
    { title: t.nav_knowledge,    url: "/knowledge",    icon: BookOpen        },
    { title: t.nav_agents,       url: "/agents",       icon: Bot             },
    { title: t.nav_insights,     url: "/insights",     icon: Lightbulb       },
    { title: t.nav_deliverables, url: "/deliverables", icon: FileText        },
    { title: "Document Hub",     url: "/documents",    icon: FolderOpen      },
    { title: t.nav_settings,     url: "/settings",     icon: Settings        },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
            <Brain className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground">AI Consulting</span>
              <span className="text-xs text-sidebar-foreground/60">Brain Platform</span>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isRouteActive(item.url, location.pathname)}>
                    <NavLink to={item.url} end={item.url === "/"} className="hover:bg-sidebar-accent">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Language switcher */}
        <div className={`mt-auto px-3 py-4 border-t border-sidebar-border`}>
          {collapsed ? (
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="h-8 w-8 mx-auto flex items-center justify-center rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors text-xs font-bold"
              title="Switch language"
            >
              {lang === "en" ? "ع" : "EN"}
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-sidebar-foreground/60">
                <Languages className="h-3.5 w-3.5" />
                <span>{lang === "en" ? "English" : "العربية"}</span>
              </div>
              <div className="flex gap-1">
                {(["en", "ar"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${
                      lang === l
                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                        : "text-sidebar-foreground/50 hover:text-sidebar-foreground"
                    }`}
                  >
                    {l === "en" ? "EN" : "ع"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

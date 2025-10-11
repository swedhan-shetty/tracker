import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  CheckSquare, 
  Pill, 
  Dumbbell, 
  Apple,
  Book,
  Download,
  User
} from "lucide-react";
import { useLocation } from "wouter";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/" },
  { title: "Daily Entry", icon: PlusCircle, url: "/entry" },
  { title: "Analytics", icon: BarChart3, url: "/analytics" },
  { title: "Tasks", icon: CheckSquare, url: "/tasks" },
  { title: "Supplement Archive", icon: Pill, url: "/supplements" },
  { title: "Workouts", icon: Dumbbell, url: "/workouts" },
  { title: "Macros", icon: Apple, url: "/macros" },
  { title: "Books", icon: Book, url: "/books" },
  { title: "Export", icon: Download, url: "/export" },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg" data-testid="text-app-title">Daily Tracker</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 hover-elevate rounded-md p-2 cursor-pointer" data-testid="button-profile">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">User Profile</p>
            <p className="text-xs text-muted-foreground truncate">View settings</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

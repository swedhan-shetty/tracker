import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import Dashboard from "@/pages/Dashboard";
import DailyEntry from "@/pages/DailyEntry";
import Analytics from "@/pages/Analytics";
import Tasks from "@/pages/Tasks";
import Supplements from "@/pages/Supplements";
import Workouts from "@/pages/Workouts";
import Macros from "@/pages/Macros";
import Books from "@/pages/Books";
import Export from "@/pages/Export";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/entry" component={DailyEntry} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/supplements" component={Supplements} />
      <Route path="/workouts" component={Workouts} />
      <Route path="/macros" component={Macros} />
      <Route path="/books" component={Books} />
      <Route path="/export" component={Export} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "280px",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties} defaultOpen={true}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background sticky top-0 z-10">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <ThemeToggle />
              </header>
              <main className="flex-1 overflow-y-auto bg-background">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

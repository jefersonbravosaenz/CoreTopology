// RedCalc Pro - App Root
// Design: Corporate Precision - Light theme with navy sidebar

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NetworkProvider } from "./contexts/NetworkContext";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <NetworkProvider>
          <TooltipProvider>
            <Toaster position="top-right" richColors />
            <Router />
          </TooltipProvider>
        </NetworkProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

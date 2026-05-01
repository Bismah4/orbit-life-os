import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { OrbitProvider } from "@/lib/orbit-store";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Orbit — Your life, organized." },
      { name: "description", content: "Orbit is your AI-powered Life OS. Capture anything, let Orbit think, focus on what matters." },
      { name: "theme-color", content: "#1a1f33" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: () => (
    <OrbitProvider>
      <Outlet />
      <Toaster richColors position="top-center" />
    </OrbitProvider>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">Lost in orbit.</p>
        <a href="/home" className="inline-block mt-6 px-4 py-2 rounded-md bg-primary text-primary-foreground">Go home</a>
      </div>
    </div>
  ),
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

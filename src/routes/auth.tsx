import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: () => (
    <div className="orbit-bg-radial min-h-screen">
      <div className="max-w-[440px] mx-auto min-h-screen px-6 py-10 flex flex-col">
        <Outlet />
      </div>
    </div>
  ),
});

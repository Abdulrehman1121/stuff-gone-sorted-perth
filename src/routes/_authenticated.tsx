import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthLayout,
});

function AuthLayout() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("haulmate_admin_token");
    setAuthed(!!token);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }
  if (!authed) {
    if (typeof window !== "undefined") {
      window.location.replace("/admin/login");
    }
    return null;
  }
  return <Outlet />;
}


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import logoImage from "../assets/haulmate-wa-logo.webp";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HaulMate WA | Rubbish Removal Perth" },
      { name: "description", content: "HaulMate WA offers fast, reliable rubbish removal services in Perth, Australia." },
      { name: "author", content: "HaulMate WA" },
      { property: "og:title", content: "HaulMate WA | Rubbish Removal Perth" },
      { property: "og:description", content: "HaulMate WA offers fast, reliable rubbish removal services in Perth, Australia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@HaulMateWA" },
      { name: "twitter:title", content: "HaulMate WA" },
      { name: "twitter:description", content: "HaulMate WA offers fast, reliable rubbish removal services in Perth, Australia." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b69df586-3e3e-476d-826c-4b6fe382c89f/id-preview-21f790ed--07f8a326-4303-4b0e-aa1c-25cb85bcf577.lovable.app-1779103266743.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b69df586-3e3e-476d-826c-4b6fe382c89f/id-preview-21f790ed--07f8a326-4303-4b0e-aa1c-25cb85bcf577.lovable.app-1779103266743.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/webp",
        href: logoImage,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  
  // Do not show the main Navbar/Footer on admin dashboard if desired, 
  // but for simplicity we will wrap everything. 
  // Wait, let's just use it everywhere.
  const isAdmin = router.state.location.pathname.startsWith('/admin');

  return (
    <QueryClientProvider client={queryClient}>
      {!isAdmin && <Navbar />}
      <Outlet />
      {!isAdmin && <Footer />}
      {!isAdmin && <BackToTop />}
    </QueryClientProvider>
  );
}

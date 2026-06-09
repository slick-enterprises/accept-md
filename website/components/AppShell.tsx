import { Header } from "./Header";
import { Footer } from "./Footer";

type AppShellSection = "default" | "docs" | "blog" | "learn" | "integrations" | "audit";

interface AppShellProps {
  children: React.ReactNode;
  section?: AppShellSection;
  sidebar?: React.ReactNode;
}

const mainWidth: Record<AppShellSection, string> = {
  default: "max-w-6xl",
  docs: "max-w-6xl",
  blog: "max-w-3xl",
  learn: "max-w-4xl",
  integrations: "max-w-4xl",
  audit: "max-w-3xl",
};

export function AppShell({
  children,
  section = "default",
  sidebar,
}: AppShellProps) {
  const hasSidebar = Boolean(sidebar);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div
          className={`mx-auto ${mainWidth[section]} ${hasSidebar ? "lg:flex lg:gap-12" : ""}`}
        >
          {sidebar && (
            <aside className="mb-8 lg:mb-0 lg:w-56 lg:shrink-0">{sidebar}</aside>
          )}
          <main className={hasSidebar ? "min-w-0 flex-1" : undefined}>
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

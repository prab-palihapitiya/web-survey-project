import SidePane from "@/app/ui/dashboard/navigate/sidepane";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | SurveyRanch",
  description: "Easy surveys, rich results."
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex" }}>
      <SidePane />
      <main
        style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          height: "100vh"
        }}>
        {children}
      </main>
    </div>
  );
}

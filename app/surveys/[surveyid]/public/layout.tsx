import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Web | SurveyRanch",
    description: "Easy surveys, rich results."
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body style={{ display: "flex" }}>
                <main
                    style={{
                        flex: 1,
                        // padding: "1rem",
                        overflowY:
                            "auto" /* Enable vertical scrolling for the main content */,
                        height: "100vh" /* Set the height to 100% of viewport height */
                    }}
                >
                    {children}
                </main>
            </body>
        </html>
    );
}

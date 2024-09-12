import { createTheme, MantineProvider } from "@mantine/core";

export default function Layout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {

    const theme = createTheme({});
    return (
        <MantineProvider theme={theme}>{children}</MantineProvider>
    );
}

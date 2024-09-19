'use client';

import { Button, Container, MantineProvider } from "@mantine/core";
import { Inter } from "next/font/google";
import { getStyle } from "@/app/surveys/utils/theme";

const inter = Inter({ subsets: ["latin"] });

const Page = ({ params }: { params: { surveyid: string } }) => {

    return (
        <MantineProvider theme={getStyle('red')}>
            <Container className={inter.className}>
                <h1>{params.surveyid} Survey Public Page</h1>
                <Button>Click me</Button>
            </Container>
        </MantineProvider>
    );
};

export default Page;
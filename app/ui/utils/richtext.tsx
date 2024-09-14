import { TypographyStylesProvider } from '@mantine/core';

export default function RichText({ content }: { content: string }) {
    return (
        <TypographyStylesProvider>
            <div
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </TypographyStylesProvider>
    );
}
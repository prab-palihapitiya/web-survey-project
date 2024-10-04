import useQuestionnaireStore from '@/app/lib/state/questionnaire-store';
import { TypographyStylesProvider } from '@mantine/core';
import { useEffect, useState } from 'react';

const RichText = ({ content }: { content: string }) => {
    const { questions, answers } = useQuestionnaireStore();
    const [processedContent, setProcessedContent] = useState(content);

    useEffect(() => {
        // Function to extract shortcuts from the content
        const extractShortcuts = () => {
            const shortcutRegex: RegExp = /{{([^}]+)}}/g;
            const shortcuts: string[] = [];
            let match;
            while ((match = shortcutRegex.exec(content)) !== null) {
                shortcuts.push(match[1]);
            }
            return shortcuts;
        }

        // Function to replace shortcuts with answers
        const replaceShortcuts = (shortcuts: string[]) => {
            let updatedContent = content;
            shortcuts.forEach((shortcut) => {
                const questionId = questions.find(q => q.shortcut === shortcut)?.id?.toString();
                const answer = answers.find(a => a.questionId === questionId);
                if (answer) {
                    const regex = new RegExp(`{{${shortcut}}}`, 'g');
                    updatedContent = updatedContent.replace(regex, answer.answer as string || '');
                }
            });
            return updatedContent;
        };

        const shortcutsToReplace = extractShortcuts();
        const updatedContent = replaceShortcuts(shortcutsToReplace);
        setProcessedContent(updatedContent);
    }, [content, answers, questions]);

    return (
        <TypographyStylesProvider>
            <div
                dangerouslySetInnerHTML={{ __html: processedContent }}
            />
        </TypographyStylesProvider>
    );
};

export default RichText;
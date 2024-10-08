import { RichTextEditor, Link, useRichTextEditorContext } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import '@mantine/tiptap/styles.css';
import useQuestionnaireStore from '@/app/lib/state/questionnaire-store';
import { IconBraces, IconColorPicker } from '@tabler/icons-react';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import { Menu } from '@mantine/core';

export default function TextEditor({ qid, intro, placeholderText }: { qid: number, intro: string, placeholderText: string }) {
    const updateQuestionData = useQuestionnaireStore((state) => state.updateQuestionData);
    const shortcuts = useQuestionnaireStore((state) =>
        state.questions
            ?.filter((q) => q.id !== qid) // Filter out the current question
            .map((q) => q.shortcut)
    );

    const PlaceholderControl = () => {
        const { editor } = useRichTextEditorContext();
        return (
            <RichTextEditor.Control
                aria-label="Insert placeholder data"
                title="Insert placeholder data">
                <Menu shadow="md" trigger="hover" openDelay={100} closeDelay={400}>
                    <Menu.Target>
                        <IconBraces stroke={2} size="1rem" style={{ color: 'var(--mantine-color-blue-filled)' }} />
                    </Menu.Target>

                    <Menu.Dropdown>
                        {shortcuts?.map((shortcut) => (
                            <Menu.Item
                                key={shortcut}
                                onClick={() => editor?.commands.insertContent(`{{${shortcut}}}`)}
                            >
                                {shortcut}
                            </Menu.Item>
                        ))}
                    </Menu.Dropdown>
                </Menu>
            </RichTextEditor.Control>
        );
    }

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextStyle,
            Color,
            Placeholder.configure({ placeholder: placeholderText }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: intro || '',  // Bind content to each question's intro
        onUpdate({ editor }) {
            updateQuestionData(qid, { introduction: editor.getHTML() });  // Update only this question's intro
        },
        immediatelyRender: false,
    });

    return (
        <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky>
                <RichTextEditor.ColorPicker
                    colors={[
                        '#25262b',
                        '#868e96',
                        '#fa5252',
                        '#e64980',
                        '#be4bdb',
                        '#7950f2',
                        '#4c6ef5',
                        '#228be6',
                        '#15aabf',
                        '#12b886',
                        '#40c057',
                        '#82c91e',
                        '#fab005',
                        '#fd7e14',
                    ]}
                />

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Control interactive={false}>
                        <IconColorPicker size="1rem" stroke={1.5} />
                    </RichTextEditor.Control>
                    <RichTextEditor.Color color="#F03E3E" />
                    <RichTextEditor.Color color="#7048E8" />
                    <RichTextEditor.Color color="#1098AD" />
                    <RichTextEditor.Color color="#37B24D" />
                    <RichTextEditor.Color color="#F59F00" />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.UnsetColor />
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                    <RichTextEditor.Code />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                    <RichTextEditor.Subscript />
                    <RichTextEditor.Superscript />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Undo />
                    <RichTextEditor.Redo />
                </RichTextEditor.ControlsGroup>

                <PlaceholderControl />

            </RichTextEditor.Toolbar>
            <RichTextEditor.Content style={{ fontSize: "12px", maxHeight: '10rem', overflowY: 'auto' }} />
        </RichTextEditor>
    );
}
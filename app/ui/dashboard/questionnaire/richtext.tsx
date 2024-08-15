import { RichTextEditor } from "@mantine/tiptap";
import { IconBold, IconItalic } from "@tabler/icons-react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const BoldIcon = () => (
  <IconBold
    size="1rem"
    stroke={3.5}
  />
);
const ItalicIcon = () => (
  <IconItalic
    size="1rem"
    stroke={3.5}
  />
);

export default function RichText() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Customize icons with icon prop</p>"
  });

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold icon={BoldIcon} />
          <RichTextEditor.Italic icon={ItalicIcon} />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}

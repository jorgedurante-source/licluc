'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import {
  Bold, Italic, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Undo, Redo
} from 'lucide-react';

function Btn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-all ${
        active ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/60 hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

export default function MiniEditor({ value, onChange, rows = 3 }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-invert prose-sm max-w-none focus:outline-none px-3 py-2 text-white/80 text-sm`,
        style: `min-height: ${rows * 1.5}rem`,
      },
    },
  });

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-white/30 transition-all">
      <div className="flex items-center gap-0.5 px-2 py-1 border-b border-white/5 flex-wrap">
        <Btn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} title="Negrita">
          <Bold size={13} />
        </Btn>
        <Btn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} title="Cursiva">
          <Italic size={13} />
        </Btn>
        <div className="w-px h-3 bg-white/10 mx-0.5" />
        <Btn onClick={() => editor?.chain().focus().setTextAlign('left').run()} active={editor?.isActive({ textAlign: 'left' })} title="Izquierda">
          <AlignLeft size={13} />
        </Btn>
        <Btn onClick={() => editor?.chain().focus().setTextAlign('center').run()} active={editor?.isActive({ textAlign: 'center' })} title="Centrar">
          <AlignCenter size={13} />
        </Btn>
        <Btn onClick={() => editor?.chain().focus().setTextAlign('right').run()} active={editor?.isActive({ textAlign: 'right' })} title="Derecha">
          <AlignRight size={13} />
        </Btn>
        <Btn onClick={() => editor?.chain().focus().setTextAlign('justify').run()} active={editor?.isActive({ textAlign: 'justify' })} title="Justificar">
          <AlignJustify size={13} />
        </Btn>
        <div className="w-px h-3 bg-white/10 mx-0.5" />
        <Btn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} title="Lista">
          <List size={13} />
        </Btn>
        <Btn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')} title="Lista numerada">
          <ListOrdered size={13} />
        </Btn>
        <div className="w-px h-3 bg-white/10 mx-0.5" />
        <Btn onClick={() => editor?.chain().focus().undo().run()} title="Deshacer">
          <Undo size={13} />
        </Btn>
        <Btn onClick={() => editor?.chain().focus().redo().run()} title="Rehacer">
          <Redo size={13} />
        </Btn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

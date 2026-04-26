'use client';
import { useState, useTransition } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold, Italic, List, ListOrdered, Heading2, Heading3,
  Quote, Minus, Undo, Redo, Eye, EyeOff, Save, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

function ToolbarBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
}

export default function PostEditor({ post, action }) {
  const [title, setTitle] = useState(post?.title || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [published, setPublished] = useState(post?.published ?? false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: post?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm max-w-none min-h-[320px] focus:outline-none px-5 py-4 text-white/80',
      },
    },
  });

  const handleSubmit = (isPublished) => {
    setError('');
    startTransition(async () => {
      const formData = new FormData();
      formData.set('title', title);
      formData.set('content', editor?.getHTML() || '');
      formData.set('excerpt', excerpt);
      formData.set('published', String(isPublished));
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/blog" className="text-white/30 hover:text-white/70 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-serif font-bold text-white flex-1">
          {post ? 'Editar artículo' : 'Nuevo artículo'}
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all disabled:opacity-40"
          >
            {isPending ? 'Guardando...' : 'Guardar borrador'}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isPending}
            className="px-4 py-2 text-sm font-bold bg-white text-[#13151c] rounded-lg hover:bg-white/90 transition-all disabled:opacity-40 flex items-center gap-2"
          >
            <Save size={14} />
            Publicar
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Título del artículo..."
        className="w-full bg-transparent text-3xl font-serif font-bold text-white placeholder-white/20 border-none outline-none resize-none"
        required
      />

      {/* Excerpt */}
      <textarea
        value={excerpt}
        onChange={e => setExcerpt(e.target.value)}
        placeholder="Resumen breve (aparece en la portada del blog)..."
        rows={2}
        className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-3 text-sm text-white/70 placeholder-white/20 outline-none focus:border-white/15 transition-colors resize-none"
      />

      {/* Editor */}
      <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 px-3 py-2 border-b border-white/5 flex-wrap">
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} title="Negrita">
            <Bold size={15} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} title="Cursiva">
            <Italic size={15} />
          </ToolbarBtn>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })} title="Título H2">
            <Heading2 size={15} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })} title="Título H3">
            <Heading3 size={15} />
          </ToolbarBtn>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} title="Lista">
            <List size={15} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')} title="Lista numerada">
            <ListOrdered size={15} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')} title="Cita">
            <Quote size={15} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().setHorizontalRule().run()} title="Separador">
            <Minus size={15} />
          </ToolbarBtn>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <ToolbarBtn onClick={() => editor?.chain().focus().undo().run()} title="Deshacer">
            <Undo size={15} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().redo().run()} title="Rehacer">
            <Redo size={15} />
          </ToolbarBtn>
        </div>
        <EditorContent editor={editor} />
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-xs text-white/30">
        {published ? (
          <><Eye size={12} className="text-green-400" /><span className="text-green-400">Publicado</span></>
        ) : (
          <><EyeOff size={12} /><span>Borrador</span></>
        )}
      </div>
    </div>
  );
}

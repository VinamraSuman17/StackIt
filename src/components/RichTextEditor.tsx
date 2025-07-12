import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { 
  FaBold, 
  FaItalic, 
  FaStrikethrough, 
  FaListUl, 
  FaListOl, 
  FaAlignLeft, 
  FaAlignCenter, 
  FaAlignRight,
  FaLink,
  FaImage,
  FaSmile
} from 'react-icons/fa';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addEmoji = () => {
    const emoji = window.prompt('Enter emoji:');
    if (emoji) {
      editor.chain().focus().insertContent(emoji).run();
    }
  };

  return (
    <div className="border-2 border-black shadow-[4px_4px_0px_#000] bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b-2 border-black bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 border border-black hover:bg-yellow-200 transition-colors ${
            editor.isActive('bold') ? 'bg-yellow-400' : 'bg-white'
          }`}
          type="button"
        >
          <FaBold size={14} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 border border-black hover:bg-yellow-200 transition-colors ${
            editor.isActive('italic') ? 'bg-yellow-400' : 'bg-white'
          }`}
          type="button"
        >
          <FaItalic size={14} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 border border-black hover:bg-yellow-200 transition-colors ${
            editor.isActive('strike') ? 'bg-yellow-400' : 'bg-white'
          }`}
          type="button"
        >
          <FaStrikethrough size={14} />
        </button>

        <div className="w-px h-6 bg-black mx-1"></div>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 border border-black hover:bg-yellow-200 transition-colors ${
            editor.isActive('bulletList') ? 'bg-yellow-400' : 'bg-white'
          }`}
          type="button"
        >
          <FaListUl size={14} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 border border-black hover:bg-yellow-200 transition-colors ${
            editor.isActive('orderedList') ? 'bg-yellow-400' : 'bg-white'
          }`}
          type="button"
        >
          <FaListOl size={14} />
        </button>

        <div className="w-px h-6 bg-black mx-1"></div>

        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 border border-black hover:bg-yellow-200 transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-yellow-400' : 'bg-white'
          }`}
          type="button"
        >
          <FaAlignLeft size={14} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 border border-black hover:bg-yellow-200 transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-yellow-400' : 'bg-white'
          }`}
          type="button"
        >
          <FaAlignCenter size={14} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 border border-black hover:bg-yellow-200 transition-colors ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-yellow-400' : 'bg-white'
          }`}
          type="button"
        >
          <FaAlignRight size={14} />
        </button>

        <div className="w-px h-6 bg-black mx-1"></div>

        <button
          onClick={addLink}
          className="p-2 border border-black bg-white hover:bg-yellow-200 transition-colors"
          type="button"
        >
          <FaLink size={14} />
        </button>
        
        <button
          onClick={addImage}
          className="p-2 border border-black bg-white hover:bg-yellow-200 transition-colors"
          type="button"
        >
          <FaImage size={14} />
        </button>
        
        <button
          onClick={addEmoji}
          className="p-2 border border-black bg-white hover:bg-yellow-200 transition-colors"
          type="button"
        >
          <FaSmile size={14} />
        </button>
      </div>

      {/* Editor Content */}
      <div className="min-h-[200px] p-4">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none focus:outline-none"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
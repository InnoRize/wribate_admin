"use client"
import { useState } from 'react';
import { Button } from '../../../Components/ui/button';
import { Input } from '../../../Components/ui/input';
import { Label } from '../../../Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../../Components/ui/card';
import { ArrowLeft, Bold, Italic, List, ListOrdered, Quote, Undo, Redo, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Toastify from '../../../utils/Toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';

// Toolbar component for Tiptap editor
const MenuBar = ({ editor, onImageUpload }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="border-b p-2 flex flex-wrap gap-1">
            <Button
                type="button"
                variant={editor.isActive('bold') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
            >
                <Bold size={16} />
            </Button>
            <Button
                type="button"
                variant={editor.isActive('italic') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
            >
                <Italic size={16} />
            </Button>
            <Button
                type="button"
                variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                <List size={16} />
            </Button>
            <Button
                type="button"
                variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered size={16} />
            </Button>
            <Button
                type="button"
                variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
                <Quote size={16} />
            </Button>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
            >
                <Undo size={16} />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
            >
                <Redo size={16} />
            </Button>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <Button
                type="button"
                variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
                Left
            </Button>
            <Button
                type="button"
                variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
                Center
            </Button>
            <Button
                type="button"
                variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
                Right
            </Button>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onImageUpload}
            >
                <ImageIcon size={16} />
            </Button>
        </div>
    );
};

export default function SimpleBlogPost() {
    const editBlog = useSelector((state) => state.blog.currentBlog);
    const [title, setTitle] = useState(editBlog?.title || '');
    const { userId } = useSelector((state) => state.auth);
    const [imagePreview, setImagePreview] = useState(editBlog?.image || null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Initialize Tiptap editor with proper list configuration
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Configure lists properly
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                listItem: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            // Add individual extensions for better control
            BulletList.configure({
                itemTypeName: 'listItem',
                HTMLAttributes: {
                    class: 'my-bullet-list',
                },
            }),
            OrderedList.configure({
                itemTypeName: 'listItem',
                HTMLAttributes: {
                    class: 'my-ordered-list',
                },
            }),
            ListItem.configure({
                HTMLAttributes: {
                    class: 'my-list-item',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg mx-auto block my-4',
                },
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: editBlog?.content || '<p>Start writing your blog post...</p>',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1',
            },
        },
    });

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle image upload to editor
    const handleImageUploadToEditor = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = reader.result;
                    editor.chain().focus().setImage({ src: base64 }).run();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const content = editor?.getHTML();
        
        if (!title.trim() || !content || content === '<p></p>') {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("token");
            const res = await axios.post(process.env.NEXT_PUBLIC_APP_BASE_URL + '/admin/addBlog', {
                title,
                content,
                author_id: userId,
                image: imagePreview,
                id: editBlog?._id || null
            }, 
            { 
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true 
            });

            const data = res.data;

            if (data.res) {
                toast.success("Post published successfully!");
                router.push('/blogs');
            }
        } catch (err) {
            console.error(err);
            console.log(err.response.data);
            Toastify(err.response.data.message || "Failed to publish post.", "warn");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add link to editor
    const addLinkToEditor = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    if (!userId) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card className="w-full max-w-md p-6">
                    <CardHeader className="text-center">
                        <CardTitle>Authentication Required</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="mb-4">Please log in to create a blog post.</p>
                        <Button onClick={() => router.push('/signin')}>
                            Go to Signin
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 bg-white border-b h-16 z-10">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
                    <Button 
                        onClick={() => router.back()} 
                        variant="ghost" 
                        size="sm"
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </Button>
                    <h1 className="font-medium ml-auto mr-auto text-lg">
                        {editBlog?.title ? 'Edit' : 'Create'} New Post
                    </h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Blog Post Details</CardTitle>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium">
                                    Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter a catchy title for your post"
                                    className="focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Content <span className="text-red-500">*</span>
                                </Label>
                                <div className="border rounded-lg overflow-hidden bg-white">
                                    <MenuBar editor={editor} onImageUpload={handleImageUploadToEditor} />
                                    <div className="flex gap-2 p-2 border-b bg-gray-50">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addLinkToEditor}
                                        >
                                            Add Link
                                        </Button>
                                    </div>
                                    <EditorContent 
                                        editor={editor} 
                                        className="min-h-[300px] max-h-[500px] overflow-y-auto"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image" className="text-sm font-medium">
                                    Featured Image <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="cursor-pointer"
                                />

                                {imagePreview && (
                                    <div className="mt-3 border rounded-md overflow-hidden bg-gray-50">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-56 object-contain mx-auto"
                                            onError={() => setImagePreview('/api/placeholder/500/300')}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    className="w-full sm:w-auto bg-blue-800 hover:bg-blue-700 text-white"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Publishing...' : 'Publish Post'}
                                </Button>
                            </div>
                        </CardContent>
                    </form>
                </Card>
            </main>
        </div>
    );
}
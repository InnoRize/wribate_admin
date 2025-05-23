"use client"
import { useState } from 'react';
import { Button } from '../../../Components/ui/button';
import { Input } from '../../../Components/ui/input';
import { Label } from '../../../Components/ui/label';
import { Textarea } from '../../../Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../../Components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Toastify from '../../../utils/Toast';

export default function SimpleBlogPost() {
    const editBlog = useSelector((state) => state.blog.currentBlog);;
    const [title, setTitle] = useState(editBlog?.title ||'');
    const [content, setContent] = useState(editBlog?.content || '');
    const {userId} = useSelector((state) => state.auth);
    const [imagePreview, setImagePreview] = useState(editBlog?.image || null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview((reader).result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim()) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("token")
            const res = await axios.post(process.env.NEXT_PUBLIC_APP_BASE_URL + '/admin/addBlog',{
                title,
                content,
                author_id: userId,
                image: imagePreview,
                id:editBlog?._id || null
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
            console.log(err.response.data)
            Toastify(err.response.data.message || "Failed to publish post.", "warn")
        } finally {
            setIsSubmitting(false);
        }
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
                    <h1 className="font-medium ml-auto mr-auto text-lg">{editBlog?.title ? 'Edit' : 'Create'} New Post</h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-6">
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
                                <Label htmlFor="content" className="text-sm font-medium">
                                    Content <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write your blog post content here..."
                                    className="min-h-[200px] focus:ring-2 focus:ring-blue-500"
                                    required
                                />
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
                                            onError={() => (setImagePreview)('/api/placeholder/500/300')}
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
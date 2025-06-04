"use client"
import { useSelector } from 'react-redux';
import { Button } from '../../Components/ui/button';
import { Card, CardContent } from '../../Components/ui/card';
import { Input } from '../../Components/ui/input';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {useDispatch } from "react-redux";
import { setCurrentBlog } from '../../app/features/blogSlice';
import { ArrowLeft, PlusCircle, Search, User, Eye, Calendar, Pencil, Trash } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import QuillPreviewBox from '../QuillPreviewBox';

const Blogs = () => {
  const dispatch = useDispatch();
  const {userRole} = useSelector((state) => state.auth)
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      const token = localStorage.getItem("token")
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_BASE_URL}/admin/getBlogs`,
          { 
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true 
        }
        );

        const data = res.data;
        if (data.res) {
          setBlogs(data.blogs);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blogs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    dispatch(setCurrentBlog(null));
    router.push('blogs/post-blog');
  };


  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white h-16 border-b z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Button>
          <h1 className="font-medium text-lg">My Blog Posts</h1>
          <div className="w-8"></div> {/* For balanced spacing */}
        </div>
      </header>

      {/* Search and Create */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="w-full sm:flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search blogs by title or content"
              className="pl-10 bg-white border focus-visible:ring-1 focus-visible:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {userRole?.toLowerCase() === 'admin' &&
          <Button
            onClick={handleCreate}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircle size={18} className="mr-1" />
            New Post
          </Button>
          }
        </div>
      </div>

      {/* Blog List */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-gray-500">Loading blogs...</div>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} setBlogs={setBlogs} userRole={userRole} />
            ))}
          </div>
        ) : (
          (userRole.toLowerCase() === 'admin' &&
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchTerm ? "No blogs match your search" : "You haven't created any blog posts yet"}
            </p>
            <Button onClick={() => router.push('blogs/post-blog')}
              className='text-white'>
              Create Your First Blog Post
            </Button>
          </div>
          ) || <div></div>
        )}
      </div>
    </main>
  );
};

const BlogCard = ({ blog, setBlogs, userRole }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  
  const handleEdit = () => {
    dispatch(setCurrentBlog(blog));
    router.push('blogs/post-blog')
  };

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token")
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/admin/deleteBlog/${id}`,
        { 
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true 
        }
      );

      const data = res.data;
      if (data.res) {
        setBlogs((prev) => prev.filter((blog) => blog._id !== id));
        toast.success("Blog deleted successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog");
    } finally {
      setIsDeleting(false);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, (options));
  };

  return (
    <Card className="overflow-hidden p-0 h-full flex flex-col border rounded-none transition-all duration-200">
      <div className="p-1 flex flex-col sm:flex-row">
        {/* Content (Left Side) */}
        <CardContent className=" flex flex-col">
          <h2 className="text-lg flex-grow font-medium mb-2 line-clamp-2">
            {truncateText(blog.title, 70)}
          </h2>

          {/* <p className="text-sm flex-grow text-gray-600 mb-3 line-clamp-3">
            {truncateText(blog.content, 150)}
          </p> */}
          <QuillPreviewBox value={blog.content}/>

          <div className="flex items-center text-xs text-gray-500 flex-wrap gap-2 mt-auto">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{blog.author_name || 'Anonymous'}</span>
            </div>

            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{blog.views || 0}</span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(blog.created_at)}</span>
            </div>
          </div>
        </CardContent>

        {/* Image (Right Side) */}
        <div className="w-full sm:w-32 h-32 sm:h-auto flex-shrink-0 overflow-hidden bg-gray-100">
          {blog.image ? (
            <img
              src={blog.image}
              alt={blog.title}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.currentTarget.src = '/api/placeholder/120/120';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <span className="text-xs">No image</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {userRole?.toLowerCase() === 'admin' &&
      <div className="flex border-t p-2 bg-gray-50 justify-end gap-2 mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          onClick={handleEdit}
        >
          <Pencil size={16} className="mr-1" />
          Edit
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-800 hover:bg-red-50"
          onClick={() => handleDelete(blog._id)}
          disabled={isDeleting}
        >
          <Trash size={16} className="mr-1" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
      }
    </Card>
  );
};

export default Blogs;
"use client"
import React, { useEffect, useState, useRef } from 'react';
import { Label } from "../../../Components/ui/label";
import { Input } from "../../../Components/ui/input";
import { Button } from "../../../Components/ui/button";
import { Textarea } from "../../../Components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../../Components/ui/card";
import { X, Edit3, MapPin, BookOpen, Tag, AlertTriangle, Search, ChevronDown, Upload, Image as ImageIcon, Loader } from "lucide-react";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSelector } from "react-redux";
import axios from 'axios';
import TagsInput from './TagsInput'
import CountryDropdown from './CountryDropdown'
import CategoryDropdown from './CategoryDropdown'
import ImageField from './ImageField';

const WribateProposalForm = () => {
    const {user} = useSelector((state) => state.auth)
    const router = useRouter();
    const [isCompressing, setIsCompressing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        tags: [], // Changed from 'tag' to 'tags' as an array
        country: '',
        context: '',
        image: '', // Base64 string will be stored here
        user_id: user?._id || null
    });

    //handle form change
    const handleFormChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async () => {
        try {
            if (!user?._id) {
                toast.error("Login to continue");
                return;
            }

            if (formData.title.length > 175) {
                toast.error("You have exceeded length of 175 chars");
                return;
            }

            if (formData.tags.length === 0) {
                toast.error("Please add at least one tag");
                return;
            }

            if (!formData.image) {
                toast.error("Please upload an image");
                return;
            }

            if (formData.context.length > 500) {
                toast.error("You have exceeded length of 500 chars in context");
                return;
            }

            setIsSubmitting(true);

            const res = await axios.post(process.env.NEXT_PUBLIC_APP_BASE_URL + '/propose', formData, {
                withCredentials: true
            });

            const data = res.data;

            if (data.res) {
                toast.success("Proposed");
                router.push('/propose-wribate');
            }
        }
        catch (err) {
            console.log(err);
            toast.error("Failed to Add!");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!user?._id) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user?._id) {
        return null;
    }

    // Check if form is valid for submission
    const isFormValid = () => {
        return (
            formData.title.trim() &&
            formData.title.length <= 175 &&
            formData.context.trim() &&
            formData.context.length <= 500 &&
            formData.category &&
            formData.country &&
            formData.tags.length > 0 &&
            formData.image &&
            !isCompressing &&
            !isSubmitting
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            {/* Loading Bar */}
            {isSubmitting && (
                <div className="fixed top-0 left-0 right-0 z-50">
                    <div className="h-1 bg-blue-200">
                        <div className="h-full bg-blue-900 animate-pulse" style={{
                            animation: 'loading-bar 2s ease-in-out infinite'
                        }}></div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes loading-bar {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 100%; }
                }
            `}</style>

            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8 border-l-4 border-blue-900 pl-4">
                    <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">PROPOSE A WRIBATE TOPIC</h1>
                    <div className="h-1 w-24 bg-blue-900 mt-2"></div>
                    <p className="mt-3 text-gray-600 font-medium">
                        Create a thoughtful wribate topic for the Wribate community
                    </p>
                </div>

                <Card className="shadow-lg rounded-none border-t-4 border-blue-900">
                    <CardHeader className="border-b bg-gray-50">
                        <CardTitle className="text-xl font-bold text-blue-900 flex items-center">
                            <Edit3 className="mr-2" size={20} />
                            New Wribate Submission
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Fill in the form below with your wribate proposal details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 px-6">
                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="title" className="font-semibold text-gray-800 flex items-center">
                                    <BookOpen className="mr-2" size={16} />
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="Enter your debate topic"
                                    value={formData.title}
                                    onChange={(e) => handleFormChange("title", e.target.value)}
                                    className="h-12 rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0"
                                    disabled={isSubmitting}
                                />
                                <div className="text-xs text-gray-500 flex justify-between mt-1">
                                    <span>Be clear and concise</span>
                                    <span className={formData.title.length > 175 ? 'text-red-500 font-semibold' : ''}>
                                        {formData.title.length}/175 characters
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="context" className="font-semibold text-gray-800">Context</Label>
                                <Textarea
                                    id="context"
                                    placeholder="Provide additional context for your debate topic"
                                    value={formData.context}
                                    onChange={(e) => handleFormChange("context", e.target.value)}
                                    rows={5}
                                    className="resize-none rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0"
                                    disabled={isSubmitting}
                                />
                                <div className="text-xs text-gray-500 flex justify-between mt-1">
                                    <span>Be clear and concise</span>
                                    <span className={formData.context.length > 500 ? 'text-red-500 font-semibold' : ''}>
                                        {formData.context.length}/500 characters
                                    </span>
                                </div>
                            </div>

                            {/* Image Upload Section */}
                            <ImageField 
                                formData={formData} 
                                handleFormChange={handleFormChange} 
                                isCompressing={isCompressing} 
                                setIsCompressing={setIsCompressing}
                                disabled={isSubmitting}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Category Searchable Dropdown */}
                                <CategoryDropdown 
                                    formData={formData} 
                                    handleFormChange={handleFormChange}
                                    disabled={isSubmitting}
                                />

                                {/* Country Searchable Dropdown */}
                                <CountryDropdown 
                                    formData={formData} 
                                    handleFormChange={handleFormChange}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tags" className="font-semibold text-gray-800 flex items-center">
                                    <Tag className="mr-2" size={16} />
                                    Tags
                                </Label>
                                <TagsInput
                                    value={formData.tags}
                                    onChange={(tags) => handleFormChange("tags", tags)}
                                    disabled={isSubmitting}
                                />
                                <p className="text-xs text-gray-500 mt-1">Press Enter or comma to add a tag</p>
                            </div>

                            {formData.title.length > 175 && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
                                    <AlertTriangle className="text-red-500 mr-2 mt-1 flex-shrink-0" size={18} />
                                    <p className="text-sm text-red-700">
                                        Title exceeds the maximum of 175 characters. Please shorten it.
                                    </p>
                                </div>
                            )}

                            {formData.context.length > 500 && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
                                    <AlertTriangle className="text-red-500 mr-2 mt-1 flex-shrink-0" size={18} />
                                    <p className="text-sm text-red-700">
                                        Context exceeds the maximum of 500 characters. Please shorten it.
                                    </p>
                                </div>
                            )}

                            {isSubmitting && (
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 flex items-start">
                                    <Loader className="text-blue-500 mr-2 mt-1 flex-shrink-0 animate-spin" size={18} />
                                    <p className="text-sm text-blue-700">
                                        Submitting your wribate topic... Please wait.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t px-6 py-4 flex justify-between">
                        <Button
                            variant="outline"
                            className="rounded-none border-2 border-gray-300 hover:bg-gray-100 text-gray-700"
                            disabled={isSubmitting}
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-900 hover:bg-blue-800 text-white px-6 rounded-none min-w-[120px]"
                            disabled={!isFormValid()}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader size={16} className="mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Topic'
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="mt-6 text-center text-sm text-gray-500">
                    All submissions are reviewed by our editorial team before publication
                </div>
            </div>
        </div>
    );
};

export default WribateProposalForm;
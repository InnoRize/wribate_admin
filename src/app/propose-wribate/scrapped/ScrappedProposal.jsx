"use client"
import React, { useEffect, useState, useRef } from 'react';
import { Label } from "../../../Components/ui/label";
import { Input } from "../../../Components/ui/input";
import { Button } from "../../../Components/ui/button";
import { Textarea } from "../../../Components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../../Components/ui/card";
import { X, Edit3, MapPin, BookOpen, Tag, AlertTriangle, Search, ChevronDown, Upload, Image as ImageIcon, Loader, Link } from "lucide-react";
import Toastify from '../../../utils/Toast';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import TagsInput from '../../../Components/TagsInput'
import CountryDropdown from './CountryDropdown'
import CategoryDropdown from './CategoryDropdown';
import { setCurrentScrapped } from '../../features/scrappedSlice';
import SearchableDropdown from '../../../Components/SearchableDropdwon';

const ScrappedProposalForm = () => {
    const {user} = useSelector((state) => state.auth)
    const router = useRouter();
    const dispatch = useDispatch()
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const editScrapped = useSelector((state) => state.scrapped.currentScrapped)

    const [formData, setFormData] = useState({
        Country: editScrapped?.Country || '',
        Category: editScrapped?.Category || '',
        Title: editScrapped?.Title || '',
        Link: editScrapped?.Link || '',
        Decoded_Link: editScrapped?.Decoded_Link || '',
        Debate_Topic: editScrapped?.Debate_Topic || '',
        Article_Text: editScrapped?.Article_Text || '',
        Debate_Context: editScrapped?.Debate_Context || '',
        Authors: editScrapped?.Authors || [],

        revisedCountry: editScrapped?.revisedCountry || '',
        revisedCategory: editScrapped?.revisedCategory || '',
        revisedTitle: editScrapped?.revisedTitle || '',
        revisedLink: editScrapped?.revisedLink || '',
        revisedDecodedLink: editScrapped?.revisedDecodedLink || '',
        revisedDebateTopic: editScrapped?.revisedDebateTopic || '',
        revisedArticleText: editScrapped?.revisedArticleText || '',
        revisedDebateContext: editScrapped?.revisedDebateContext || '',
        revisedAuthors: editScrapped?.revisedAuthors || [],

        image: editScrapped?.image || null,
        status: editScrapped?.status || 'pending',

        user_id: editScrapped?.user_id|| user?._id || null
    });

    //handle form change
    const handleFormChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleFormChange("image",reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancel = () =>{
        dispatch(setCurrentScrapped(null))
        router.back()
    }

    const handleSubmit = async () => {
        try {
            if (!user?._id) {
                Toastify("Login to continue","error");
                return;
            }

            // if (formData.revisedTitle?.length > 175) {
            //     Toastify("You have exceeded length of 175 chars", "error");
            //     return;
            // }

            // if (!formData.image) {
            //     Toastify("Please upload an image", "error");
            //     return;
            // }

            // if (formData.revisedDebateContext?.length > 500) {
            //     Toastify("You have exceeded length of 500 chars in context", "error");
            //     return;
            // }

            setIsSubmitting(true);
            const token = localStorage.getItem("token")
            if(editScrapped){
                const res = await axios.post(process.env.NEXT_PUBLIC_APP_BASE_URL + `/admin/updateScrappedProposal/${editScrapped._id}`,
                    formData,
                    { 
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true 
                    });

                const data = res.data;
                if (data.status) {
                    Toastify(data.message||"Edited", "success");
                    dispatch(setCurrentScrapped(null));
                    window.location.href = '/propose-wribate'
                }
                else {
                    Toastify(data.message || data.message || "Failed to edit scrapped proposal", "error");
                }
            }
            else{
                const res = await axios.post(process.env.NEXT_PUBLIC_APP_BASE_URL + `/admin/addScrappedProposal`,
                    formData,
                    { 
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true 
                    }
                );

                const data = res.data;
                if (data.status || res.status === true) {
                    Toastify("Added Scrapped Data", "success");
                    window.location.href = '/propose-wribate'
                }
                else {
                    Toastify(data.message || "Failed to add scrapped proposal", "error");
                }
            }
            
        }
        catch (err) {
            console.error(err);
            Toastify(err.response?.data?.message ||err.response?.data?.msg || err.message || "Failed to Add!", "error");
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
            // formData.revisedTitle.trim() &&
            // formData.revisedTitle.length <= 175 &&
            // formData.revisedDebateContext.trim() &&
            // formData.revisedDebateContext.length <= 500 &&
            // formData.revisedCategory &&
            // formData.revisedCountry &&
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
                    <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">
                        SCRAPPED PROPOSAL
                    </h1>
                    <div className="h-1 w-24 bg-blue-900 mt-2"></div>
                    {/* <p className="mt-3 text-gray-600 font-medium">
                        Create a thoughtful wribate topic for the Wribate community
                    </p> */}
                </div>

                <Card className="shadow-lg rounded-none border-t-4 border-blue-900">
                    <CardHeader className="border-b bg-gray-50">
                        <CardTitle className="text-xl font-bold text-blue-900 flex items-center">
                            <Edit3 className="mr-2" size={20} />
                            {editScrapped?"Editing Wribate Proposal":"New Wribate Submission"}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Fill in the form below with your scrapped proposal details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 px-6">
                        <div className="space-y-6">
                            {/* Title */}
                            <div className="grid gap-2">
                                <Label className="font-semibold text-gray-800">Title</Label>
                                <p className="text-sm text-gray-500 italic">Original:</p>
                                <Input
                                value={formData.Title}
                                onChange={(e) => handleFormChange("Title", e.target.value)}
                                className="h-12 rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0"
                                disabled={isSubmitting}
                                readOnly={editScrapped?true:false}
                                />
                                <div className="text-xs text-gray-500 flex justify-between mt-1">
                                    <span>Be clear and concise</span>
                                    <span className={formData.Title?.length > 175 ? 'text-red-500 font-semibold' : ''}>
                                        {formData.Title?.length}/175 characters
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 italic">Revised:</p>
                                <Input
                                value={formData.revisedTitle}
                                onChange={(e) => handleFormChange("revisedTitle", e.target.value)}
                                className="h-12 rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0"
                                disabled={isSubmitting}
                                />
                                <div className="text-xs text-gray-500 flex justify-between mt-1">
                                    <span>Be clear and concise</span>
                                    <span className={formData.revisedTitle?.length > 175 ? 'text-red-500 font-semibold' : ''}>
                                        {formData.revisedTitle?.length}/175 characters
                                    </span>
                                </div>
                            </div>

                            {/* Topic */}
                            <div className="grid gap-2">
                                <Label className="font-semibold text-gray-800">Debate Topic</Label>
                                <p className="text-sm text-gray-500 italic">Original:</p>
                                <Input
                                value={formData.Debate_Topic}
                                onChange={(e) => handleFormChange("Debate_Topic", e.target.value)}
                                className="rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0"
                                disabled={isSubmitting}
                                readOnly={editScrapped?true:false}
                                />
                                <p className="text-sm text-gray-500 italic">Revised:</p>
                                <Input
                                value={formData.revisedDebateTopic}
                                onChange={(e) => handleFormChange("revisedDebateTopic", e.target.value)}
                                className="rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0"
                                disabled={isSubmitting}
                                />
                            </div>

                            {/* Article Text */}
                            <div className="grid gap-2">
                                <Label className="font-semibold text-gray-800">Article Text</Label>
                                <p className="text-sm text-gray-500 italic ">Original:</p>
                                <Textarea
                                    id="Article_Text"
                                    placeholder="Provide additional context for your debate topic"
                                    value={formData.Article_Text}
                                    onChange={(e) => handleFormChange("Article_Text", e.target.value)}
                                    rows={5}
                                    className="resize-none rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0"
                                    disabled={isSubmitting}
                                    readOnly={editScrapped?true:false}
                                />
                                <p className="text-sm text-gray-500 italic ">Revised:</p>
                                <Textarea
                                    id="revisedArticleText"
                                    placeholder="Provide additional context for your debate topic"
                                    value={formData.revisedArticleText}
                                    onChange={(e) => handleFormChange("revisedArticleText", e.target.value)}
                                    rows={5}
                                    className="resize-none rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0"
                                    disabled={isSubmitting}
                                />
                            </div>                            
                            
                            {/* Context */}
                            <div className="grid gap-2">
                                <Label className="font-semibold text-gray-800">Context</Label>
                                <p className="text-sm text-gray-500 italic  ">Original:</p>
                                <Textarea
                                    id="Debate_Context"
                                    placeholder="Provide additional context for your debate topic"
                                    value={formData.Debate_Context}
                                    onChange={(e) => handleFormChange("Debate_Context", e.target.value)}
                                    rows={5}
                                    className="resize-none rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0"
                                    disabled={isSubmitting}
                                    readOnly={editScrapped?true:false}
                                />
                                <div className="text-xs text-gray-500 flex justify-between mt-1">
                                    <span className={formData.Debate_Context?.length > 500 ? 'text-red-500 font-semibold' : ''}>
                                        {formData.Debate_Context?.length}/500 characters
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 italic  ">Original:</p>
                                <Textarea
                                    id="revisedDebateContext"
                                    placeholder="Provide additional context for your debate topic"
                                    value={formData.revisedDebateContext}
                                    onChange={(e) => handleFormChange("revisedDebateContext", e.target.value)}
                                    rows={5}
                                    className="resize-none rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0"
                                    disabled={isSubmitting}
                                />
                                <div className="text-xs text-gray-500 flex justify-between mt-1">
                                    <span>Be clear and concise</span>
                                    <span className={formData.revisedDebateContext?.length > 500 ? 'text-red-500 font-semibold' : ''}>
                                        {formData.revisedDebateContext?.length}/500 characters
                                    </span>
                                </div>
                            </div>

                            {/* Link */}
                            <div className="grid gap-2">
                                <Label className="font-semibold text-gray-800">Link</Label>
                                {editScrapped?
                                <div className='text-sm text-gray-500 italic max-w-full overflow-hidden overflow-ellipsis'>
                                    Original:<br></br>
                                    <a href={formData.Link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        {formData.Link || ''}
                                    </a>
                                </div>
                                :
                                <>
                                <p className="text-sm text-gray-500 italic">Original:</p>
                                <Input
                                    value={formData.Link}
                                    onChange={(e) => handleFormChange("Link", e.target.value)}
                                    className="rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0"
                                    disabled={isSubmitting}
                                    readOnly={editScrapped?true:false}
                                />
                                </>
                                }
                                <p className="text-sm text-gray-500 italic">Revised:</p>
                                <Input
                                value={formData.revisedLink}
                                onChange={(e) => handleFormChange("revisedLink", e.target.value)}
                                className="rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0"
                                disabled={isSubmitting}
                                />
                            </div>

                            {/* Decoded Link */}
                            <div className="grid gap-2">
                                <Label className="font-semibold text-gray-800">Decoded Link</Label>
                                {editScrapped?
                                <div className='text-sm text-gray-500 italic max-w-full overflow-hidden overflow-ellipsis'>
                                    Original:<br></br>
                                    <a href={formData.Decoded_Link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        {formData.Decoded_Link || ''}
                                    </a>
                                </div>
                                :
                                <>
                                <p className="text-sm text-gray-500 italic">Original:</p>
                                <Input
                                    value={formData.Decoded_Link}
                                    onChange={(e) => handleFormChange("Decoded_Link", e.target.value)}
                                    className="rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0"
                                    disabled={isSubmitting}
                                    readOnly={editScrapped?true:false}
                                />
                                </>
                                }
                                <p className="text-sm text-gray-500 italic">Revised:</p>
                                <Input
                                value={formData.revisedDecodedLink}
                                onChange={(e) => handleFormChange("revisedDecodedLink", e.target.value)}
                                className="rounded-none border-2 border-gray-200 focus:border-blue-900 focus:ring-0"
                                disabled={isSubmitting}
                                />
                            </div>

                            {/* Image Upload Section */}
                            <div className="grid gap-2">
                                <Label htmlFor="image" className="text-sm font-medium">
                                    Featured Image
                                </Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="cursor-pointer"
                                />

                                {formData.image && (
                                    <div className="mt-3 border rounded-md overflow-hidden bg-gray-50">
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="max-h-56 object-contain mx-auto"
                                            // onError={() => setImagePreview('/api/placeholder/500/300')}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Country and Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Category Searchable Dropdown */}
                                <div>
                                    { editScrapped?
                                    <>
                                    <CategoryDropdown 
                                        formData={formData} 
                                        handleFormChange={handleFormChange}
                                        disabled={isSubmitting}
                                        keyString={'revisedCategory'}
                                        title={'Revised Category'}
                                    />
                                    <p className="text-sm text-gray-500 italic">Original: {formData.Category}</p>
                                    </>
                                    :
                                    <>
                                    <CategoryDropdown 
                                        formData={formData} 
                                        handleFormChange={handleFormChange}
                                        disabled={isSubmitting}
                                        keyString={'Category'}
                                        readOnly={editScrapped?true:false}
                                    />
                                    <br></br>
                                    <CategoryDropdown 
                                        formData={formData} 
                                        handleFormChange={handleFormChange}
                                        disabled={isSubmitting}
                                        keyString={'revisedCategory'}
                                        title={'Revised Category'}
                                    />
                                    </>
                                    }
                                </div>
                                {/* Country Searchable Dropdown */}
                                <div>
                                    { editScrapped?
                                    <>
                                    <CountryDropdown 
                                        formData={formData} 
                                        handleFormChange={handleFormChange}
                                        disabled={isSubmitting}
                                        keyString={'revisedCountry'}
                                        title={'Revised Country'}
                                    />
                                    <p className="text-sm text-gray-500 italic">Original: {formData.Country}</p>
                                    </>
                                    :
                                    <>
                                    <CountryDropdown 
                                        formData={formData} 
                                        handleFormChange={handleFormChange}
                                        disabled={isSubmitting}
                                        keyString={'Country'}
                                        readOnly={editScrapped?true:false}
                                    />
                                    <br></br>
                                    <CountryDropdown 
                                        formData={formData} 
                                        handleFormChange={handleFormChange}
                                        disabled={isSubmitting}
                                        keyString={'revisedCountry'}
                                        title={'Revised Country'}
                                    />
                                    </>
                                    }
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label className="font-semibold text-gray-800">
                                    Authors
                                </Label>
                                {editScrapped?
                                <p className="text-sm text-gray-500 italic">Original: {formData.Authors.join(', ')}</p>
                                :
                                <>
                                <p className="text-sm text-gray-500 italic">Original:</p>
                                <TagsInput
                                    value={formData.Authors}
                                    onChange={(Authors) => handleFormChange("Authors", Authors)}
                                    disabled={isSubmitting}
                                />
                                </>
                                }
                                <p className="text-sm text-gray-500 italic">Revised:</p>
                                <TagsInput
                                    value={formData.revisedAuthors}
                                    onChange={(revisedAuthors) => handleFormChange("revisedAuthors", revisedAuthors)}
                                    disabled={isSubmitting}
                                />
                                <p className="text-xs text-gray-500 mt-1">Press Enter or comma to add a tag</p>
                            </div>

                            <div className="grid gap-2">
                                <SearchableDropdown
                                    title={"Status"}
                                    keyString={"status"}
                                    value={formData.status}
                                    options={['pending', 'approved', 'rejected']}
                                    handleFormChange={handleFormChange}
                                />
                            </div>

                            {formData.revisedTitle?.length > 175 && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
                                    <AlertTriangle className="text-red-500 mr-2 mt-1 flex-shrink-0" size={18} />
                                    <p className="text-sm text-red-700">
                                        Title exceeds the maximum of 175 characters. Please shorten it.
                                    </p>
                                </div>
                            )}

                            {formData.revisedDebateContext?.length > 500 && (
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
                            onClick={handleCancel}
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
                                (editScrapped?'Save':'Add')
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default ScrappedProposalForm;
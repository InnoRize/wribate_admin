import React, { useEffect, useState, useRef } from 'react';
import { X, Edit3, MapPin, BookOpen, Tag, AlertTriangle, Search, ChevronDown, Upload, Image as ImageIcon } from "lucide-react";
import Compressor from 'compressorjs';
import toast from 'react-hot-toast';
import { Button } from "../../../Components/ui/button";
import { Label } from "../../../Components/ui/label";

const ImageField = ({formData, handleFormChange, isCompressing, setIsCompressing}) => {
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);



    // Handle image upload and compression
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        // Check file size (limit to 8MB)
        if (file.size > 8 * 1024 * 1024) {
            toast.error('Image size should be less than 8MB');
            return;
        }

        setIsCompressing(true);

        // Compress the image
        new Compressor(file, {
            quality: 0.5,
            maxWidth: 1200,
            maxHeight: 1200,
            success: (compressedFile) => {
                // Convert to base64
                const reader = new FileReader();
                reader.onload = () => {
                    const base64String = reader.result;
                    handleFormChange('image', base64String);
                    setImagePreview(base64String);
                    setIsCompressing(false);
                    toast.success('Image uploaded successfully');
                };
                reader.onerror = () => {
                    toast.error('Failed to process image');
                    setIsCompressing(false);
                };
                reader.readAsDataURL(compressedFile);
            },
            error: (error) => {
                console.error('Processing error:', error);
                toast.error('Failed to process image');
                setIsCompressing(false);
            }
        });
    };

    // Remove image
    const removeImage = () => {
        handleFormChange('image', '');
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };


    return (
        <div className="grid gap-2">
            <Label htmlFor="image" className="font-semibold text-gray-800 flex items-center">
                <ImageIcon className="mr-2" size={16} />
                Image *
            </Label>

            {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-none p-8 text-center hover:border-blue-900 transition-colors">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                    />
                    <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center"
                    >
                        {isCompressing ? (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mb-2"></div>
                                <p className="text-sm text-gray-600">Processing image...</p>
                            </div>
                        ) : (
                            <>
                                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-sm text-gray-600 mb-2">
                                    Click to upload an image or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 8MB
                                </p>
                            </>
                        )}
                    </label>
                </div>
            ) : (
                <div className="relative border-2 border-gray-200 rounded-none p-4">
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full h-48 object-cover mx-auto rounded"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2 rounded-full p-1 h-8 w-8"
                    >
                        <X size={16} color='red' />
                    </Button>
                </div>
            )}
        </div>

    )
}

export default ImageField

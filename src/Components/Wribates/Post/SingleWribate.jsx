"use client";
import { useState, useRef, useEffect } from "react";
import {
  useGetCategoriesQuery,
  useGetCountriesQuery,
  useCreateWribateMutation,
  useUpdateWribateMutation,
} from "../../../app/services/authApi";
import { BookOpen } from "lucide-react";
import Toastify from "../../../utils/Toast";
import { useRouter } from "next/navigation";

import getAuthHeader from "../../../utils/authHeader";
import Compressor from 'compressorjs';
import NavigationBar from './NavigationBar'
import DebatePreview from './DebatePreview'
import DebateInfomation from './DebateInfomation'
import Participants from './Participants'
import Settings from './Settings'
import { useSelector, useDispatch } from "react-redux";
import { clearWribate } from "../../../app/features/wribateSlice";

const SingleWribate = () => {
  const {userId, userRole} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { data:categoriesData } = useGetCategoriesQuery();
  let categories = categoriesData?.catgories || [];
  const sortedCategories = [...categories].sort((a, b) => 
      a.categoryName.localeCompare(b.categoryName)
  );

  const { data: countriesData } = useGetCountriesQuery();
  let countries = countriesData?.countries || [];
  const sortedCountries = [...countries].sort((a, b) =>
      a.countryName.localeCompare(b.countryName)
  );

  const dateInputRef = useRef(null);
  const router = useRouter();

  const [createWribate, { isLoading: isCreating }] = useCreateWribateMutation();
  const [updateWribate, { isLoading: isUpdating }] = useUpdateWribateMutation();

  const [creatNew, setCreatNew] = useState(false);
  const [wribateId, setWribateId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    coverImage:null,
    coverImageBase64: null,
    leadFor: "",
    leadAgainst:"",
    supportingFor: "",
    supportingAgainst: "",
    judge1:"",
    judge2:"",
    judge3: "",
    startDate: "",
    durationDays: 1,
    category: "",
    country: "",
    institution: "",
    context: "",
    scope: "Open",
    type: "Free",
    prizeAmount: "",
    _id: userId
  });
  const editWriabate = useSelector((state) => state.wribate.currentWribate);
  
  useEffect(() => {

    if (editWriabate) {
      setWribateId(editWriabate._id);
      setFormData({
        title: editWriabate?.title || "",
        coverImage: editWriabate?.coverImage||null,
        coverImageBase64: editWriabate?.coverImage|| null,
        leadFor: editWriabate?.leadFor || "",
        leadAgainst: editWriabate?.leadAgainst || "",
        supportingFor: editWriabate?.supportingFor || "",
        supportingAgainst: editWriabate?.supportingAgainst || "",
        judge1: editWriabate?.judges[0] || "",
        judge2: editWriabate?.judges[1] || "",
        judge3: editWriabate?.judges[2] || "",
        startDate: editWriabate?.startDate || "",
        durationDays: editWriabate?.durationDays || 1,
        category: editWriabate?.category || "",
        country: editWriabate?.country || "",
        institution: editWriabate?.institution || "",
        context: editWriabate?.context || "",
        scope: editWriabate?.scope || "Private",
        type: editWriabate?.type || "Free",
        prizeAmount: editWriabate?.prizeAmount ||0,
        _id: editWriabate?.createdBy || userId
      });
      setImagePreview(editWriabate?.coverImage || null);
      setCreatNew(false);
    }
    else {
      setWribateId(null);
      setCreatNew(true);
    }
  }, []);

  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    new Compressor(file, {
      quality: 0.5,
      maxWidth: 1024,
      maxHeight: 1024,
      success(result) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setFormData((prev) => ({ ...prev, coverImageBase64: reader.result, coverImage: result }));
        };
        reader.readAsDataURL(result);
      },
      error(err) {
        console.error("Compression failed: ", err);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (creatNew) {
      try {
        let wribateData = { ...formData };
        wribateData.judges = [formData.judge1, formData.judge2, formData.judge3];
        delete wribateData.coverImage;

        wribateData.startDate = new Date(wribateData.startDate).toISOString();
      
        const response = await createWribate(wribateData, {
          withCredentials: true,
          headers: getAuthHeader()
        });

        if (response.data.res === true) {
          Toastify("Wribate created successfully", "success");
          dispatch(clearWribate());
          window.location.href = '/wribates';
        } else {
          Toastify(response?.data?.msg || "Error creating wribate", "error");
        }
      } catch (err) {
        console.error(err);
        Toastify(err?.data?.message || err?.message || "Error creating wribate", "error");
      } finally {
        setIsLoading(false);
      }
    }
    else if(wribateId) {
      try {
        let wribateData = { ...formData };
        wribateData.judges = [formData.judge1, formData.judge2, formData.judge3];
        delete wribateData.coverImage;

        wribateData.startDate = new Date(wribateData.startDate).toISOString();
        
        const response = await updateWribate({id:wribateId, wribateData}, {
          withCredentials: true,
          headers: getAuthHeader()
        });
        console.log("Update Response:", response);

        if (response?.data && response.data?.res===true) {
          Toastify("Wribate created successfully", "success");
          dispatch(clearWribate());
          window.location.href = '/wribates';
        } else {
          Toastify(response?.data?.msg || response?.error?.data?.message || "Error creating wribate", "error");
        }
      } catch (err) {
        console.error("Error while updating..",err);
        Toastify(err?.data?.message || err?.message || "Error creating wribate", "error");
      } finally {
        setIsLoading(false);
      }
    }
    else {
      console.error("Wribate ID not found");
      Toastify("Wribate ID not found.", "error");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{creatNew?"Create New":"Edit"}  Wribate</h1>
          <p className="text-gray-600 mt-1">Set up your debate parameters, invite participants, and establish rules</p>
        </div>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="bg-white border-2 border-blue-900 text-blue-900 font-bold py-2 px-6 flex items-center"
        >
          {previewMode ? "Edit" : "Preview"} <BookOpen className="ml-2" size={16} />
        </button>
      </div>

      {previewMode ? (
        <DebatePreview formData={formData} imagePreview={imagePreview} setPreviewMode={setPreviewMode} />
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow-lg">
          <NavigationBar setCurrentSection={setCurrentSection} currentSection={currentSection} />

          <div className="p-6">
            {/* Section 1: Debate Information */}
            {currentSection === 1 && (
              <DebateInfomation  formData={formData} imagePreview={imagePreview} handleInputChange={handleInputChange} handleFileUpload={handleFileUpload} categoryOptions={sortedCategories} countryOptions={sortedCountries} userRole={userRole} setCurrentSection={setCurrentSection}/>
            )}

            {/* Section 2: Participants */}
            {currentSection === 2 && (
              <Participants formData={formData} handleInputChange={handleInputChange} setCurrentSection={setCurrentSection}/>
            )}

            {/* Section 3: Settings & Schedule */}
            {currentSection === 3 && (
             <Settings formData={formData} handleInputChange={handleInputChange} setCurrentSection={setCurrentSection}  handleToggleChange={handleToggleChange} isLoading={isLoading} creatNew={creatNew}/>
            )}
          </div>
        </form>
      )}

      {/* Floating Preview Box (appears when not in preview mode) */}
    </div>
  );
};

export default SingleWribate;
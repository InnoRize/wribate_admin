"use client";
import { useState, useRef, useEffect } from "react";
import {
  useGetCategoriesQuery,
  useGetCountriesQuery,
  useCreateWribateMutation,
} from "../../../app/services/authApi";
import { Calendar, Info, Upload, Clock, Users, Award, Check, ChevronRight, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
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

  const [creatNew, setCreatNew] = useState(false);
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
      // setCurrentWriabate(editWriabate);
      setFormData({
        title: editWriabate?.title || "",
        coverImage: editWriabate?.coverImage||null,
        coverImageBase64: null,
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
        scope: editWriabate?.scope || "Open",
        type: editWriabate?.type || "Free",
        prizeAmount: editWriabate?.prizeAmount ||"",
        _id: editWriabate?.createdBy || userId
      });
      setCreatNew(false);
    }
    else {
      // setCurrentWriabate(null);
      setCreatNew(true);
    }
  }, []);


  // Shared class styles
  const inputClass = "w-full p-3 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-900 text-sm transition-all duration-200 bg-gray-50";

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

        const istOffset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(wribateData.startDate).getTime() + istOffset;
        wribateData.startDate = new Date(istDate).toISOString();

        // const response = await axios.post(
        //   process.env.NEXT_PUBLIC_APP_BASE_URL + '/user/createWribate',
        //   wribateData,
        //   {
        //     withCredentials: true,
        //     headers: getAuthHeader()
        //   }
        // );
      
        const response = await createWribate(wribateData, {
          withCredentials: true,
          headers: getAuthHeader()
        });

        if (response.data.res) {
          toast.success("Wribate created successfully");
          dispatch(clearWribate());
          router.push("/wribates");
        } else {
          toast.error(response?.data?.msg || "Error creating wribate");
        }
      } catch (err) {
        console.error(err);
        toast.error(err?.data?.message || err?.message || "Error creating wribate");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Wribate</h1>
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
             <Settings formData={formData} handleInputChange={handleInputChange} setCurrentSection={setCurrentSection}  handleToggleChange={handleToggleChange} isLoading={isLoading}/>
            )}
          </div>
        </form>
      )}

      {/* Floating Preview Box (appears when not in preview mode) */}
    </div>
  );
};

export default SingleWribate;
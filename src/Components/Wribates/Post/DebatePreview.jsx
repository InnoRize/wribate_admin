import { Calendar, ChevronRight, Clock } from "lucide-react";

// Preview Component
  const DebatePreview = ({formData,imagePreview,setPreviewMode}) => {
    
    return (
    <div className="bg-white shadow-lg w-full">
      <div className="relative">
        {imagePreview ? (
          <img src={imagePreview} alt="Debate preview" className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No cover image selected</span>
          </div>
        )}
        <div className="absolute top-0 left-0 bg-blue-900 text-white px-4 py-1">
          {formData.category || "Uncategorized"}
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{formData.title || "Untitled Debate"}</h2>
        <p className="text-gray-600 mb-4">{formData.context || "No context provided"}</p>
        
        <div className="flex items-center mb-4">
          <Calendar size={16} className="text-blue-900 mr-2" />
          <span className="text-sm">{formData.startDate ? new Date(formData.startDate).toLocaleDateString() : "Date not set"}</span>
          <span className="mx-2">•</span>
          <Clock size={16} className="text-blue-900 mr-2" />
          <span className="text-sm">{formData.durationDays} days</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-red-50 p-3 border-l-4 border-red-600">
            <h3 className="font-bold text-sm mb-1">FOR</h3>
            <p className="text-sm text-gray-700">{formData.leadFor || "No lead panelist"}</p>
            <p className="text-sm text-gray-700">{formData.supportingFor || "No supporting panelist"}</p>
          </div>
          <div className="bg-blue-50 p-3 border-l-4 border-blue-600">
            <h3 className="font-bold text-sm mb-1">AGAINST</h3>
            <p className="text-sm text-gray-700">{formData.leadAgainst || "No lead panelist"}</p>
            <p className="text-sm text-gray-700">{formData.supportingAgainst || "No supporting panelist"}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className={`px-3 py-1 text-xs font-bold ${formData.scope === "Private" ? "bg-gray-200" : "bg-green-100 text-green-800"}`}>
              {formData.scope}
            </span>
            <span className="mx-2">•</span>
            <span className={`px-3 py-1 text-xs font-bold ${formData.type === "Sponsored" ? "bg-yellow-100 text-yellow-800" : "bg-gray-200"}`}>
              {formData.type === "Sponsored" ? `${formData.prizeAmount || "$"} Prize` : "Free"}
            </span>
          </div>
          
          <button 
            onClick={() => setPreviewMode(false)} 
            className="text-blue-900 font-bold text-sm flex items-center"
          >
            Edit <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )};


  export default DebatePreview;
import React from 'react'
import FieldLabel, { tooltips } from './FieldLabel'
import { Info, Clock } from "lucide-react";

const Settings = ({ formData, handleInputChange, setCurrentSection, handleToggleChange, isLoading }) => {

    const inputClass = "w-full p-3 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-900 text-sm transition-all duration-200  bg-gray-200";
    return (
        <div>
            {/* Schedule */}
            <div className="mb-8">
                <div className="flex items-center mb-6">
                    <div className="bg-blue-900 text-white p-2 mr-3">
                        <Clock size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Schedule</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-gray-50 p-6">
                    <div>
                        <FieldLabel htmlFor="startDate" tooltip={tooltips.startDate}>
                            Start Date & Time*
                        </FieldLabel>
                        <div className="relative">
                            <input
                                id="startDate"
                                type="datetime-local"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className={`${inputClass} pr-10`}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <FieldLabel htmlFor="durationDays" tooltip={tooltips.durationDays}>
                            Duration in Days*
                        </FieldLabel>
                        <input
                            id="durationDays"
                            type="number"
                            name="durationDays"
                            value={formData.durationDays}
                            onChange={handleInputChange}
                            className={inputClass}
                            max="30"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Additional Settings */}
            <div className="mb-8">
                <div className="flex items-center mb-6">
                    <div className="bg-blue-900 text-white p-2 mr-3">
                        <Info size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Additional Settings</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Scope Toggle */}
                    <div className="p-4 bg-gray-50 border-l-4 border-gray-800">
                        <FieldLabel htmlFor="scope" tooltip={tooltips.scope}>
                            Visibility
                        </FieldLabel>
                        <div className="flex items-center h-12">
                            <span className={`mr-3 text-sm ${formData.scope === "Open" ? "font-bold text-blue-900" : "text-gray-500"}`}>
                                Open to All
                            </span>
                            <div
                                className={`w-12 h-6 flex items-center rounded-none p-1 cursor-pointer ${formData.scope === "Private" ? "bg-blue-900" : "bg-gray-300"}`}
                                onClick={() =>
                                    handleToggleChange("scope", formData.scope === "Open" ? "Private" : "Open")
                                }
                            >
                                <div
                                    className={`bg-white h-5 w-5 shadow-md transform transition-transform ${formData.scope === "Private" ? "translate-x-6" : ""}`}
                                ></div>
                            </div>
                            <span className={`ml-3 text-sm ${formData.scope === "Private" ? "font-bold text-blue-900" : "text-gray-500"}`}>
                                Private
                            </span>
                        </div>
                    </div>

                    {/* Type Toggle */}
                    <div className="p-4 bg-gray-50 border-l-4 border-gray-800">
                        <FieldLabel htmlFor="type" tooltip={tooltips.type}>
                            Debate Type
                        </FieldLabel>
                        <div className="flex items-center h-12">
                            <span className={`mr-3 text-sm ${formData.type === "Free" ? "font-bold text-blue-900" : "text-gray-500"}`}>
                                Free
                            </span>
                            <div
                                className={`w-12 h-6 flex items-center rounded-none p-1 cursor-pointer ${formData.type === "Sponsored" ? "bg-blue-900" : "bg-gray-300"}`}
                                onClick={() => handleToggleChange("type", formData.type === "Free" ? "Sponsored" : "Free")}
                            >
                                <div className={`bg-white h-5 w-5 shadow-md transform transition-transform ${formData.type === "Sponsored" ? "translate-x-6" : ""}`}>
                                </div>
                            </div>
                            <span className={`ml-3 text-sm ${formData.type === "Sponsored" ? "font-bold text-blue-900" : "text-gray-500"}`}>
                                Sponsored
                            </span>
                        </div>
                    </div>
                </div>

                {/* Conditional Prize Field */}
                {formData.type === "Sponsored" && (
                    <div className="mb-6 bg-yellow-50 p-4 border-l-4 border-yellow-600">
                        <FieldLabel htmlFor="prizeAmount" tooltip={tooltips.prizeAmount}>
                            Prize Amount*
                        </FieldLabel>
                        <input
                            id="prizeAmount"
                            type="text"
                            name="prizeAmount"
                            value={formData.prizeAmount}
                            onChange={handleInputChange}
                            className={`${inputClass} bg-yellow-50`}
                            placeholder="e.g. $500"
                            required={formData.type === "Sponsored"}
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-between mt-10">
                <button
                    type="button"
                    onClick={() => setCurrentSection(2)}
                    className="border-2 border-blue-900 text-blue-900 font-bold py-3 px-8"
                >
                    Back
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-900 text-white font-bold py-3 px-8 flex items-center"
                >
                    {(isLoading) ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Wribate...
                        </>
                    ) : "Submit & Create Wribate"}
                </button>
            </div>
        </div>
    )
}

export default Settings

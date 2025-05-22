
import { Users, Check, ChevronRight } from "lucide-react";
import FieldLabel, { tooltips } from './FieldLabel'

const Participants = ({ formData, handleInputChange, setCurrentSection}) => {


    const inputClass = "w-full p-3 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-900 text-sm transition-all duration-200  bg-gray-200";
    return (
        <div>
            {/* For Panel */}
            <div className="mb-8">
                <div className="flex items-center mb-6">
                    <div className="bg-blue-900 text-white p-2 mr-3">
                        <Users size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Panel Setup</h2>
                </div>

                <div className="flex flex-row flex-wrap justify-between gap-2 mb-6">
                    <div className="border-2 border-red-600 p-6 w-full sm:w-[40%] bg-gray-50">
                        <h3 className="font-bold text-red-600 mb-4 text-lg border-b border-gray-200 pb-2">FOR THE MOTION</h3>
                        <div className="space-y-5">
                            <div>
                                <FieldLabel htmlFor="leadFor" tooltip={tooltips.leadFor}>
                                    Lead Panelist Email*
                                </FieldLabel>
                                <input
                                    id="leadFor"
                                    type="email"
                                    name="leadFor"
                                    value={formData.leadFor}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                    placeholder="Email address"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center w-full sm:w-fit text-4xl font-bold justify-center">
                        VS
                    </div>

                    <div className="border-2 border-blue-600 p-6 w-full sm:w-[40%] bg-gray-50">
                        <h3 className="font-bold text-blue-600 mb-4 text-lg border-b border-gray-200 pb-2">AGAINST THE MOTION</h3>
                        <div className="space-y-5">
                            <div>
                                <FieldLabel htmlFor="leadAgainst" tooltip={tooltips.leadAgainst}>
                                    Lead Panelist Email*
                                </FieldLabel>
                                <input
                                    id="leadAgainst"
                                    type="email"
                                    name="leadAgainst"
                                    value={formData.leadAgainst}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                    placeholder="Email address"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Judges */}
            <div className="mb-8">
                <div className="flex items-center mb-6">
                    <div className="bg-blue-900 text-white p-2 mr-3">
                        <Check size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Judges (optional)</h2>
                </div>

                <div className="bg-gray-50 p-6 border-l-4 border-gray-800 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <FieldLabel htmlFor="judge1" tooltip={tooltips.judges}>
                                Judge 1 Email
                            </FieldLabel>
                            <input
                                id="judge1"
                                type="email"
                                name="judge1"
                                value={formData.judge1}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <FieldLabel htmlFor="judge2" tooltip={tooltips.judges}>
                                Judge 2 Email
                            </FieldLabel>
                            <input
                                id="judge2"
                                type="email"
                                name="judge2"
                                value={formData.judge2}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <FieldLabel htmlFor="judge3" tooltip={tooltips.judges}>
                                Judge 3 Email
                            </FieldLabel>
                            <input
                                id="judge3"
                                type="email"
                                name="judge3"
                                value={formData.judge3}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="Email address"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-10">
                <button
                    type="button"
                    onClick={() => setCurrentSection(1)}
                    className="border-2 border-blue-900 text-blue-900 font-bold py-3 px-8"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={() => setCurrentSection(3)}
                    className="bg-blue-900 text-white font-bold py-3 px-8 flex items-center"
                >
                    Next: Settings <ChevronRight size={20} className="ml-2" />
                </button>
            </div>
        </div>
    )
}

export default Participants

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  useAddSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from "../../app/services/authApi";
import getAuthHeader from "../../utils/authHeader";
import Toastify from "../../utils/Toast";
import { useSelector, useDispatch} from "react-redux";
import { clearSubscription } from "../../app/features/subscriptionSlice";
import { Description } from "./Description";

export default function SubscriptionForm() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [creatNew, setCreatNew] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [subId, setSubId] = useState()

    const [addSubscription, { isLoading: isAdding }] = useAddSubscriptionMutation();
    const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();

    const [formData, setFormData] = useState({
        name: "",
        currency: "",
        price: "",
        pricePerDuration: "month",
        duration: "",
        description: "",
    });
    const editSubscription = useSelector((state) => state.subscription.currentSubscription);

    useEffect(()=>{
        if (editSubscription){
            setFormData({
                name: editSubscription?.name || "",
                currency: editSubscription?.currency ||  "",
                price: editSubscription?.price || editSubscription?.price === 0? 0 : "",
                pricePerDuration: editSubscription?.pricePerDuration || "month",
                duration: editSubscription?.duration? editSubscription?.duration : editSubscription?.duration === 0? 0 :"",
                description: editSubscription?.description || "",
            })
            setSubId(editSubscription._id)
        }
        else{
            setCreatNew(true);
        }
    }, [editSubscription]); 

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const setDescription = (html) => {
        setFormData((prev) => ({ ...prev, description: html }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Required";
        if (!formData.currency) newErrors.currency = "Required";
        if ((!formData.price && formData.price) || isNaN(formData.price)) newErrors.price = "Invalid price";
        if (!["month", "year"].includes(formData.pricePerDuration))
        newErrors.pricePerDuration = "Invalid";
        if ((!formData.duration && formData.duration!==0) || isNaN(formData.duration)) newErrors.duration = "Invalid";
        if (!formData.description) newErrors.description = "Required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!validate()) return;
        if (creatNew) {
            try {
                const response = await addSubscription({ newSubscription: formData }, {
                    withCredentials: true,
                    headers: getAuthHeader()
                });

                if (response.data.status) {
                    Toastify("Subscription created successfully","success");
                    dispatch(clearSubscription());
                    router.push("/subscriptions");
                } else {
                    Toastify(response?.data?.msg || "Error creating subscription","warn");
                }
            } catch (err) {
                console.error(err);
                Toastify(err?.message || "error occured", "warn");
            } finally {
                setIsLoading(false);
            }
        }
        else{
            try {
                const response = await updateSubscription({ id: subId, updatedSubscription: formData }, {
                    withCredentials: true,
                    headers: getAuthHeader()
                });

                console.log(response)

                if (!response.error && response.data.status) {
                    Toastify("Subscription edited successfully","success");
                    dispatch(clearSubscription());
                    router.push("/subscriptions");
                } else {
                    Toastify(response?.data?.msg|| response.error.data.message || "Error editing subscription","warn");
                }
            } catch (err) {
                console.error(err);
                Toastify(err?.message || "error occured", "warn");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCancel = () => {
        dispatch(clearSubscription());
        setErrors({});
        router.push("/subscriptions");
    };

    return (
        <div className="content-center">
            <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
                <h2 className="text-xl font-semibold mb-4">{creatNew?"New":"Edit"} Subscription</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">     
                    <div className="flex flex-row">
                        <div className="pr-2" >
                            <label className="block font-medium">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full mt-1 p-1 border rounded"
                            />
                            {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                        </div>
                        <div className="flex flex-row">
                            <div>
                                <label className="block font-medium">Currency (e.g. ₹, $)</label>
                                {/* <input
                                    type="text"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className="w-32 mt-1 p-1 border rounded"
                                /> */}
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className="w-32 mt-1 p-1 border rounded"
                                >
                                    <option value="₹">₹ (INR)</option>
                                    <option value="$">$ (USD)</option>
                                </select>
                                {errors.currency && <span className="text-red-500 text-xs">{errors.currency}</span>}
                            </div>
                            <div>
                                <label className="block font-medium">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-24 mt-1 p-1 border rounded"
                                />
                                {errors.price && <span className="text-red-500 text-xs">{errors.price}</span>}
                            </div>
                            <div className="w">
                                <label className="block font-medium">Price Per Duration</label>
                                <select
                                    name="pricePerDuration"
                                    value={formData.pricePerDuration}
                                    onChange={handleChange}
                                    className="w-32 mt-1 p-1 border rounded"
                                >
                                    <option value="month">Month</option>
                                    <option value="year">Year</option>
                                </select>
                                {errors.pricePerDuration && (
                                    <span className="text-red-500 text-xs">{errors.pricePerDuration}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                    <label className="block font-medium">Duration</label>
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full mt-1 p-1 border rounded"
                    />
                    {errors.duration && <span className="text-red-500 text-xs">{errors.duration}</span>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block font-medium">HTML Description</label>
                        <Description
                            description={formData.description}
                            setDescription={setDescription}
                            disableEdit={false}
                        />
                        {errors.description && (
                            <span className="text-red-500 text-xs">{errors.description}</span>
                        )}
                    </div>

                    <div className="md:col-span-2 flex justify-center space-x-2 mt-2">
                        <Button
                            type="submit"
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Submit
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCancel}
                            className="text-white bg-red-600 hover:bg-red-700 "
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

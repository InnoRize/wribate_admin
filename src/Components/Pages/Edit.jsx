import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  useAddPageMutation,
  useUpdatePageMutation,
} from "../../app/services/authApi";
import getAuthHeader from "../../utils/authHeader";
import Toastify from "../../utils/Toast";
import { useSelector, useDispatch} from "react-redux";
import { clearPage } from "../../app/features/pageSlice";
import { Description } from "./Description";

export default function PageForm() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [creatNew, setCreatNew] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [subId, setSubId] = useState()

    const [addPage, { isLoading: isAdding }] = useAddPageMutation();
    const [updatePage, { isLoading: isUpdating }] = useUpdatePageMutation();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const editPage = useSelector((state) => state.page.currentPage);

    useEffect(()=>{
        if (editPage){
            setFormData({
                name: editPage?.name || "",
                description: editPage?.description || "",
            })
            setSubId(editPage._id)
        }
        else{
            setCreatNew(true);
        }
    }, [editPage]); 

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
                const response = await addPage({ newPage: formData }, {
                    withCredentials: true,
                    headers: getAuthHeader()
                });

                if (response.data.status) {
                    Toastify("Page created successfully","success");
                    dispatch(clearPage());
                    window.location.href = "/pages"
                } else {
                    Toastify(response?.data?.msg || "Error creating page","warn");
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
                const response = await updatePage({ id: subId, updatedPage: formData }, {
                    withCredentials: true,
                    headers: getAuthHeader()
                });

                console.log(response)

                if (!response.error && response.data.status) {
                    Toastify("Page edited successfully","success");
                    dispatch(clearPage());
                    window.location.href = "/pages"
                } else {
                    Toastify(response?.data?.msg|| response.error.data.message || "Error editing page","warn");
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
        dispatch(clearPage());
        setErrors({});
        window.location.href = "/pages"
    };

    return (
        <div className="content-center">
            <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
                <h2 className="text-xl font-semibold mb-4">{creatNew?"New":"Edit"} Page</h2>
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

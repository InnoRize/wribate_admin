import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
    useAddUserMutation,
    useUpdateUserMutation,
} from "../../app/services/authApi";
import getAuthHeader from "../../utils/authHeader";
import Toastify from "../../utils/Toast";
import { useSelector, useDispatch} from "react-redux";
import { clearUser } from "../../app/features/userSlice";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword } from "@firebase/auth";
import { auth } from "../../firebase";
import axios from "axios";
import { Checkbox } from "../ui/checkbox";

export default function UserForm() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [creatNew, setCreatNew] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState()
    const [countryOptions, setCountryOptions] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);
    const [subOptions, setSubOptions] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [isRolesOpen, setIsRolesOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [addUser, { isLoading: isAdding }] = useAddUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        country: "",
        newPassword: "",
        roles: [],
        subscription: "",
    });
    const editUser = useSelector((state) => state.user.currentUser);

    useEffect(()=>{
        async function getCountries() {
            try{
                const token = localStorage.getItem("token")
                const res = await axios.get(
                    process.env.NEXT_PUBLIC_APP_BASE_URL + '/admin/getCountries',
                    { 
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true 
                    }
                )
                const countries = res.data.countries
                if(countries){
                    setCountryOptions(countries)
                }
            }catch (err) {
                console.error(err);
            }
        }
        async function getRoles() {
            try{
                const token = localStorage.getItem("token")
                const res = await axios.get(
                    process.env.NEXT_PUBLIC_APP_BASE_URL + '/admin/getRoles',
                    { 
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true 
                    }
                )
                const roles = res.data.roles
                if(roles){
                    setRoleOptions(roles)
                }
            }catch (err) {
                console.error(err);
            }
        }
        async function getSubscription() {
            try{
                const token = localStorage.getItem("token")
                const res = await axios.get(
                    process.env.NEXT_PUBLIC_APP_BASE_URL + '/admin/getSubscriptions',
                    { 
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true 
                    }
                )
                const subscriptions = res.data.subscriptions
                if(subscriptions){
                    setSubOptions(subscriptions)
                }
            }catch (err) {
                console.error(err);
            }
        }
        getCountries()
        getRoles()
        getSubscription()

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsRolesOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(()=>{
        if (editUser && roleOptions){
            console.log()
            let rolesList = editUser?.roles || []
            for (let i = 0; i < rolesList.length; i++){
                const roleName = roleOptions.find(role => role._id == rolesList[i]._id)?.roleName
                rolesList[i].roleName = roleName
            }
            
            setFormData({
                name: editUser?.name || "",
                email: editUser?.email || "",
                password: "",
                newPassword: "",
                country: editUser?.country || "",
                subscription: editUser?.subscription || "",
                roles: rolesList
            })
            setUserId(editUser._id)
        }
        else{
            setCreatNew(true);
        }
    }, [editUser]);

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    // Add role
    const addRole = (role) => {
        setFormData(prev => ({
            ...prev,
            roles: [...prev.roles, role]
        }));
    };

    // Remove role
    const removeRole = (roleToRemove) => {
        setFormData(prev => ({
            ...prev,
            roles: prev.roles.filter(role => role !== roleToRemove)
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = "Required";
        if ((creatNew || (!creatNew && editPassword)) && !(formData.password.trim().length>=6)) 
            newErrors.password = "Required atleast 6 characters";
        if ((!creatNew && editPassword) && !(formData.newPassword.trim().length>=6)) 
            newErrors.newPassword = "Required atleast 6 characters";
        if (formData.roles.length <=0) newErrors.roles = "Required atleast 1"
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!validate()) return;
        if (creatNew) {
            // Add to Firebase if not added
            let firebaseToken = null
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
                firebaseToken = await userCredential.user.getIdToken()
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    const loginCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                    firebaseToken = await loginCredential.user.getIdToken()
                } 
                else{
                    console.error(error);
                    Toastify(error?.message || "error occured", "warn");
                }         
            }

            try {
                formData.firebaseToken = firebaseToken
                const response = await addUser({ newUser: formData }, {
                    withCredentials: true,
                    headers: getAuthHeader()
                });

                if (response.data && response.data.status) {
                    Toastify("User created successfully","success");
                    dispatch(clearUser());
                    window.location.href = "/users"
                } else {
                    Toastify(response?.data?.msg || response?.data?.message|| "Error creating user","warn");
                }
            } catch (error) {
                
                    console.error(error);
                    Toastify(error?.message || "error occured", "warn");
            } finally {
                setIsLoading(false);
            }
        }
        else{
            // Change password on firebase
            let firebaseFailed = false
            if(editPassword){
                const loginCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                const user = loginCredential.user
                if (user) {
                    try {
                        await updatePassword(user, formData.newPassword);
                    } catch (error) {
                        if (error.code !== 'auth/user-not-found') {
                            console.error("Error updating password:", error);
                            Toastify(error?.message || "error occured", "warn");
                            setIsLoading(false);
                            firebaseFailed = true;
                        }
                    }
                } else {
                    Toastify("Firebase token not found", "warn");
                    setIsLoading(false);
                }
            }
            else{
                formData.newPassword = null
            }
            if(!firebaseFailed){
                try {
                    const response = await updateUser({ id: userId, updatedUser: formData }, {
                        withCredentials: true,
                        headers: getAuthHeader()
                    });

                    if (!response.error && response.data.status) {
                        Toastify("User edited successfully","success");
                        dispatch(clearUser());
                        setErrors({});
                        window.location.href = "/users"
                    } else {
                        Toastify(response?.data?.msg|| response.error.data.message || "Error editing user","warn");
                    }
                } catch (err) {
                    console.error(err);
                    Toastify(err?.message || "error occured", "warn");
                } finally {
                    setIsLoading(false);
                }
            }
        }
    };

    const handleCancel = () => {
        dispatch(clearUser());
        setErrors({});
        router.push("/users");
    };

    return (
        <div className="content-center">
            <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
                <h2 className="text-xl font-semibold mb-4">{creatNew?"New":"Edit"} User</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">     
                    <div className="">
                        <div className="">
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
                    <div>
                        <label className="block font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            readOnly={!creatNew}
                            className={`w-full mt-1 p-1 border rounded ${creatNew?"bg-white":"bg-gray-200"}`}
                        />
                        {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                    </div>
                    <div className="flex flex-col">
                        {!creatNew &&
                        <div className="flex flex-row">
                            <div className="font-medium">Reset Password: </div>
                            <Checkbox onClick={()=> setEditPassword(value => !value)}
                            className="border border-gray-400 ml-2 data-[state=checked]:bg-green-200"/> 
                        </div>
                        }
                        {(creatNew ||(!creatNew && editPassword)) &&
                        <div>
                            <label className="block font-medium">{!creatNew?"Current":""} Password</label>
                            <div className={`flex flex-row `}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    readOnly={!creatNew && !editPassword}
                                    className={`w-full mt-1 p-1 border rounded bg-white`}
                                />
                                <div className={`pl-3 flex items-center rounded `}>
                                    <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`text-gray-600 rounded hover:text-gray-500 focus:outline-none bg-white`}
                                    >
                                    {showPassword ? (
                                        <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                        </svg>
                                    ) : (
                                        <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                        />
                                        </svg>
                                    )}
                                    </button>
                                </div>
                            </div>
                            {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                        </div>}
                        {!creatNew && editPassword && 
                        <div>
                            <label className="block font-medium">New Password</label>
                            <div className={`flex flex-row `}>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    readOnly={!editPassword}
                                    className={`w-full mt-1 p-1 border rounded bg-white`}
                                />
                                <div className={`pl-3 flex items-center rounded `}>
                                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                                    disabled={!editPassword}
                                    className={`text-gray-600 rounded hover:text-gray-500 focus:outline-none bg-white`}
                                    >
                                    {showNewPassword ? (
                                        <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                        </svg>
                                    ) : (
                                        <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                        />
                                        </svg>
                                    )}
                                    </button>
                                </div>
                            </div>
                            {errors.newPassword && <span className="text-red-500 text-xs">{errors.newPassword}</span>}
                        </div>}
                    </div>
                    <div>
                        <label className="block font-medium mt-4">Country</label>
                        <select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full mt-1 p-1 border rounded"
                        >
                            <option value="">Select a country</option>
                            {countryOptions?.map((country) => (
                                <option key={country._id} value={country.countryName}>
                                    {country.countryName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium mt-4">Roles</label>
                        <div className="relative" ref={dropdownRef} >
                            {/* Input field with tags */}
                            <div 
                                className="w-full mt-1 min-h-[42px] p-1 border rounded flex flex-wrap items-center gap-1 cursor-text"
                                onClick={() => setIsRolesOpen(true)}
                            >
                                {/* Selected tags */}
                                {formData.roles.map((role, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md"
                                    >
                                        {role.roleName}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeRole(role);
                                            }}
                                            className="hover:text-blue-600 focus:outline-none"
                                        >
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                            {/* Dropdown */}
                            {isRolesOpen && roleOptions?.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                    {roleOptions.map((role) => (
                                        <div
                                            key={role._id}
                                            onClick={() => addRole(role)}
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                                        >
                                            {role.roleName}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {errors.roles && <span className="text-red-500 text-xs">{errors.roles}</span>}
                    </div>
                    <div>
                        <label className="block font-medium mt-4">Subscription</label>
                        <select
                            name="subscription"
                            value={formData.subscription}
                            onChange={handleChange}
                            className="w-full mt-1 p-1 border rounded"
                        >
                            <option value="">Select a subscription</option>
                            {subOptions?.map((sub) => (
                                <option key={sub._id} value={sub._id}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
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

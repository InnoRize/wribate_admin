import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "../app/features/authSlice";
import { useSigninMutation } from "../app/services/authApi";
import Toast from "../utils/Toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SigninPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_APP_BASE_EMAIL || '');
  const [password, setPassword] = useState(process.env.NEXT_PUBLIC_APP_BASE_PSWD || '');
  const router = useRouter();
  const dispatch = useDispatch();
  const [signin, { isLoading }] = useSigninMutation();

  const handleSignin = async (e) => {
    e.preventDefault();

    var firebaseToken = null;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential?.user || null;
      firebaseToken = user?.accessToken || null;
    } catch (err) {

    }

    const data = { email, password, firebaseToken };
    try {
      const response = await signin(data).unwrap();
      if (response == null || response?.status != 1) {
        dispatch(logout());
        console.error("Signin Status not 1:", err);
        throw new Error(response?.message);
      }
      // Handle success - e.g., navigate or show a toast
      console.log("Signin Successful:", response);

      console.log(response?.token);

      localStorage.setItem("token", response?.token);
      dispatch(setCredentials(response));

      Toast("Signin successful!", "success");
      router.push("/");
    } catch (err) {
      // Handle error - e.g., show error message
      console.error("Signin Failed:", err);
      dispatch(logout());
      Toast(err?.data?.message || "Signin failed. Please try again.", "error");
    }

    //navigate("/");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Left Side - Quote and Logo */}
      <div className="w-full md:w-1/2 bg-white p-8 flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-8">
            <img src="/logo.jpeg" height={100} width={100} />
          </div>

          <div className="border-2 border-orange-400 p-6 rounded-md mb-8 relative">
            <div className="absolute -top-4 left-8 text-orange-400 text-4xl">
              "
            </div>
            <div className="text-center">
              <h2 className="text-4xl font-bold text-primary mb-2">You</h2>
              <p className="text-xl text-primary">
                can make anything by writing.
              </p>
              <p className="text-xl text-orange-400 mt-4">C.S. Lewis</p>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src="/logo.jpeg"
              alt="C.S. Lewis"
              className="rounded-md grayscale"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Signin Form */}
      <div
        className={`w-full md:w-1/2 bg-gray-100  p-8 flex flex-col items-center justify-center`}
      >
        <div className="max-w-md w-full mx-auto">
          <div className="mb-6 flex flex-row justify-between items-center mb-4 md:mb-8">
            <h1 className="text-4xl font-bold text-primary ">WriBate - Admins</h1>
          </div>

          <h2 className="text-3xl font-bold mb-4">Sign in</h2>
          <p className="text-gray-500 mb-6">Sign in with Open account</p>

          <form className="space-y-4" onSubmit={handleSignin}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                type="email"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 px-4 rounded-md shadow-sm hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Signin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;

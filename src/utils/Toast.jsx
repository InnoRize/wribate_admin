import { toast } from "react-toastify";

const Toastify = (message, type) => {
  const toastId = `toast-${message}-${type}`;

  if (!toast.isActive(toastId)) {
    toast[type](message, {
      toastId, // Prevent duplicate messages
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }
};
export default Toastify;

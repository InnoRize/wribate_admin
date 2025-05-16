'use client';
import Layout from "../Components/Layout";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Provider } from 'react-redux';
import { store } from './store';

export function Providers({ children }) {
  return<Provider store={store}>
      <Layout>
        {children}
      </Layout>
      <ToastContainer />
    </Provider>;
}

import React from "react";
import "./App.css";
import Layout from "./Components/Layout";

import { Route, Routes } from "react-router-dom";
import { Config, AuthConfig } from "./Routes/Routes";
import PageNotFound from "./Components/PageNotFound";
import AuthWrapper from "./utils/AuthWrapper";
import { ToastContainer } from "react-toastify";

/* -----------React Toastify--------------- */
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <ToastContainer />
      <Routes>
        {Config.map((route, index) => (
          <Route
            path={route.path}
            element={<route.element />}
            key={index}
          ></Route>
        ))}
        {AuthConfig.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Layout>
                {/* <AuthWrapper> */}
                <route.element />
                {/* </AuthWrapper> */}
              </Layout>
            }
          />
        ))}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;

import Login from "./../Components/Login";
import Dashboard from "../Components/dashboard/Dashboard";
import Users from "../Components/Users/Users";
import Categories from "../Components/Categories/Categories";
import Wribates from "../Components/Wribates/Wribates";

export const AuthConfig = [
  {
    path: "/",
    element: Dashboard,
  },

  {
    path: "/users",
    element: Users,
  },
  {
    path: "/categories",
    element: Categories,
  },
  {
    path: "/wribates",
    element: Wribates,
  },
];

export const Config = [
  {
    path: "/login",
    element: Login,
  },
];

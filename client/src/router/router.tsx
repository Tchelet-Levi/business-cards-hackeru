import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Main from "../components/pages/Main/Main";
import Signin from "../components/pages/Signin/Signin";
import Signup from "../components/pages/Signup";
import Home from "../components/pages/Main/pages/Home/Home";
import MyCards from "../components/pages/MyCards/MyCards";
import Profile from "../components/pages/Main/Profile/Profile";
import About from "../components/pages/Main/pages/About/About";
import NotFoundPage from "../components/pages/Main/pages/NotFound/NotFoundPage";
import SessionExpired from "../components/pages/Main/pages/SessionExpired/SessionExpired";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: `/`,
        element: <Main />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "my-cards",
            element: <MyCards />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "about",
            element: <About />,
          },
        ],
      },
      {
        path: `/signup`,
        element: <Signup />,
      },
      {
        path: `/signin`,
        element: <Signin />,
      },
      { path: `/session-expired`, element: <SessionExpired /> },
    ],
    errorElement: <NotFoundPage />,
  },
]);

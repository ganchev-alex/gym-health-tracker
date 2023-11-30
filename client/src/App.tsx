import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./components/layout/RootLayout";
import FormLayout from "./components/layout/FormLayout";

import Dashboard from "./components/pages/app/DashboardPage";
import Workouts from "./components/pages/app/WorkoutsPage";
import HealthEssencialsPage from "./components/pages/app/HealthEssencialsPage";
import ExplorePage from "./components/pages/app/ExplorePage";
import StatisticsPage from "./components/pages/app/StatisticsPage";

import SignInForm from "./components/pages/auth/SignInForm";
import ProfileForm from "./components/pages/auth/ProfileForm";
import PersonalizationForm from "./components/pages/auth/PersonalizationForm";

// TODO: Add children to path /auth
/* //   children: [
      //      {path: "signin", element: <SignInForm>}
      //      {path: "login", element: <LoginForm>}
      //   ] */

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <FormLayout />,
    children: [
      {
        path: "",
        children: [
          {
            path: "",
            element: <SignInForm />,
          },
          {
            path: "profile",
            element: <ProfileForm />,
          },
          {
            path: "personalization",
            element: <PersonalizationForm />,
          },
        ],
      },
    ],
  },
  {
    path: "/app",
    element: <RootLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      {
        path: "workouts",
        element: <Workouts />,
      },
      {
        path: "health-essencials",
        element: <HealthEssencialsPage />,
      },
      {
        path: "explore",
        element: <ExplorePage />,
      },
      {
        path: "statistics",
        element: <StatisticsPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
export default App;

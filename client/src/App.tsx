import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout, { appDataLoader } from "./components/layout/RootLayout";
import FormLayout from "./components/layout/FormLayout";

import SignInForm from "./components/pages/auth/SignInForm";
import ProfileForm from "./components/pages/auth/ProfileForm";
import PersonalizationForm from "./components/pages/auth/PersonalizationForm";
import LogInForm from "./components/pages/auth/LogInForm";

import Dashboard from "./components/pages/app/DashboardPage";
import Workouts from "./components/pages/app/WorkoutsPage";
import HealthEssencialsPage from "./components/pages/app/HealthEssencialsPage";
import ExplorePage from "./components/pages/app/ExplorePage";
import StatisticsPage from "./components/pages/app/StatisticsPage";

export const mainAPIPath = "http://localhost:8080";

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
          {
            path: "login",
            element: <LogInForm />,
          },
        ],
      },
    ],
  },
  {
    path: "/app",
    element: <RootLayout />,
    loader: appDataLoader,
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

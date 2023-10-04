import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./components/layout/RootLayout";

import Dashboard from "./components/pages/app/DashboardPage";
import Workouts from "./components/pages/app/WorkoutsPage";
import HealthEssencialsPage from "./components/pages/app/HealthEssencialsPage";
import ExplorePage from "./components/pages/app/ExplorePage";
import StatisticsPage from "./components/pages/app/StatisticsPage";

const router = createBrowserRouter([
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

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout, { appDataLoader } from "./components/layout/RootLayout";
import FormLayout from "./components/layout/FormLayout";

import SignInForm from "./components/pages/auth/SignInForm";
import ProfileForm from "./components/pages/auth/ProfileForm";
import PersonalizationForm from "./components/pages/auth/PersonalizationForm";
import LogInForm from "./components/pages/auth/LogInForm";

import Workouts from "./components/pages/app/WorkoutsPage";
import HealthEssencialsPage from "./components/pages/app/HealthEssencialsPage";
import ExplorePage, {
  firstCardsSetLoader,
} from "./components/pages/app/ExplorePage";
import StatisticsPage from "./components/pages/app/StatisticsPage";
import CardPreview, {
  previewLoader,
} from "./components/explore_page/explore_card/CardPreviewPage";
import LandingPage from "./components/pages/landing/base/LandingPage";

import ChangeEmail from "./components/pages/auth/ChangeEmail";
import ChangePassword from "./components/pages/auth/ChangePassword";
import DeleteAccount from "./components/pages/auth/DeleteAccount";
import EmailVerification, {
  verificationLoader,
} from "./components/pages/auth/EmailVerification";

import ErrorPage from "./components/UI/page_not_found/ErrorPage";

export const mainAPIPath =
  "https://health-tracker-ag-c6df73fe12d6.herokuapp.com";

const router = createBrowserRouter([
  {
    path: "",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth",
    element: <FormLayout />,
    errorElement: <ErrorPage />,
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
          {
            path: "verify-email/:userId",
            element: <EmailVerification />,
            loader: verificationLoader,
          },
          {
            path: "change-email",
            element: <ChangeEmail />,
          },
          {
            path: "change-password/:userId",
            element: <ChangePassword />,
          },
          {
            path: "delete-account/:userId",
            element: <DeleteAccount />,
          },
        ],
      },
    ],
  },
  {
    path: "/app",
    element: <RootLayout />,
    loader: appDataLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <Workouts />,
      },
      {
        path: "health-essentials",
        element: <HealthEssencialsPage />,
      },
      {
        path: "explore",
        element: <ExplorePage />,
        loader: firstCardsSetLoader,
      },
      {
        path: "explore/:exploreId",
        element: <CardPreview />,
        loader: previewLoader,
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

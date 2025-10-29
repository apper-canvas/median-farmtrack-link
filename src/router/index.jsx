import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { getRouteConfig } from "./route.utils";
import Root from "@/layouts/Root";

// Lazy load all page components
const Login = lazy(() => import("@/components/pages/Login"));
const Signup = lazy(() => import("@/components/pages/Signup"));
const Callback = lazy(() => import("@/components/pages/Callback"));
const ErrorPage = lazy(() => import("@/components/pages/ErrorPage"));
const ResetPassword = lazy(() => import("@/components/pages/ResetPassword"));
const PromptPassword = lazy(() => import("@/components/pages/PromptPassword"));
const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Farms = lazy(() => import("@/components/pages/Farms"));
const Crops = lazy(() => import("@/components/pages/Crops"));
const Equipments = lazy(() => import("@/components/pages/Equipments"));
const Tasks = lazy(() => import("@/components/pages/Tasks"));
const Expenses = lazy(() => import("@/components/pages/Expenses"));
const Weather = lazy(() => import("@/components/pages/Weather"));
const Labors = lazy(() => import("@/components/pages/Labors"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));
const Layout = lazy(() => import("@/components/organisms/Layout"));
// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

// Helper to create route with access configuration
const createRoute = ({ path, index, element, access, children, ...meta }) => {
  // Get config for this route
  let configPath;
  if (index) {
    configPath = "/";
  } else {
    configPath = path.startsWith('/') ? path : `/${path}`;
  }

  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;

  const route = {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<LoadingFallback />}>{element}</Suspense> : element,
    handle: {
      access: finalAccess,
      ...meta,
    },
  };

  if (children && children.length > 0) {
    route.children = children;
  }

  return route;
};

// Create router configuration
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      createRoute({ path: "login", element: <Login /> }),
      createRoute({ path: "signup", element: <Signup /> }),
      createRoute({ path: "callback", element: <Callback /> }),
      createRoute({ path: "error", element: <ErrorPage /> }),
      createRoute({ path: "reset-password/:appId/:fields", element: <ResetPassword /> }),
      createRoute({ path: "prompt-password/:appId/:emailAddress/:provider", element: <PromptPassword /> }),
      {
        element: <Layout />,
        children: [
          createRoute({ index: true, element: <Dashboard /> }),
          createRoute({ path: "dashboard", element: <Dashboard /> }),
          createRoute({ path: "farms", element: <Farms /> }),
          createRoute({ path: "crops", element: <Crops /> }),
createRoute({ path: "equipment", element: <Equipments /> }),
          createRoute({ path: "tasks", element: <Tasks /> }),
          createRoute({ path: "expenses", element: <Expenses /> }),
          createRoute({ path: "labors", element: <Labors /> }),
          createRoute({ path: "weather", element: <Weather /> })
        ]
      },
      createRoute({ path: "*", element: <NotFound /> })
    ]
  }
]);
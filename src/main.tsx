import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { DashboardOverviewPage } from '@/pages/DashboardOverviewPage';
import { ComparativeAnalysisPage } from '@/pages/ComparativeAnalysisPage';
import { RegionalInsightsPage } from '@/pages/RegionalInsightsPage';
import { AlertsConfigurationPage } from '@/pages/AlertsConfigurationPage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <DashboardOverviewPage />,
      },
      {
        path: "compare",
        element: <ComparativeAnalysisPage />,
      },
      {
        path: "regional",
        element: <RegionalInsightsPage />,
      },
      {
        path: "alerts",
        element: <AlertsConfigurationPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  }
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)
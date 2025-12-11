// src/routes/index.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
// Import các trang placeholder (cần được tạo trong folder pages/ ở Bước 3)
const DashboardPage = () => <h1>Dashboard Content</h1>;
const UploadPage = () => <h1>Upload Content</h1>;
const LearningPage = () => <h1>Learning Content</h1>;
const ChatAIPage = () => <h1>Chat AI Content</h1>;
const ProfilePage = () => <h1>Profile Content</h1>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      { path: 'upload', element: <UploadPage /> },
      { path: 'learning', element: <LearningPage /> },
      { path: 'chat', element: <ChatAIPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
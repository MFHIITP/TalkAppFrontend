import { lazy, Suspense } from "react";
const Home = lazy(() => import("../Components/Home.js"));
const Login = lazy(() => import("../Components/Login.js"));
const SignUp = lazy(() => import("../Components/SignUp.js"));
const OTPVerify = lazy(() => import("../Components/OTPVerify.js"));

interface AppRouteObject {
  path: string;
  element: React.ReactNode;
}

const RouterFrontend: AppRouteObject[] = [
  {
    path: "/",
    element: (
      <>
        <Suspense>
          <Home />
        </Suspense>
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Suspense>
          <Login />
        </Suspense>
      </>
    ),
  },
  {
    path: '/signup',
    element: (
      <>
        <Suspense>
          <SignUp />
        </Suspense>
      </>
    ),  
  },
  {
    path: '/verify-otp/:email',
    element: (
      <>
        <Suspense>
          <OTPVerify />
        </Suspense>
      </>
    )
  }
];

export default RouterFrontend;

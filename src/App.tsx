import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Student from "./pages/Students";
import AuthGuard from "./services/authGuard";
import InstructorsRoutes from "./pages/Instructors/routes"
import CoursesRoutes from "./pages/Courses/routes"


export default function App() {
  return (
    <>
      <Router>
        <AuthGuard>
          <ScrollToTop />
          <Routes>
            {/* Dashboard Layout */}
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route index path="/student" element={<Student />} />
              <Route index path="/instructors/*" element={<InstructorsRoutes />} />
              <Route index path="/courses/*" element={<CoursesRoutes />} />
            </Route>

            {/* Auth Layout */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password" element={<ForgotPassword />} />
            

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthGuard>
      </Router>
    </>
  );
}

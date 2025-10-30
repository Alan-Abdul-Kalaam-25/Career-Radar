import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Signup from "./routes/Signup";
import Login from "./routes/Login";
import Dashboard from "./routes/Dashboard";
import Profile from "./routes/Profile";
import CareerFinder from "./routes/CareerFinder";
import CareerBrief from "./routes/CareerBrief";
import Questionnaire from "./routes/Questionnaire";
import Results from "./routes/Results";
import History from "./routes/History";
import Resources from "./routes/Resources.tsx";
import NotFound from "./routes/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-slate-950 text-slate-100">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl" />
          <div className="absolute -bottom-48 -right-32 h-96 w-96 rounded-full bg-purple-500/25 blur-3xl" />
          <div className="absolute -left-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        </div>
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-10">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/career" element={<CareerFinder />} />
                <Route path="/career/intake" element={<CareerBrief />} />
                <Route path="/career/qa" element={<Questionnaire />} />
                <Route path="/results" element={<Results />} />
                <Route path="/history" element={<History />} />
                <Route path="/resources" element={<Resources />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

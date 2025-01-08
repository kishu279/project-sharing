import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import { SignupPage } from "./pages/SignPage";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

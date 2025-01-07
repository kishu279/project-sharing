import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import ValidatingPage from "./pages/Validating";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}>
        <Route path="/signin" element={<ValidatingPage />} />
      </Route>

      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

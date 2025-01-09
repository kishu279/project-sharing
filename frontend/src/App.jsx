import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import { SignIn, SignUp } from "./pages/SignPage";
import { ErrorBoundaries } from "./components/ErrorBoundaries";
import Project from "./pages/Project";
import { RecoilRoot } from "recoil";

export default function App() {
  return (
    <div>
      <ErrorBoundaries>
        <RecoilRoot>
          <Routes>
            <Route path="/" element={<HomePage />}>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
            </Route>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/project/:id" element={<Project />} />
          </Routes>
        </RecoilRoot>
      </ErrorBoundaries>
    </div>
  );
}

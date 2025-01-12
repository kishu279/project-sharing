import { Outlet } from "react-router-dom";
import { Goto, LoginButton, RegisterButton } from "./../components/Button.jsx";
import Logo from "../components/Logo.jsx";

export default function HomePage() {
  return (
    <nav className="">
      <div className="shadow-md h-20 flex items-center justify-between">
        <Logo />
        <div className="flex items-center justify-end divide-x-2">
          <LoginButton />
          <RegisterButton />
        </div>
      </div>
      <div style={{ userSelect: "none" }}>
        <div className="h-24 w-[600px] font-mono text-8xl text-left mt-8 ml-6 text-neutral-500">
          TeamFlow
        </div>
        <p className="font-mono text-2xl ml-10 mt-4 text-blue-400 tracking-widest">
          "Collaborate. Create. Conquer."
        </p>
        <p className="font-mono text-xl ml-10 mt-4 text-slate-500 tracking-tight h-[100px] w-[1400px]">
          TeamFlow enhances teamwork by enabling easy project sharing, real-time
          collaboration, and seamless communication, <br />
          ensuring efficient workflows and successful outcomes for every team
          member involved.
        </p>
      </div>
      <div className="">
        <Goto />
      </div>
      <Outlet />
    </nav>
  );
}

import { useNavigate } from "react-router-dom";

export const LoginButton = () => {
  const navigation = useNavigate();
  function handleClick() {
    // redirecting to login page
    navigation("/signin");
  }

  return (
    <div
      onClick={() => {
        handleClick();
      }}
      className="text-xl h-12 w-20 text-center flex items-center justify-center hover:font-light cursor-pointer"
    >
      Login
    </div>
  );
};

export const RegisterButton = () => {
  const navigation = useNavigate();
  function handleClick() {
    // redirecting to register page
    navigation("/signup");
  }
  return (
    <div
      className="ml-4 pl-10 mr-10 h-12 w-24 text-center text-xl flex items-center justify-center hover:font-light cursor-pointer"
      onClick={() => {
        handleClick();
      }}
    >
      Register
    </div>
  );
};

export function Logout() {
  const navigation = useNavigate();
  return (
    <div>
      <button
        className="border h-12 w-20 rounded-full mr-5 shadow-lg hover:bg-slate-400"
        onClick={() => {
          localStorage.clear();
          navigation("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}

export function Goto() {
  const navigation = useNavigate();
  return (
    <div
      className="flex justify-center select-none cursor-pointer"
      onClick={() => {
        navigation("/dashboard");
      }}
    >
      <p className="font-mono text-3xl text-cyan-500 h-12 w-[200px] text-center shadow-md rounded-full  hover:shadow-cyan-400">
        Dashboard
      </p>
    </div>
  );
}

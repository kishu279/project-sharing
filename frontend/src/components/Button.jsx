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

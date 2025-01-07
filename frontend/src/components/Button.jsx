export const LoginButton = () => {
  function handleClick() {
    // redirecting to login page
  }

  return (
    <div
      onClick={handleClick}
      className="text-xl h-12 w-20 text-center flex items-center justify-center hover:font-light cursor-pointer"
    >
      Login
    </div>
  );
};

export const RegisterButton = () => {
  function handleClick() {
    // redirecting to register page
  }
  return (
    <div className="ml-4 pl-10 mr-10 h-12 w-24 text-center text-xl flex items-center justify-center hover:font-light cursor-pointer">
      Register
    </div>
  );
};

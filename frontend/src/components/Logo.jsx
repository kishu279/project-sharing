import { useNavigate } from "react-router-dom";

export default function Logo() {
  const navigation = useNavigate();
  function handleClick() {
    navigation("/");
  }

  return (
    <div>
      <span
        className="material-symbols-outlined cursor-pointer ml-5"
        onClick={() => {
          handleClick();
        }}
      >
        diversity_2
      </span>
    </div>
  );
}

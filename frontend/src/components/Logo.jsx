import { useNavigate } from "react-router-dom";

export default function Logo() {
  const navigation = useNavigate();
  function handleClick() {
    navigation("/");
  }

  return (
    <div>
      <span
        class="material-symbols-outlined cursor-pointer"
        onClick={handleClick}
      >
        diversity_2
      </span>
    </div>
  );
}

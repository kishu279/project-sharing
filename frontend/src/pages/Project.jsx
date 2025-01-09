import { useParams } from "react-router-dom";
import { dataAtom } from "../state/atom";
import { useRecoilValue } from "recoil";

export default function () {
  const [datas] = useRecoilValue(dataAtom);
  const param = useParams();
  const id = param.id;

  return (
    <div>
      <div>
        <h1>{id}</h1>
        <h1>title : {datas[id]?.title}</h1>
      </div>
    </div>
  );
}

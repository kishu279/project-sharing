import { ServerRouter, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { dataAtom } from "../state/atom";
import Logo from "../components/Logo";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function project() {
  const [loading, setLoading] = useState(false);
  const [errmssg, setErrmssg] = useState("");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const count = params.get("count");

  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");

  const datas = useRecoilValue(dataAtom);
  const data = datas[count]; // count is only for to check the data is there or not
  const navigation = useNavigate();

  if (data == null) {
    navigation("*");
  }

  // first rendered then add the data.description
  useEffect(() => {
    setDesc(data?.description);
    setTitle(data?.title);
  }, []);

  async function handleSubmitDisc() {
    if (!id) {
      throw new Error("Invalid");
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/project/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          body: JSON.stringify({
            title: data.title,
            description: desc,
            userid: data.userid,
          }),
        }
      );

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message || `An HTTP error status: ${body.status}`);
      }

      console.log(body.message);
    } catch (err) {
      throw new Error(err.message || "An unknown error expected");
    } finally {
      setLoading(false);
    }
  }
  async function handleClickDelete() {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/project/remove/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        }
      );

      if (!response.ok) {
        const body = await response.json();
        throw new Error(
          body.message || `HTTP error status: ${response.status}`
        );
      }

      console.log("Successfully deleted!");
    } catch (err) {
      console.error("Error in delete operation:", err);
      setErrmssg(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading ...</div>;
  }

  if (errmssg) {
    return <div>{errmssg}</div>;
  }

  return (
    <div>
      <div className="shadow-md h-20 flex items-center justify-between">
        <Logo />
        <p>{data?.name}</p>
        <div className="flex items-center justify-end divide-x-2"></div>
      </div>
      <div>
        <h1 className="text-center text-4xl mt-10 ]">{data?.title}</h1>
      </div>

      <div>
        <div className="mt-10 display flex flex-col items-center justify-center gap-5">
          <textarea
            className="border h-[300px] w-[900px] "
            placeholder="Description ..."
            value={desc}
            onChange={(event) => {
              setDesc(event.target.value);
            }}
          ></textarea>
          <button
            className="border h-14 w-24 rounded-full"
            onClick={handleSubmitDisc}
          >
            submit
          </button>
        </div>
      </div>

      <div>
        <button
          onClick={() => {
            handleClickDelete();
            const timer = setTimeout(() => {
              navigation("/dashboard");
            }, 500);
            // clearTimeout(timer);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

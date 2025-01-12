import { useEffect, useState } from "react";
import Logo from "../components/Logo.jsx";
import { Logout } from "./../components/Button.jsx";
import { useRecoilState } from "recoil";
import { dataAtom } from "../state/atom.jsx";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [datas, setDatas] = useRecoilState(dataAtom);
  const [errmssg, setErrmssg] = useState(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [select, setSelect] = useState("");
  const [selectid, setSelectid] = useState("");
  const [countid, setCountid] = useState("");

  const navigation = useNavigate();

  async function clickTitleSubmit() {
    if (title.length === 0) {
      console.log("no title");
      return;
    }

    console.log("sending");
    try {
      const response = await fetch("http://localhost:3000/project/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          title: title,
        }),
      });

      const body = await response.json();
      if (!response.ok) {
        // setTimeout(() => {}, 2000);

        // navigation("/signin");
        throw new Error();
      }

      console.log(body.message);
    } catch (err) {
      // navigation("/signin");
      throw new Error(err.message || "An unknown error expected");
    }
  }

  async function fetchData() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/project/view", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      });

      const body = await response.json();
      if (!response.ok) {
        setErrmssg(body.message || `An Error status: ${body.status}`);
        return;
      }
      setDatas(body.message);
    } catch (err) {
      throw new Error(err.message || "An unknown error expected");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading ...</div>;
  }

  if (errmssg) {
    navigation("/signin");
    return <div>{errmssg}</div>;
  }

  return (
    <div>
      <div className="shadow-md h-20 flex items-center justify-between">
        <Logo />
        <div className="flex items-center justify-end divide-x-2">
          <Logout />
        </div>
      </div>

      <div className="flex justify-center mt-32">
        <div className="w-[400px] flex justify-evenly">
          <input
            type="text"
            value={title}
            className="border rounded-md h-10 w-[250px] p-5"
            placeholder="Titles ..."
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          <button
            className="border h-10 w-20 rounded-full"
            onClick={() => {
              clickTitleSubmit();
              setTitle("");
            }}
          >
            Click
          </button>
        </div>
      </div>

      <div className="display justify-items-center">
        <div className="border h-[300px] w-[1000px] grid grid-cols-3 grid-row-5 overflow-scroll gap-5">
          {/* className="border h-[500px] w-[1700px] display grow flex flex-wrap gap-4 shadow-lg rounded-lg" */}
          {datas?.length != 0 ? (
            datas?.map((data) => (
              <div
                key={data.id}
                className="ml-2 h-[100px] w-[300px] border text-wrap text-center shadow-lg hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  setSelect(data.title);
                  setSelectid(data.id);
                  setCountid(data.count);
                  // --> REDIRECTING TO THE PAGE
                  console.log(datas);
                }}
              >
                {data.count + 1}
                <h1>{data.title}</h1>
                <h1>{data.description}</h1>
              </div>
            ))
          ) : (
            <h1 className="font-mono text-3xl">Create your first project</h1>
          )}
        </div>
      </div>

      <div>
        <div className="display text-center mt-10 flex justify-evenly select-none text-2xl display flex-col">
          <p>title : {select}</p>
          <span
            className="material-symbols-outlined cursor-pointer "
            onClick={() => {
              // on click will check the select is filled or not
              console.log("clicked");
              navigation(`/project?id=${selectid}&count=${countid}`);
            }}
          >
            output
          </span>
        </div>
      </div>
    </div>
  );
}

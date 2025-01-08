import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const navigation = useNavigate();

  async function handleClick() {
    if (!name || !email || !pass) {
      setErr("all fields are required and necessary");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          pass: pass,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message | `http error status ${err.status}`);
      }

      const response = await res.json();
      setResponse(response.message);
    } catch (err) {
      setErr(err.message | "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading ...</div>;
  }

  if (err) {
    console.log(err);
    return <div>{err}</div>;
  }

  if (response.length > 0) {
    setTimeout(() => {
      navigation("/");
    }, 3000);
    return <div>{response}</div>;
  }

  return (
    <div className="flex justify-center items-center">
      <nav className="border rounded-xl h-[250px] w-[600px] flex flex-col justify-center items-center gap-5 shadow-lg drop-shadow-lg">
        <input
          type="text"
          placeholder="Username ..."
          className="border rounded-lg"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <input
          type="email"
          placeholder="Email ..."
          className="border rounded-lg"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password ..."
          className="border rounded-lg"
          value={pass}
          onChange={(event) => {
            setPass(event.target.value);
          }}
        />
        <input
          type="submit"
          className="border h-[50px] w-[80px] rounded-lg cursor-pointer"
          onClick={() => {
            handleClick();
          }}
        />
      </nav>
    </div>
  );
}

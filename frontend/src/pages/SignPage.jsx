import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [loading, setLoading] = useState(false);
  const [errmssg, setErrmssg] = useState(null);
  const [response, setResponse] = useState("");

  const navigation = useNavigate();

  async function handleClick() {
    if (!name || !email || !pass) {
      setErrmssg("required fields are necessary");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/user/signup", {
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "HTTP error status: ${error.status}");
      }

      const body = await response.json();
      setResponse(body.message);
    } catch (err) {
      setErrmssg(err.message || "An unxpected error occurred");
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

  if (response) {
    setTimeout(() => {
      navigation("/");
    }, 2000);

    return <div>{response}</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="border flex flex-col justify-center items-center h-[250px] w-[600px] drop-shadow-md shadow-lg gap-4 rounded-2xl">
        <input
          type="text"
          placeholder="Username ..."
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <input
          type="email"
          placeholder="Email ..."
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password ..."
          value={pass}
          onChange={(event) => {
            setPass(event.target.value);
          }}
        />
        <input
          type="submit"
          onClick={() => {
            handleClick();
          }}
        />
      </div>
    </div>
  );
}

export function SignIn() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [loading, setLoading] = useState(false);
  const [errmssg, setErrmssg] = useState(null);

  const navigation = useNavigate();

  async function handleClick() {
    if (!email || !pass) {
      setErrmssg("required fields are necessary");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          pass: pass,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "HTTP error status: ${error.status}");
      }

      const body = await res.json();

      localStorage.setItem("auth-token", body.token);
      console.log(body.token);
      setTimeout(() => {
        navigation("/dashboard");
      }, 2000);
    } catch (err) {
      setErrmssg(err.message || "An unxpected error occurred");
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
    <div className="flex justify-center">
      <div className="border flex flex-col justify-center items-center h-[250px] w-[600px] drop-shadow-md shadow-lg gap-4 rounded-2xl">
        <input
          type="email"
          placeholder="Email ..."
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password ..."
          value={pass}
          onChange={(event) => {
            setPass(event.target.value);
          }}
        />
        <input
          type="submit"
          onClick={() => {
            handleClick();
          }}
        />
      </div>
    </div>
  );
}

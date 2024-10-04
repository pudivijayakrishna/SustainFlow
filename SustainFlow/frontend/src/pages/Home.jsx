import * as React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Agency from "../components/Agency";
import Ngo from "../components/Ngo.jsx";
import Searchnearby from "../components/Searchnearby";
import { useAuth } from "../context/auth";
import Title from "../components/Title.jsx";
import ExtraInfo from "../components/ExtraInfo.jsx";

export default function Home() {
  const { isLoggedIn, setIsLoggedIn, role, setRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!(window.localStorage.getItem("token") !== null && window.localStorage.getItem("role") !== null)) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("role");
      setIsLoggedIn(false);
      setRole("");
      navigate("/");
    }
  }, []);

  return (
    <>
      <Title />
      {isLoggedIn ? (
        <>
          {window.localStorage.getItem("role") === '"compostAgency"' && <Agency />}
          {window.localStorage.getItem("role") === '"ngo"' && <Ngo />}
          {window.localStorage.getItem("role") === '"donor"' && <Searchnearby />}
        </>
      ) : (
        <ExtraInfo />
      )}
    </>
  );
}

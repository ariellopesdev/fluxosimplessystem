//CSS
import "./Painel.css";

//Components
import Navbar from "../../components/Navbar/Navbar";
import Aside from "../../components/Aside/Aside";
import Main from "../../components/Main/Main";

//Hooks
import { useState } from "react";

const Painel = () => {
  //Current active page
  const [page, setPage] = useState("dashboard");

  //Mobile sidebar state
  const [isAsideOpen, setIsAsideOpen] = useState(false);

  //Toggle mobile sidebar
  const toggleAside = () => {
    setIsAsideOpen((prev) => !prev);
  };

  //Close mobile sidebar
  const closeAside = () => {
    setIsAsideOpen(false);
  };

  return (
    <div id="painel">
      <Navbar toggleAside={toggleAside} />
      <Aside
        setPage={setPage}
        page={page}
        isAsideOpen={isAsideOpen}
        closeAside={closeAside}
      />
      <Main page={page} setPage={setPage} />
    </div>
  );
};

export default Painel;

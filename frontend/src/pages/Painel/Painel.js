//CSS
import "./Painel.css";

//Components
import Navbar from "../../components/Navbar/Navbar";
import Aside from "../../components/Aside/Aside";
import Main from "../../components/Main/Main";

//Hooks
import { useState } from "react";

const Painel = () => {
  const [page, setPage] = useState("dashboard");
  return (
    <div>
      <Navbar />
      <Aside setPage={setPage} page={page} />
      <Main page={page} setPage={setPage}/>
    </div>
  );
};

export default Painel;

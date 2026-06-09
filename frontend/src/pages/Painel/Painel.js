//CSS
import "./Painel.css";

//Components
import Navbar from "../../components/Navbar/Navbar";
import Aside from "../../components/Aside/Aside";
import Main from "../../components/Main/Main";
import PainelSkeleton from "../../components/Loading/PainelSkeleton";

//Hooks
import { useEffect, useState } from "react";

const Painel = () => {
  const [page, setPage] = useState("dashboard");
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [isLoadingPainel, setIsLoadingPainel] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingPainel(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const toggleAside = () => {
    setIsAsideOpen((prev) => !prev);
  };

  const closeAside = () => {
    setIsAsideOpen(false);
  };

  if (isLoadingPainel) {
    return <PainelSkeleton />;
  }

  return (
    <div id="painel">
      <Navbar toggleAside={toggleAside} setPage={setPage}/>
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
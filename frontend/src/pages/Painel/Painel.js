//CSS
import "./Painel.css";

//Components
import Navbar from "../../components/Navbar/Navbar";
import Aside from "../../components/Aside/Aside";
import Main from "../../components/Main/Main";

const Painel = () => {
  return (
    <div>
      <Navbar />
      <Aside />
      <Main />
    </div>
  );
};

export default Painel;

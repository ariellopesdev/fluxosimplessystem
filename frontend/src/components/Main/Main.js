//CSS
import "./Main.css";

//Pages
import EditProfile from "../../pages/EditProfile/EditProfile";

const Main = () => {
  return (
    <main id="main">
      <div className="main__container">
        <EditProfile />
      </div>
    </main>
  );
};

export default Main;

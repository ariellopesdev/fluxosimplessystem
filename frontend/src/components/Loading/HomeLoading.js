//CSS
import "./HomeLoading.css";

const HomeLoading = () => {
  return (
    <div className="homeLoading">
      <div className="homeLoading__box">
        <h1>fluxo simples</h1>
        <span>system</span>
        <div className="homeLoading__spinner"></div>
        <p>Carregando ambiente...</p>
      </div>
    </div>
  );
};

export default HomeLoading;

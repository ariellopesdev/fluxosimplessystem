import "./PainelSkeleton.css";

const PainelSkeleton = () => {
  return (
    <div className="skeletonPage">
      {/* Navbar */}
      <div className="skNavbar">
        <div className="skLogo shimmer"></div>

        <div className="skUserArea">
          <div className="skAvatar shimmer"></div>
          <div className="skUserInfo">
            <div className="skText shimmer"></div>
            <div className="skText small shimmer"></div>
          </div>
        </div>
      </div>

      {/* Aside */}
      <div className="skAside">
        {Array.from({ length: 10 }).map((_, i) => (
          <div className="skMenuItem" key={i}>
            <div className="skIcon shimmer"></div>
            <div className="skMenuText shimmer"></div>
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="skMain">
        <div className="skTitle shimmer"></div>
        <div className="skSubtitle shimmer"></div>

        <div className="skCards">
          {[...Array(8)].map((_, i) => (
            <div className="skCard shimmer" key={i}></div>
          ))}
        </div>

        <div className="skCharts">
          <div className="skChart shimmer"></div>
          <div className="skChart shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default PainelSkeleton;
//CSS
import "./PainelSkeleton.css";

const PainelSkeleton = () => {
  return (
    <div className="painelSkeleton">
      <aside className="painelSkeleton__aside">
        <div className="skeleton skeleton__logo"></div>

        {Array.from({ length: 9 }).map((_, index) => (
          <div className="painelSkeleton__menuItem" key={index}>
            <div className="skeleton skeleton__icon"></div>
            <div className="skeleton skeleton__menuText"></div>
          </div>
        ))}
      </aside>

      <main className="painelSkeleton__main">
        <header className="painelSkeleton__navbar">
          <div></div>
          <div className="painelSkeleton__user">
            <div className="skeleton skeleton__avatar"></div>
            <div className="skeleton skeleton__userText"></div>
            <div className="skeleton skeleton__userText small"></div>
          </div>
        </header>

        <section className="painelSkeleton__content">
          <div className="painelSkeleton__pageHeader">
            <div>
              <div className="skeleton skeleton__title"></div>
              <div className="skeleton skeleton__subtitle"></div>
            </div>
            <div className="skeleton skeleton__button"></div>
          </div>

          <div className="painelSkeleton__cards">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="skeleton skeleton__card" key={index}></div>
            ))}
          </div>

          <div className="painelSkeleton__grid">
            <div className="skeleton skeleton__panel"></div>
            <div className="skeleton skeleton__panel"></div>
          </div>

          <div className="painelSkeleton__grid">
            <div className="skeleton skeleton__panel"></div>
            <div className="skeleton skeleton__panel"></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PainelSkeleton;

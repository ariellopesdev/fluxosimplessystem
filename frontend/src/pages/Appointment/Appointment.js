import "./Appointment.css";

const Appointment = () => {
  return (
    <div className="appointment">

      {/* HEADER */}
      <div className="appointment__header">
        <h2>Agendamentos</h2>
        <button className="appointment__btn">+ Novo</button>
      </div>

      {/* CARDS */}
      <div className="appointment__cards">
        <div className="card blue">3 Hoje</div>
        <div className="card orange">5 Pendentes</div>
        <div className="card green">12 Concluídos</div>
        <div className="card red">2 Cancelados</div>
      </div>

      <div className="appointment__content">

        {/* CALENDÁRIO */}
        <div className="calendar">
          <h3>Junho 2024</h3>
          <div className="calendar__grid">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="calendar__day">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* LISTA */}
        <div className="appointment__list">
          <h3>Agendamentos do dia</h3>

          <div className="appointment__item pending">
            <span>10:00</span>
            <p>Entrega de alimentos</p>
            <button>Confirmar</button>
          </div>

          <div className="appointment__item confirmed">
            <span>13:30</span>
            <p>Reunião fornecedor</p>
            <button>Concluir</button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Appointment;

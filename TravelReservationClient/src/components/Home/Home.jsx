import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";

const Home = () => {
  const [fromLocation, setFromLocation] = useState("İstanbul");
  const [toLocation, setToLocation] = useState("İstanbul");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCanSearch, setIsCanSearch] = useState(false);
  const [flightInfo, setFlightInfo] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:44417/api/Travel").then((res) => {
      setFlightInfo(res.data);
    });
  }, []);

  const HandleSelectLocationFrom = (e) => {
    setFromLocation(e.target.value);
  };

  const HandleSelectLocationTo = (e) => {
    setToLocation(e.target.value);
  };

  let yourDate = new Date();

  yourDate = yourDate.toISOString().split("T")[0];

  const handleSelectedDate = (e) => {
    setSelectedDate(e.target.value);
    console.log("gogodate", selectedDate);
  };

  const handleClick = () => {
    if (fromLocation === toLocation) {
      toast("Aynı şehiri seçemezsiniz !");
    }
    if (!selectedDate) {
      toast("Lütfen tarih seçin");
    }

    const filteredFlightDate = flightInfo.filter(
      (flight) => flight.FlightDate.split("T")[0] === selectedDate
    );

    if (fromLocation !== toLocation && filteredFlightDate.length>0) {
      setIsCanSearch(true);
    } else {
      toast("Uygun Uçuş Bulunamadı, Lütfen başka tekrar deneyin");
      setIsCanSearch(false);
    }

 
  };

  return (
    <div style={{ paddingBottom: "13rem" }}>
      <ToastContainer position="top-right" />
      <Navbar />
      <section className="home">
        <div className="secContainer container">
          <div className="hometext">
            <h1 className="title">Seyahatini planla </h1>
            <p className="subTitle">Büyük şehirlere seyahat edin</p>
            <button className="btn">
              <a href="#">Keşfet </a>
            </button>
          </div>

          <div className="homecard grid">
            <div className="location">
              <label htmlFor="location">Nereden</label>
              <select
                name="from"
                id="from"
                onChange={HandleSelectLocationFrom}
                value={fromLocation}
              >
                <option value="İstanbul">İstanbul</option>
                <option value="Ankara">Ankara</option>
                <option value="İzmir">İzmir</option>
              </select>
            </div>
            <div className="distance">
              <label htmlFor="location">Nereye</label>
              <select
                name="to"
                id="to"
                value={toLocation}
                onChange={HandleSelectLocationTo}
              >
                <option value="İstanbul">İstanbul</option>
                <option value="Ankara">Ankara</option>
                <option value="İzmir">İzmir</option>
              </select>
            </div>
            <div className="price">
              <label htmlFor="location">Tarih Seçiniz : </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleSelectedDate}
              ></input>
            </div>
            <button className="btn" onClick={handleClick}>
              ARA
            </button>
          </div>
        </div>
      </section>

      {isCanSearch ? (
        <div style={{ marginTop: "150px", padding: "5rem" }}>
          <ul>
            {flightInfo.map((item, index) =>
              fromLocation === item.DepartureName &&
              toLocation === item.DestinationName &&
              selectedDate === item.FlightDate.split("T")[0] ? (
                <>
                  <li
                    className="searchcard grid"
                    style={{ marginTop: "2rem" }}
                    key={index}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h3>Uygun Uçuş</h3>
                      <div>
                        {item.DepartureName}-{item.DestinationName}
                      </div>
                      <div>{item.FlightTime}</div>
                      <div>
                        <Link to="/reservation" state={{ from: item.FlightID }}>
                          <button className="btn">Uçuşa Git</button>
                        </Link>
                      </div>
                    </div>
                  </li>
                </>
              ) : (
                <> </>
              )
            )}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Home;

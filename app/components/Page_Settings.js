import { useState } from "react";

// Komponent Page5 przyjmuje prop "wifiStatus" z RootLayout
export default function Page5({ wifiStatus, setWifiStatus }) {
  const [intervalValue, setIntervalValue] = useState(0);

  const handleIntervalChange = (e) => {
    let value = parseInt(e.target.value);
    if (value < 1) {
      value = 1;
    }
    setIntervalValue(value);
  };

  const handleConfirm = () => {
   
    fetch("/interval_change", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ interval: intervalValue }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Zmiana interwału zatwierdzona!");
        } else {
          console.error("Błąd podczas zmiany interwału:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Błąd sieci:", error);
      });
  };

  const handleWifiToggle = () => {
    setWifiStatus(!wifiStatus);
    fetch("/turn_wifi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Wifi turned");
        } else {
          console.error("Błąd podczas zmiany  Wifi", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Błąd sieci:", error);
      });
  };


  return (
    <div>
      <div>
        <h2>Interwał czasowy</h2>
        <input
          type="number"
          value={intervalValue}
          onChange={handleIntervalChange}
        />
        <button  onClick={handleConfirm}>Potwierdź</button>
      </div>
      <div>
        <h2 style={{ display: "inline-block", marginRight: "10px" }}>Wifi</h2>
  
        <button onClick={handleWifiToggle} style={{ verticalAlign: "top" ,marginTop:"8.5%"}}>
          {wifiStatus ? "Off" : "On"}
        </button>
      </div>
    </div>
  );
}

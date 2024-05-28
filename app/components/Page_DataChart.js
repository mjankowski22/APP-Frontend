import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Import chart.js
import "./Styles_DataChart.css"; // Import the CSS file

const WeatherChart = () => {
  const [chartData, setChartData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [currentChart, setCurrentChart] = useState("temperature"); // Track the current chart
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 50;

  useEffect(() => {
    // Fetch data from the backend server
    axios
      .get("http://153.19.55.87:5000/5g_dane/all")
      .then((response) => {
        const data = response.data || [];

        // Check if the data is in the expected format
        if (!Array.isArray(data)) {
          throw new Error("Unexpected data format");
        }

        // Prepare data for the chart
        const dates = data.map((item) => item.date_and_time);
        const temperatures = data.map((item) => item.temperature_inside);
        const pressures = data.map((item) => item.atmospheric_pressure);
        const lightIntensities = data.map((item) => item.light_intensity);
        const waterTemperatures = data.map((item) => item.water_temperature);

        const processedData = {
          data,
          dates,
          temperatures,
          pressures,
          lightIntensities,
          waterTemperatures,
        };

        setChartData(processedData);
        setFilteredData(processedData);
      })
      .catch((error) => {
        console.error("Error fetching the data", error);
      });
  }, []);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredData(chartData);
      return;
    }

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Add 00:00:00 to the start date to include the whole start date
    if (start) {
      start.setHours(0, 0, 0, 0);
    }

    // Add 23:59:59 to the end date to include the whole end date
    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    const filtered = chartData.data.filter((item) => {
      const date = new Date(item.date_and_time);
      if (start && end) {
        return date >= start && date <= end;
      } else if (start) {
        return date >= start;
      } else if (end) {
        return date <= end;
      }
      return true;
    });

    const dates = filtered.map((item) => item.date_and_time);
    const temperatures = filtered.map((item) => item.temperature_inside);
    const pressures = filtered.map((item) => item.atmospheric_pressure);
    const lightIntensities = filtered.map((item) => item.light_intensity);
    const waterTemperatures = filtered.map((item) => item.water_temperature);

    setFilteredData({
      data: filtered,
      dates,
      temperatures,
      pressures,
      lightIntensities,
      waterTemperatures,
    });
    setCurrentPage(1); // Reset to the first page
  };

  const renderChart = () => {
    if (!filteredData.dates) {
      return <p>Loading data...</p>;
    }

    let data;
    let label;
    let borderColor;

    switch (currentChart) {
      case "temperature":
        data = filteredData.temperatures;
        label = "Temperature Inside";
        borderColor = "rgba(75,192,192,1)";
        break;
      case "pressure":
        data = filteredData.pressures;
        label = "Atmospheric Pressure";
        borderColor = "rgba(153,102,255,1)";
        break;
      case "light":
        data = filteredData.lightIntensities;
        label = "Light Intensity";
        borderColor = "rgba(255,159,64,1)";
        break;
      case "water":
        data = filteredData.waterTemperatures;
        label = "Water Temperature";
        borderColor = "rgba(54,162,235,1)";
        break;
      default:
        return null;
    }

    return (
      <Line
        data={{
          labels: filteredData.dates,
          datasets: [
            {
              label,
              data,
              borderColor,
              fill: false,
            },
          ],
        }}
      />
    );
  };

  const renderTable = () => {
    if (!filteredData.data) {
      return null;
    }

    // Calculate the records to display on the current page
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredData.data.slice(
      indexOfFirstRecord,
      indexOfLastRecord
    );

    const totalPages = Math.ceil(filteredData.data.length / recordsPerPage);

    return (
      <>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date and Time</th>
              <th>Temperature Inside</th>
              <th>Atmospheric Pressure</th>
              <th>Light Intensity</th>
              <th>Water Temperature</th>
              <th>Localization N</th>
              <th>Localization E</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.date_and_time}</td>
                <td>{item.temperature_inside}</td>
                <td>{item.atmospheric_pressure}</td>
                <td>{item.light_intensity}</td>
                <td>{item.water_temperature}</td>
                <td>{item.localization_n}</td>
                <td>{item.localization_e}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="page-indicators">
            {Array.from({ length: totalPages }, (_, index) => (
              <div
                key={index}
                className={`page-indicator ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </>
    );
  };

  useEffect(() => {
    handleFilter();
  }, [startDate, endDate]);

  return (
    <div className="weather-chart-container">
      <h1>Weather Data</h1>
      <div className="filters">
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button className="filter-button" onClick={handleFilter}>Filter</button>
      </div>
      <div className="chart-buttons">
        <button
          className="chart-button"
          onClick={() => setCurrentChart("temperature")}
        >
          Temperature Inside
        </button>
        <button
          className="chart-button"
          onClick={() => setCurrentChart("pressure")}
        >
          Atmospheric Pressure
        </button>
        <button
          className="chart-button"
          onClick={() => setCurrentChart("light")}
        >
          Light Intensity
        </button>
        <button
          className="chart-button"
          onClick={() => setCurrentChart("water")}
        >
          Water Temperature
        </button>
      </div>
      {renderChart()}
      <h2>Measurement Data</h2>
      {renderTable()}
    </div>
  );
};

export default WeatherChart;

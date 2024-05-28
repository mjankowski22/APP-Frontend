import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Import chart.js
import "./Styles_DataChart.css"; // Import the CSS file

const WeatherChart = () => {
  const [chartData, setChartData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [currentChart, setCurrentChart] = useState("memory_status"); // Track the current chart
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 50;

  useEffect(() => {
    // Fetch data from the backend server
    axios
      .get("http://153.19.55.87:5000/lora_dane/all")
      .then((response) => {
        const data = response.data || [];

        // Check if the data is in the expected format
        if (!Array.isArray(data)) {
          throw new Error("Unexpected data format");
        }

        // Sort data by timestamp
        data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Prepare data for the chart
        const timestamps = data.map((item) => item.timestamp);
        const memoryStatuses = data.map((item) => item.memory_status);

        const processedData = {
          data,
          timestamps,
          memoryStatuses,
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
      const date = new Date(item.timestamp);
      if (start && end) {
        return date >= start && date <= end;
      } else if (start) {
        return date >= start;
      } else if (end) {
        return date <= end;
      }
      return true;
    });

    const timestamps = filtered.map((item) => item.timestamp);
    const memoryStatuses = filtered.map((item) => item.memory_status);

    setFilteredData({
      data: filtered,
      timestamps,
      memoryStatuses,
    });
    setCurrentPage(1); // Reset to the first page
  };

  const renderChart = () => {
    if (!filteredData.timestamps) {
      return <p>Loading data...</p>;
    }

    let data;
    let label;
    let borderColor;

    switch (currentChart) {
      case "memory_status":
        data = filteredData.memoryStatuses;
        label = "Memory Status";
        borderColor = "rgba(75,192,192,1)";
        break;
      default:
        return null;
    }

    return (
      <div className="chart-container">
        <Line
          data={{
            labels: filteredData.timestamps,
            datasets: [
              {
                label,
                data,
                borderColor,
                fill: false,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
          }}
        />
      </div>
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
              <th>Timestamp</th>
              <th>Memory Status</th>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.timestamp}</td>
                <td>{item.memory_status}</td>
                <td>{item.latitude}</td>
                <td>{item.longitude}</td>
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
      <h1>Memory bufor status</h1>
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
      
      {renderChart()}
      <h2>Measurement Data</h2>
      {renderTable()}
    </div>
  );
};

export default WeatherChart;

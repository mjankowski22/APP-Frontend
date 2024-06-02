import { useState } from "react";

export default function Page6() {
  const [includeAllData, setIncludeAllData] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deleteAfterSending, setDeleteAfterSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDownload = async () => {
    const url = includeAllData
      ? "http://153.19.55.87:5000/upload5g_whole_request"
      : "http://153.19.55.87:5000/upload5g_part_request";
    const data = includeAllData
      ? { delete: deleteAfterSending }
      : {
          start_date: startDate,
          end_date: endDate,
          delete: deleteAfterSending,
        };

    // Debugging output
    console.log("URL:", url);
    console.log("Data:", data);

    try {
      const response = await fetch(url, {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert("Pomyślnie wysłano żądanie");
      } else {
        alert("Błąd przy wysyłaniu żądania");
      }
    } catch (error) {
      console.error("Błąd:", error);
      alert("Wystąpił błąd podczas wysyłania żądania");
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Proszę wybrać plik do załadowania");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://153.19.55.87:5000/upload_file", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Plik został pomyślnie przesłany i zapisany");
      } else {
        alert("Błąd przy przesyłaniu pliku");
      }
    } catch (error) {
      console.error("Błąd:", error);
      alert("Wystąpił błąd podczas przesyłania pliku");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pobieranie danych przez 5g/LTE</h2>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="checkbox"
          id="includeAllData"
          checked={includeAllData}
          onChange={(e) => setIncludeAllData(e.target.checked)}
        />
        <label htmlFor="includeAllData">Pobierz całość danych</label>
      </div>

      {!includeAllData && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ marginLeft: "1%" }} htmlFor="startDate">
              Od:{" "}
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ marginLeft: "1%" }} htmlFor="endDate">
              Do:{" "}
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <input
          type="checkbox"
          id="deleteAfterSending"
          checked={deleteAfterSending}
          onChange={(e) => setDeleteAfterSending(e.target.checked)}
        />
        <label htmlFor="deleteAfterSending">Usuń dane po pobraniu</label>
      </div>

      <button
        onClick={handleDownload}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Pobierz
      </button>

      <h2>Załaduj dane z WiFi</h2>
      <div style={{ marginBottom: "20px" }}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </div>
      <button
        onClick={handleFileUpload}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Załaduj
      </button>
    </div>
  );
}

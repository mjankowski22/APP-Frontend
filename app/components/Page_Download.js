import { useState } from "react";

export default function Page6() {
  const [includeAllData, setIncludeAllData] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleteAfterSending, setDeleteAfterSending] = useState(false);

  const handleDownload = async () => {
    const url = includeAllData ? '/upload5g_whole_request' : '/upload5g_part_request';
    const data = includeAllData 
      ? { delete: deleteAfterSending }
      : { start_date: startDate, end_date: endDate, delete: deleteAfterSending };
      

      //mozna se zobaczyc czy dobrze wysłał 
      console.log('URL:', url);
      console.log('Data:', data);


    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        alert('Pomyślnie wysłano żądanie');
      } else {
        alert('Błąd przy wysyłaniu żądania');
      }
    } catch (error) {
      console.error('Błąd:', error);
      alert('Wystąpił błąd podczas wysyłania żądania');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Pobieranie dane przez 5g/LTE</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="checkbox"
          id="includeAllData"
          checked={includeAllData}
          onChange={(e) => setIncludeAllData(e.target.checked)}
        />
        <label htmlFor="includeAllData">Pobierz całość danych</label>
      </div>

      {!includeAllData && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{marginLeft:"1%"}} htmlFor="startDate">Od: </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{marginLeft:"1%"}} htmlFor="endDate"> Do: </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
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
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Pobierz
      </button>
    </div>
  );
}

const API_BASE = '/api';

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Backend server unavailable');
  return res.json();
}

export async function extractDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/extract`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to extract text from file');
  }
  return data;
}

export async function analyzePostText(text, platform = 'LinkedIn') {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, platform }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to analyze text');
  }
  return data;
}

export async function generatePostImprovements(text, platform = 'LinkedIn', analysis = null) {
  const res = await fetch(`${API_BASE}/improve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, platform, analysis, save_to_history: true }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to generate recommendations');
  }
  return data;
}

export async function fetchHistory() {
  const res = await fetch(`${API_BASE}/history`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to fetch history');
  }
  return data.history || [];
}

export async function deleteHistoryItem(id) {
  const res = await fetch(`${API_BASE}/history/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to delete history item');
  }
  return data;
}

export async function exportPdfReport(payload) {
  const res = await fetch(`${API_BASE}/export-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to export PDF report');
  }

  const arrayBuffer = await res.arrayBuffer();
  const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(pdfBlob);
  const cleanPlatform = (payload.platform || 'LinkedIn').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Social_Media_Analysis_${cleanPlatform}_Report.pdf`;

  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.setAttribute('download', fileName);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    if (document.body.contains(a)) {
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url);
  }, 60000);
}

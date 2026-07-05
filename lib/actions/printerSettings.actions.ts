import { apiDelete, apiGet, apiPost, apiPut, apiPatch } from '../api';

export const getSelectedTemplate = async () => {
  return apiGet('/printer-settings/selectedTemplate');
};

export const getAllTemplates = async () => {
  return apiGet('/printer-settings/allTemplates');
};

export const selectATemplate = async (id: string | undefined) => {
  return apiGet(`/printer-settings/selectTemplate/${id}`);
};


export const generatePDF = async (pdfName:string, html: string) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_URL}/printer-settings/generatePDF`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ html }) // ✅ IMPORTANT
  });

  if (!res.ok) {
    throw new Error('Failed to generate PDF');
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = pdfName;
  a.click();

  window.URL.revokeObjectURL(url);
};

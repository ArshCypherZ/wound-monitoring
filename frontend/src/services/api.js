import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const createPatient = (data) => api.post('/patients', data);
export const getPatients = () => api.get('/patients');
export const getPatient = (id) => api.get(`/patients/${id}`);
export const updatePatient = (id, data) => api.put(`/patients/${id}`, data);

export const uploadWoundPhoto = (patientId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('patient_id', patientId);
  return api.post('/assessments/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getAssessments = (patientId) => api.get(`/assessments/${patientId}`);
export const getAssessment = (assessmentId) => api.get(`/assessments/detail/${assessmentId}`);

export const triggerVoiceCall = (patientId) => api.post('/voice/call', { patient_id: patientId });

export const healthCheck = () => api.get('/health');

export default api;

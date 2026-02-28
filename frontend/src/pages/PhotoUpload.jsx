import { useState, useRef } from 'react';
import { Upload, Camera, Loader, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
// import { uploadWoundPhoto } from '../services/api';

export default function PhotoUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  // TODO: validate image, set preview via URL.createObjectURL
  const handleFileSelect = (e) => {};

  // TODO: call uploadWoundPhoto(patientId, selectedFile), set result
  const handleUpload = async () => {};

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">Upload Wound Photo</h1>
        <p className="page-subtitle">Take a clear photo of your surgical wound</p>
      </div>
      {/* TODO: photo tips card */}
      {/* TODO: upload area with <input type="file" accept="image/*" capture="environment" /> */}
      {/* TODO: image preview */}
      {/* TODO: upload button with loading state */}
      {/* TODO: assessment result card — score, pwat breakdown, tissue types, recommendations */}
    </div>
  );
}

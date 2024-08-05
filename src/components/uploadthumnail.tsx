// UploadThumbnail.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateThumbnail } from '../redux/auth/authusersslice';
import { AppDispatch } from '../redux/store';

const UploadThumbnail: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      dispatch(updateThumbnail({ userId: 1, file })); // Ensure userId is set dynamically
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Thumbnail</button>
    </div>
  );
};

export default UploadThumbnail;

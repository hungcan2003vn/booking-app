// uploadApi.ts
import axios from 'axios';

interface FileUploadProps {
  file: File | null;
}

export const uploadFile = async ({ file }: FileUploadProps, token: string) => {
  if (!file) {
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('files', file);

    const response = await axios.post(
      'https://jellyfish-app-43090-zm6h3.ondigitalocean.app/api/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
};

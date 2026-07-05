import { useState } from 'react';

import styles from './file_upload_chunk.module.css';

import api from 'haru-service-api';

// Simplified implementation based on
export default function ChunkedUploader({name,onComplete,accept_type}) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
  };
  const uploadFileInChunks = async () => {
    if (!file) return;

    setIsUploading(true);
    const fileId = await api.uploadFileInChunks(file,name,setProgress);
    console.log("uploadFileInChunks::fileId=" + fileId + ",json=" + JSON.stringify(fileId));
    setIsUploading(false);
    // try {
    //     const data = await unzip(fileId,name);
    //     console.log("data.files=" + JSON.stringify(data));
    //     onComplete(data);
    // } catch (error) {
    //     console.error("Error fetching data:", error);
    // }
  };

  return (
    <div className={styles.upload_chunk_container}>
      <div>File to upload</div>
      <div><input type="file" onChange={handleFileChange} accept={accept_type}/></div>
      <div>Upload Progress</div>
      <div><progress value={progress} max="100" width="100%" /> ({progress}%) </div>
      <div></div>
      <div>
        <button className={styles.upload_chunk_button} 
                onClick={uploadFileInChunks} disabled={!file || isUploading}>
                  Upload
        </button>
      </div>  
    </div>
  );
}
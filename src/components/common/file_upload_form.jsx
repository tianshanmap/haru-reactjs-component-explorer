import { useState } from 'react';
import styles from './file_upload_form.module.css';

const FileUploadForm = ({ title,name,base_url,onConfirm,accept_type }) => {

  console.log("FileUploadForm::base_url=" + base_url);  
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [message, setMessage] = useState('');

  
  // Handle file selection change
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus('error');
      setMessage('Please select a file first.');
      return;
    }

    // Initialize multipart/form-data payload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target', name);

    try {
      setStatus('uploading');
      
      const response = await fetch(base_url + "upload_unpack", {
        method: 'POST',
        body: formData,
        // CRITICAL: Do not set Content-Type header manually.
        // The browser must automatically set it along with the boundary string.
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.text();
      setStatus('success');
      setMessage('File uploaded successfully!');
      console.log('Server response:', data);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Something went wrong.');
      console.log('error.message:', error.message);
    }
    onConfirm();
  };

  return (
    <div className={styles.upload_form_container}>
      <h3>{title}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept={accept_type} // Optional: restrict file types
          />
          <input type="hidden" name="target" value={name}/> 
        </div>

        <button 
          type="submit" 
          disabled={status === 'uploading'}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          {status === 'uploading' ? 'Uploading...' : 'Submit'}
        </button>
      </form>

      {/* Visual Feedback Alerts */}
      {message && (
        <div style={{ 
          marginTop: '15px', 
          color: status === 'success' ? 'green' : 'red',
          fontWeight: 'bold' 
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default FileUploadForm;

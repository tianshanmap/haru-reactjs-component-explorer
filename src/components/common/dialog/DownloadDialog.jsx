
import { useState } from 'react';
import ServerDownload from "./server_download";

const DownloadDialog = ({ isOpen,title, message, onConfirm,onCancel,name }) => {
  const [progress,setProgress] = useState(0);
  if (!isOpen) return null;

  const handleConfirm = () => {
    setProgress(0);
    onConfirm();
  }
  const handleProgress = (progressx) => {
    console.log("handleProgress-progressx=" + progressx);    
    setProgress(progressx);
  }
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>{title}</h3>
        <p>{message}</p>
        <p>Progress : {progress}</p>
        <div style={styles.actions}>
          <ServerDownload name={name} onConfirm={handleConfirm} onProgress={handleProgress}/>
          <button onClick={onCancel} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Basic inline styles (or use Tailwind/CSS modules)
const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '800px',
    width: '100%',
    boxShadow: '50 50px 70px rgba(12, 0, 0, 0.9)',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
    cancelBtn: {
    padding: '8px 16px',
    cursor: 'pointer',
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '4px',
  },
  confirmBtn: {
    padding: '8px 16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
  }
};

export default DownloadDialog;
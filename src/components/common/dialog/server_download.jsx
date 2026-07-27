
import api from 'haru-service-api';
import styles from "./server_download.module.css";

const ServerDownload = ({name,onConfirm,onProgress}) => {

  const downloadFileInChunks = async() => {
    await api.download_chunk(name,onProgress);
    onConfirm();
  }

  return (
    <div>
      <button onClick={downloadFileInChunks} className={styles.download_button}>
        Click to download...
      </button>
    </div>
  );
};
export default ServerDownload;
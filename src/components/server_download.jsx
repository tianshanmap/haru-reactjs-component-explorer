
import { 
        download_chunk,
      } from "./api/utils";
import styles from "./server_download.module.css";
const ServerDownload = ({name,remote_url,onConfirm,onProgress}) => {

  const downloadFileInChunks = async() => {
    await download_chunk(name,remote_url,onProgress);
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
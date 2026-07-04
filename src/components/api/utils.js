const createDownload = (blob,download_filename) => {
      const downloadUrl = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = downloadUrl;
      downloadAnchor.download = download_filename;
      
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      
      // Clean up memory
      document.body.removeChild(downloadAnchor);
      URL.revokeObjectURL(downloadUrl);
      console.log("Download complete!");
};

export function bytesToMB(bytes) {
    if (bytes > 1024*1024*1024)
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    if (bytes > 1024*1024)
      return (bytes / (1024 * 1024)).toFixed(2) + "MB";
    else if (bytes > 1024)
      return (bytes / 1024).toFixed(2) + "KB"
    else 
      return bytes + "Bytes"
};
export async function download_chunk(filename,remote_url,onProgress) {
    const response = await fetch(remote_url);
    
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    // 2. Get the stream reader and content length
    const reader = response.body.getReader();
    const contentLength = +response.headers.get('Content-Length');
    let download_filename = response.headers.get('filename'); 
    if (download_filename == null){
      download_filename = filename;
    }  
    let receivedLength = 0;
    const chunks = []; 
    response.headers.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    // 3. Read the stream chunk-by-chunk
    while(true) {
      const {done, value} = await reader.read();
      
      if (done) {
        break;
      }

      chunks.push(value);
      receivedLength += value.length;

      // Log progress if Content-Length header is present
      if (contentLength) {
        const progressx = ((receivedLength / contentLength) * 100).toFixed(2);
        // console.log(`Download progress: ${progressx}%`);
        console.log("download_chunk-progressx=" + progressx);
        onProgress(progressx);
      }
    }

    // 4. Combine chunks into a single Blob
    const blob = new Blob(chunks, { type: "application/octet-stream" });
    createDownload(blob,download_filename);
};

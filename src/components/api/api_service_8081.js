const API_BASE_URL_8081 = window.APP_CONFIG.API_URL_8081;
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

// Reusable request wrapper
const callRemote = async (remote_url) => {
      try {
        const response = await fetch(remote_url);
        const data = await response.json();
        console.log("data.files=" + JSON.stringify(data));
        return data;
      } catch (error) {
        console.error("Error fetching data:", error);
        return null;
      }
}  

const uploadFileInChunks = async (file,targetPath,setProgress) => {

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const fileId = `${Date.now()}-${file.name}`;

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      
      // Slice file using Blob.slice()
      const chunk = file.slice(start, end);
      const formData = new FormData();
      formData.append('target', targetPath);
      formData.append('filename', fileId);
      formData.append('chunkIndex', chunkIndex.toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('fileChunk', chunk);

      await fetch(API_BASE_URL_8081 + '/filesystem/upload_chunk', {
        method: 'POST',
        body: formData,
      });

      setProgress(Math.round(((chunkIndex + 1) / totalChunks) * 100));
    }
    console.log("uploadFileInChunks,fileId=" + fileId);    
    return fileId;
};

export function getDownloadEndPoint(name) {
    return API_BASE_URL_8081 + '/filesystem/download-chunk?name=' + name;
}
export function chunkUpload(file,targetPath,setProgress) {
    return uploadFileInChunks(file,targetPath,setProgress);
}
export function unzip(fileId,target) {
    return callRemote(API_BASE_URL_8081 + "/filesystem/unzip?filename=" + fileId + "&target=" + target);
}

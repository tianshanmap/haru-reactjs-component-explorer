const ClientDownload = ({isOpen,name}) => {
  console.log("ClientDownload isOpen=" + JSON.stringify(isOpen));
  if (!isOpen) return null;

  const downloadJSON = () => {
    const data = { message: "Hello, World!", date: new Date().toLocaleDateString() };
    const jsonString = JSON.stringify(data);
    
    // Create a Blob from the string data
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={downloadJSON}>
      Locally Download {name}
    </button>
  );
};
export default ClientDownload;
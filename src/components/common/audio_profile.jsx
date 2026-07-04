import { useState, useEffect } from 'react';
import styles from "./audio_profile.module.css";

const AudioProfile = ({base_url,image_path,onComplete}) => {
  const [data, setData] = useState(null);
  const [videoName, setVideoName] = useState("trip");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  console.log("component::UserProfile::base_url=" + base_url);

  useEffect(() => {
    // 1. Declare the async function inside the effect
    const fetchData = async () => {
      try {
        const response = await fetch(base_url + 'video/audio_list');
        const result = await response.json();
        setData(result); // 2. Update state to trigger re-render
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    // 3. Call the function immediately
    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) return <p>Loading...</p>;
  let selected_audio = [];
  const handleCheckboxChange = (event) => {
    console.log("handleCheckboxChange event=" + event.target.id);
    if (event.target.checked){
      selected_audio.push(event.target.id)
      console.log("handleCheckboxChange total-audio=" + selected_audio);
    } else {
      let _audio = selected_audio.filter(x => x != event.target.id);
      selected_audio.length = 0;
      selected_audio.push(..._audio);      
      console.log("handleCheckboxChange total-audio=" + selected_audio);
    }    
  }

  const handleConfirm = async (event) => {
    if (selected_audio.length === 0) {
        console.log("The list is empty!");
        setErrorMessage("Please choose audio for the video and then click confirm");
        return;
    }
    console.log("handleConfirm event=" + event.target.id);
    let request = {
      "video_name": videoName,
      "image_path": image_path,
      "audio_files": selected_audio
    };
    console.log("handleAudioConfirm::request=" + JSON.stringify(request));
    try {
         let remote_url = "http://localhost:8080/filesystem/video/generate";
         const response = await fetch(remote_url, {
           method: 'POST', // Explicitly declare POST method
           headers: {
             'Content-Type': 'application/json', // Instruct the server you are sending JSON data
           },
           body: JSON.stringify(request), // Serialize JavaScript object to JSON string
         });

         if (!response.ok) {
           throw new Error('Network response was not ok');
         }

         const data = await response.json(); // Parse the server response
         onComplete(data); 
    } catch (error) {
         console.error('Error:', error);
    }
  }
  const onVideoNameChange = (event) => {
    setVideoName(event.target.value);
  }

  return (
        <div className={styles.audio_profile_container}>
          <div className={styles.div_audio_container}>
            <p>{errorMessage}</p>
            <table className={styles.audio_table}>
            <thead>
                <tr>
                <th></th>
                <th></th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                {/* 2. Use .map() to loop through the array and return table rows */}
                {data.files.map((item) => (
                <tr>
                    <td>{item.name}</td>
                    <td>
                    <audio src={base_url + "view?name=" + item.path} controls>
                        Your browser does not support the audio element.
                    </audio>
                    </td>
                    <td>
                    <input
                        id={item.path}
                        type="checkbox"
                        onChange={handleCheckboxChange}
                    />
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
          </div>
          <div className={styles.div_command_container}>
            <label>Video Name:</label>
            <input type="text" name="video_name" value={videoName} onChange={onVideoNameChange}/>
            <button onClick={handleConfirm}>Confirm</button>
          </div>
        </div>
    );
};
export default AudioProfile; 
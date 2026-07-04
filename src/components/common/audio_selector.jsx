import { useState, useEffect,useCallback } from 'react';
import styles from "./audio_selector.module.css";
import {
  getAudioList,
  getViewEndPoint,
  getAudioGenerateEndPoint,
} from "../api/api_service_8080";

const AudioSelector = ({onComplete,onExit}) => {
  const [tick, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick(tick => tick + 1), []);
  // let selected_audio = [];
  const [data, setData] = useState({files:[]});
  const [selected_audio_map, setSelectedAudioMap] = useState(new Map());
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // 1. Declare the async function inside the effect
    const fetchData = async () => {
      try {
        const result = await getAudioList();
        setData(result); // 2. Update state to trigger re-render
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    // 3. Call the function immediately
    console.log("AudioSelector::useEffect is called");
    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  const createAudio = (container,audio,audio_name) => {
    // 2. Create the audio element
    const scanTag = document.createElement('div');
    const label = document.createElement('label');

    // 2. Set the text content
    label.textContent = audio_name;

    // 4. Append it to the DOM
    scanTag.appendChild(label);
    const audioElement = document.createElement('audio');

    // 3. Configure the audio source and controls
    audioElement.src = getViewEndPoint(audio);
    audioElement.controls = true; // Displays play, pause, and volume controls

    // 4. Append the audio element inside the div
    scanTag.appendChild(audioElement);
    container.appendChild(scanTag);
  }
  const handleClear = (event) => {
    const select_container = document.getElementById("selected_audio");
    select_container.replaceChildren();
    setSelectedAudioMap(new Map());
    forceUpdate();
  }
  const handleCheckboxChange = (event) => {
    console.log("handleCheckboxChange event=" + event.target.id);
    if (event.target.checked){
      selected_audio_map.set(event.target.id,event.target.name);
    } else {
      selected_audio_map.delete(event.target.id);
    }    
    const select_container = document.getElementById("selected_audio");
    select_container.replaceChildren();
    // const selected_audio = [...selected_audio_map];
    // for (const audio of selected_audio) {
    //   createAudio(select_container,audio,name);    
    // }
    for (const [key, value] of selected_audio_map) {
      console.log(`${key}: ${value}`);
      createAudio(select_container,key,value);    
    }
  }
  // const handleCheckboxChange1 = (event) => {
  //   console.log("handleCheckboxChange event=" + event.target.id);
  //   if (event.target.checked){
  //     selected_audio.push(event.target.id)
  //     console.log("handleCheckboxChange total-audio=" + selected_audio);
  //   } else {
  //     let _audio = selected_audio.filter(x => x != event.target.id);
  //     selected_audio.length = 0;
  //     selected_audio.push(..._audio);      
  //     console.log("handleCheckboxChange total-audio=" + selected_audio);
  //   }    
  //   const select_container = document.getElementById("selected_audio");
  //   select_container.replaceChildren();
  //   for (const audio of selected_audio) {
  //     createAudio(select_container,audio);    
  //   }
  // }

  const handleContinue = async (event) => {
    console.log("handleContinue...");
    const selected_audio = [...selected_audio_map.keys()]; 
    if (selected_audio.length === 0) {
        console.log("The list is empty!");
        setErrorMessage("Please choose audio for the video and then click confirm");
        return;
    }
    console.log("handleContinue...selected_audio=" + selected_audio);
    let request = {
      "audio_files": selected_audio
    };
    console.log("handleContinue::request=" + JSON.stringify(request));
    try {
         let remote_url =getAudioGenerateEndPoint();
         console.log("handleContinue::remote_url=" + remote_url);
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

  return (
        <div className={styles.audio_profile_container} key={tick}>
          <div className={styles.div_audio_selector}>
            <div className={styles.div_audio_selector_source}>
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
                      <audio src={getViewEndPoint(item.path)} controls>
                          Your browser does not support the audio element.
                      </audio>
                      </td>
                      <td>
                      {selected_audio_map.has(item.path) &&
                        <input
                            id={item.path}
                            name={item.name}
                            type="checkbox"
                            checked
                            onChange={handleCheckboxChange}
                        />
                      }  
                      {!selected_audio_map.has(item.path) &&
                        <input
                            id={item.path}
                            name={item.name}
                            type="checkbox"
                            onChange={handleCheckboxChange}
                        />
                      }  
                      </td>
                  </tr>
                  ))}
              </tbody>
              </table>
            </div>
            <div className={styles.div_audio_selector_target}>
              <div className={styles.div_audio_selector_target_cmd}>
                <button onClick={handleContinue}>Next</button>
                <button onClick={handleClear}>Clear</button>
                <button onClick={onExit}>Cancel</button> 
              </div>
              <div id="selected_audio" className={styles.div_audio_selector_target_list}>
              </div>
            </div>
          </div>
        </div>
    );
};
export default AudioSelector; 
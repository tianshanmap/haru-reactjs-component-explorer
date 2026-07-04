import { useState } from "react";
import styles from "./video_name_selector.module.css";

function VideoNameSelector({onComplete,onExit}){
  const [videoName,setVideoName] = useState("name");
  const [fps,setFps] = useState(5);
  const [haruWidth,setHaruWidth] = useState(1024);
  const [haruHeight,setHaruHeight] = useState(768);
  const [haruScale,setHaruScale] = useState(0.4);
  const [haruCodec,setHaruCodec] = useState("avc1");

  const onContinue = (event) => {
    console.log("onContinue,videoName=" + videoName);
    let data = {
      'videoName': videoName,
      'fps': fps,
      'width': haruWidth,
      'height': haruHeight,
      'scale': haruScale,
      'codec': haruCodec
    };
    onComplete(data);
  }

  const handleInt = (value) => {
    const parsedValue = parseInt(value); // Always provide a radix
    console.log("handleInt,parsedValue=" + parsedValue);
    if (isNaN(parsedValue)){
      console.log("handleInt,return original value");
      return "";
    }
    return parsedValue;
  }

  return (
      <div className={styles.video_profile_container}>
          <div>
            <label>Video Name</label>
            <input 
              type="text" 
              value={videoName} 
              onChange={(e) => setVideoName(e.target.value)} // Updates state on typing
            />
          </div>
          <div>
            <label>Frame Per Second</label>
            <input 
              type="text" 
              value={fps} 
              onChange={(e) => setFps(handleInt(e.target.value))} // Updates state on typing
            />
          </div>
          <div>
            <label>Codec</label>
            <input 
              type="text" 
              value={haruCodec} 
              onChange={(e) => setHaruCodec(e.target.value)} // Updates state on typing
            />
          </div>
          <div>
            <label>Video Width</label>
            <input 
              type="text" 
              value={haruWidth} 
              onChange={(e) => setHaruWidth(handleInt(e.target.value))} // Updates state on typing
            />
          </div>
          <div>
            <label>Video Height</label>
            <input 
              type="text" 
              value={haruHeight} 
              onChange={(e) => setHaruHeight(handleInt(e.target.value))} // Updates state on typing
            />
          </div>
          {/* <div>
            <label>Scales</label>
            <input 
              type="text" 
              value={haruScale} 
              onChange={(e) => setHaruScale(parseFloat(e.target.value))} // Updates state on typing
            />
          </div> */}
          <div>
            <button onClick={onContinue}>Continue</button> 
            <button onClick={onExit}>Cancel</button> 
          </div>
      </div>
  );
}

export default VideoNameSelector;
import styles from "./video_tree.module.css";
import {
  getViewEndPoint
} from "../api/api_service_8080";

function VideoTree({data,onExit}){
  console.log("VideoTree-data=" + JSON.stringify(data));

  return (
      <div className={styles.video_profile_container}>
          <button onClick={onExit}>Exit</button> 
          <video width="1000" controls>
              <source src={getViewEndPoint(data)} type="video/mp4"></source>
          </video>
      </div>
  );
}

export default VideoTree;
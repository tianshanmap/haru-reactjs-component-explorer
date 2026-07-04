import { useState,useEffect } from "react";
import styles from "./video_maker.module.css";
import VideoTree from "./video_tree";
import AudioProfile from "./audio_profile";
import AudioSelector from "./audio_selector";
import ImageProfile from "./image_profile";
import DragAndDropProfile from "./DragAndDrop_profile";
import VideoNameSelector from "./video_name_selector";
import {
  generateVideo
} from "../api/api_service_8080";

function VideoMaker({image_path,onExit}){
  console.log("VideoMaker,start");
  const [imageList,setImageList] = useState([]);
  const [audioName,setAudioName] = useState("");
  const [videoData,setVideoData] = useState({});
  const [videoName,setVideoName] = useState("");
  const [videoPath,setVideoPath] = useState("");
  const [isImageOpen,setIsImageOpen] = useState(false);
  const [isAudioOpen,setIsAudioOpen] = useState(false);
  const [isVideoNameOpen,setIsVideoNameOpen] = useState(false);
  const [isVideoPlayerOpen,setIsVideoPlayerOpen] = useState(false);

  useEffect(() => {
    // Logic for turning on/off goes here (e.g., after loading)
    setIsImageOpen(true);
    setIsVideoPlayerOpen(false);
    setIsAudioOpen(false);
    setIsVideoNameOpen(false);
  }, []); // Empty dependency array means this runs on mount

  const handleDragAndDrop = (data) => {
    setImageList(data);
    setIsImageOpen(false);
    setIsAudioOpen(true);
    setIsVideoNameOpen(false);
    setIsVideoPlayerOpen(false);
  }

  const handleAudioConfirm = (data) => {
    setAudioName(data.name);
    setIsImageOpen(false);
    setIsAudioOpen(false);
    setIsVideoNameOpen(true);
    setIsVideoPlayerOpen(false);
  }

  const handleVideoName = async (data) => {
    if (imageList.length === 0) {
        console.log("The list is empty!");
        setErrorMessage("Please choose audio for the video and then click confirm");
        return;
    }
    setVideoData(data);
    let request = {
      "audio_name": audioName,
      "video_name": data.videoName,
      "image_path": image_path,
      "image_files": imageList,
      "fps": data.fps,
      "width": data.width,
      "height": data.height,
      "scale": data.scale,
      "codec": data.codec
    };
    console.log("handleAudioConfirm::request=" + JSON.stringify(request));
    try {
         const data = await generateVideo(request); // Parse the server response
         setVideoPath(data.file);
         setVideoName(name);
         setIsImageOpen(false);
         setIsAudioOpen(false);
         setIsVideoNameOpen(false);
         setIsVideoPlayerOpen(true);
    } catch (error) {
         console.error('Error:', error);
    }
  }
  return (
      <div className={styles.video_maker_container}>
         {isImageOpen && 
          <DragAndDropProfile 
            image_path={image_path} 
            onComplete={handleDragAndDrop}
            onExit={onExit}
          />
          }
         {isAudioOpen && 
          <AudioSelector 
            onComplete={handleAudioConfirm}
            onExit={onExit}
          />
          }
         {isVideoNameOpen && 
          <VideoNameSelector 
            onComplete={handleVideoName}
            onExit={onExit}
          />
          }
         {isVideoPlayerOpen && 
          <VideoTree 
            data={videoPath} 
            onExit={onExit}
            />
          }
      </div>
  );
}

export default VideoMaker;
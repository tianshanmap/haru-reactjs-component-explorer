import { useState,useEffect } from "react";
import ImageBlock from "../common/image_block";
import VideoMaker from "../common/video_maker"

const ImageContainer = ({ name,parentName,list,onExitAction }) => {

  const [isVideoMakerOpen,setIsVideoMakerOpen] = useState(false);
  const [isImageOpen,setIsImageOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsImageOpen(true);
      setIsVideoMakerOpen(false);
    };
    init();
  }, []); // Empty dependency array means this runs on mount
  
  const handleOpenVideoMaker = async (event) => {
    console.log("handleOpenVideoMaker::called");
    setIsVideoMakerOpen(true); 
    setIsImageOpen(false);   
  }

  const handleExit = async (event) => {
    setIsVideoMakerOpen(false); 
    setIsImageOpen(false);   
    onExitAction(parentName);
  }

  // console.log("styles.div_image_cmd=" + styles.div_image_cmd);
  return (
    <div className="main">
          {isImageOpen && 
                <ImageBlock 
                  name={name}
                  list={list}
                  onComplete={handleOpenVideoMaker}
                  onExit={handleExit}
                />  
          }
          {isVideoMakerOpen && 
                <VideoMaker 
                  image_path={parentName}
                  onExit={handleExit}
                />
          }          
        </div>
  );
}
export default ImageContainer;
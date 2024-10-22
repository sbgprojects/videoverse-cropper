import React, { useState, useRef, useEffect } from 'react';
import CustomDropdown from '../CustomDropdown';
import Draggable from 'react-draggable';
import VideoHighlights from "../../assets/highlights.mp4";

const Player = ({ aspectRatio, handleAspectRatioChange, isCropperActive, setPreview, onCropAreaChange = null }) => {

   // Player Variables
   const videoRef = useRef(null);
   const [isPlaying, setIsPlaying] = useState(false);
   const [volume, setVolume] = useState(1);
   const [playbackSpeed, setPlaybackSpeed] = useState(1);
   const [progress, setProgress] = useState(0);
   const [duration, setDuration] = useState(0);  // Update  d duration state
   const [currentTime, setCurrentTime] = useState(0);
   const [cropBox, setCropBox] = useState({ width: 0, height: 0, top: 0, left: 0 });

   // #region Data
   const playBackSpeedData = [
      { text: "0.5x", value: 0.5 },
      { text: "1x", value: 1 },
      { text: "1.5x", value: 1.5 },
      { text: "2x", value: 2 },
      { text: "3x", value: 3 }
   ];
   const aspectRatioData = [
      { text: "9:16", value: "9:16" },
      { text: "4:3", value: "4:3" },
      { text: "3:4", value: "3:4" },
      { text: "1:1", value: "1:1" },
      { text: "4:5", value: "4:5" },
   ];
   // #endregion

   // #region PlayerFunctions
   // Convert time from seconds to hours:minutes:seconds format
   const formatTime = (time) => {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = Math.floor(time % 60).toString().padStart(2, '0');

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds}`;
   };

   // Play/Pause Video
   const handlePlayPause = () => {
      const video = videoRef.current;
      if (isPlaying) {
         video.pause();
      } else {
         video.play();
      }
      setIsPlaying(!isPlaying);
   };

   // Handle Volume Change
   const handleVolumeChange = (e) => {
      const newVolume = e.target.value;
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
   };

   // Handle Playback Speed Change
   const handlePlaybackSpeedChange = (e) => {
      const newSpeed = e.target.value;
      videoRef.current.playbackRate = newSpeed;
      setPlaybackSpeed(newSpeed);
   };

   // Update Timeline Progress
   const handleProgress = () => {
      const video = videoRef.current;
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
   };

   // Handle Timeline Change (Scrub video)
   const handleTimelineChange = (e) => {
      const video = videoRef.current;
      const newTime = (e.target.value / 100) * video.duration;
      video.currentTime = newTime;
      setProgress(e.target.value);
   };

   // Get video duration on load
   useEffect(() => {
      const video = videoRef.current;

      const handleLoadedMetadata = () => {
         setDuration(video.duration);  // Set video duration
      };

      const handleTimeUpdate = () => {
         setCurrentTime(video.currentTime);  // Continuously update current time
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);  // Metadata loaded
      video.addEventListener('timeupdate', handleTimeUpdate);  // Track current time

      return () => {
         video.removeEventListener('loadedmetadata', handleLoadedMetadata);
         video.removeEventListener('timeupdate', handleTimeUpdate);
      };
   }, []);
   // #endregion

   // #region CropperFunctions
   const calculateCropBox = () => {
      if (!videoRef.current) return;

      const videoWidth = videoRef.current.offsetWidth;
      const videoHeight = videoRef.current.offsetHeight;

      const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
      
      let cropWidth = videoWidth;
      let cropHeight = (cropWidth / widthRatio) * heightRatio;

      if (cropHeight > videoHeight) {
         cropHeight = videoHeight;
         cropWidth = (cropHeight / heightRatio) * widthRatio;
      }

      const cropTop = (videoHeight - cropHeight);
      const cropLeft = 0;

      setCropBox({
         width: cropWidth,
         height: cropHeight,
         top: cropTop,
         left: cropLeft,
      });
   };
   useEffect(() => {
      calculateCropBox();
   }, [aspectRatio]);

   useEffect(() => {
      // Function to generate live preview
      const generateLivePreview = () => {
         if (!videoRef.current || videoRef.current.readyState < 2) return;

         const video = videoRef.current;
         const canvas = document.createElement('canvas');
         const context = canvas.getContext('2d');
         canvas.width = cropBox.width;
         canvas.height = cropBox.height;

         if (cropBox.width <= 0 || cropBox.height <= 0) {
             console.error('Invalid cropBox dimensions:', cropBox);
             return;
         }

         context.drawImage(
             video,
             cropBox.left * 1.5, cropBox.top * 1.5, (cropBox.width * 1.5), (cropBox.height * 1.5),
             0, 0, canvas.width, canvas.height
         );         
         setPreview(canvas.toDataURL());
     };

      if (isCropperActive) {
          const interval = setInterval(generateLivePreview, 1);
          return () => clearInterval(interval);
      }
      
  }, [aspectRatio, cropBox, isCropperActive, setPreview]);
   // #endregion

   // #region DragFunctions
   const handleDrag = (e, data) => {
      setCropBox((prevBox) => ({
         ...prevBox,
         left: Math.max(0, Math.min(data.x, videoRef.current.offsetWidth - prevBox.width)),
         top: Math.max(0, Math.min(data.y, videoRef.current.offsetHeight - prevBox.height))
      }));
   };
   // #endregion

   return (
      <div className="grid gap-2">

         <div className='relative aspect-video w-full'>
            <video
               ref={videoRef}
               onTimeUpdate={handleProgress}
               className="w-full h-auto aspect-video"
               width="100%"
               // src="https://www.w3schools.com/html/mov_bbb.mp4" // Replace with your video URL
               src={VideoHighlights}
            />

            {/* Draggable Cropper Overlay */}
            {/* <Draggable bounds="parent" onDrag={handleDrag}>
            <div className={`absolute border border-[#fff] cursor-move w-[${cropDimensions.width}] h-[${cropDimensions.height}]`} />
            </Draggable> */}

            {isCropperActive && (  // <--- Show cropper only if it's active
               <Draggable  bounds="parent" onDrag={handleDrag}>
                     <div
                        className="crop-overlay 
                                    cursor-move  border-white
                                    absolute border top-0 left-0"
                        style={{
                           aspectRatio: `${aspectRatio.replace(":", " / ")}`,
                           width: cropBox.width,
                           height: cropBox.height,
                        }}
                     >
                        <div className='absolute w-full h-[1px] border-b border-dashed border-white border-opacity-60 top-[33%]'></div>
                        <div className='absolute w-full h-[1px] border-t border-dashed border-white border-opacity-60 bottom-[33%]'></div>
                        <div className='absolute w-[1px] h-full border-r border-dashed border-white border-opacity-60 left-[33%]'></div>
                        <div className='absolute w-[1px] h-full border-l border-dashed border-white border-opacity-60 right-[33%]'></div>
                     </div>
               </Draggable>
            )}
         </div>

         <div className="controls flex flex-col">
            <div className='flex items-center gap-2'>
               {/* Play/Pause Button */}
               <button onClick={handlePlayPause} className="text-2xl">
                  {isPlaying && <i className='bi bi-pause-fill'></i>}
                  {!isPlaying && <i className='bi bi-play-fill'></i>}
               </button>

               {/* Timeline (Progress Bar) */}
               <input
                  type="range"
                  value={progress}
                  onChange={handleTimelineChange}
                  className="timeline w-full appearance-none h-1 bg-black bg-opacity-7 rounded-full"
                  min="0"
                  max="100"
                  style={{
                     background: `linear-gradient(to right, white ${progress}%, rgba(255, 255, 255, 0.07) ${progress}%)`,
                  }}
               />
            </div>

            {/* Current Time / Duration */}
            <div className='flex justify-between items-center'>
               <div className="flex justify-center items-center gap-1 text-sm">
                  <span>{formatTime(currentTime)}</span> {/* Current Time */}
                  <span className='opacity-50'>|</span>
                  <span className='opacity-50'>{formatTime(duration)}</span>   {/* Duration */}
               </div>

               {/* Volume Control */}
               <div className="text-xl flex items-center gap-2">
                  <i className={`
                              bi
                              ${volume * 100 >= 60 ? 'bi-volume-up-fill' :
                        volume * 100 > 0 ? 'bi-volume-down-fill' : 'bi-volume-mute-fill'
                     }
                           `}></i>
                  <input
                     type="range"
                     value={volume}
                     onChange={handleVolumeChange}
                     min="0"
                     max="1"
                     step="0.01"
                     className="timeline w-[60px] appearance-none h-[3px] bg-black bg-opacity-7 rounded-full"
                     style={{
                        background: `linear-gradient(to right, white ${volume * 100}%, rgba(255, 255, 255, 0.07) ${volume * 100}%)`,
                     }}
                  />
               </div>
            </div>

            {/* Playback Speed Control */}
            <div className='flex justify-start items-center gap-2 mt-2'>
               <CustomDropdown data={playBackSpeedData} defaultValue={playbackSpeed} optionLabel={"Playback Speed"} onChangeHandle={handlePlaybackSpeedChange} />
               <CustomDropdown data={aspectRatioData} defaultValue={aspectRatio} optionLabel={"Cropper Aspect Ratio"} onChangeHandle={handleAspectRatioChange} />
            </div>
         </div>
      </div>
   )
}

export default Player
import React, { useState, useEffect } from 'react';

import CustomButton from '../CustomButton';
import Player from '../cropper/Player';
import Preview from '../cropper/Preview';

const ModalCropVideo = ({ isOpen, onClose }) => {

   // Variables for cropper
   const [aspectRatio, setAspectRatio] = useState('9:16'); // Default aspect ratio
   const [cropArea, setCropArea] = useState(null); // State to store crop area dimensions and position
   const [isCropperActive, setIsCropperActive] = useState(false);
   const [preview, setPreview] = useState(null);

   const handleAspectRatioChange = (event) => {
      setAspectRatio(event.target.value); // Update aspect ratio based on dropdown selection
   };
   const handleStartCropper = () => {
      setIsCropperActive(true);  // <--- Start cropper
   };
   const handleRemoveCropper = () => {
      setIsCropperActive(false);  // <--- Remove cropper
   };

   useEffect(() => {
      // console.log(aspectRatio);
   }, [aspectRatio])


   // Modal Controls
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 flex justify-center items-center">
         <div className="bg-[#37393F] text-[#fff] rounded-lg shadow-lg max-w-md md:max-w-4xl w-full grid gap-4">
            {/* Header */}
            <div className='flex justify-between items-center p-4'>
               <h3 className='font-semibold capitalize text-lg'>Cropper</h3>
               <i className='bi bi-x-lg text-lg cursor-pointer' onClick={onClose}></i>
            </div>

            {/* Body */}
            <div className='p-4 pt-0'>
               <div className='grid md:grid-cols-2 gap-4'>
                  {/* Editor */}
                  <div>
                     <Player
                        aspectRatio={aspectRatio}
                        handleAspectRatioChange={handleAspectRatioChange}
                        // onCropAreaChange={setCropArea}
                        isCropperActive={isCropperActive}
                        setPreview={setPreview}
                     />
                  </div>

                  {/* Preview */}
                  <div>
                     <Preview
                        // cropArea={cropArea}
                        isCropperActive={isCropperActive}
                        preview={preview}
                        aspectRatio={aspectRatio}
                     />
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className='flex justify-between border-t-[#494C55] border-t-[1px] p-4'>
               <div className='flex gap-2 items-center flex-wrap'>
                  <CustomButton buttonText={"Start Cropper"} onClickHandle={handleStartCropper} isDisabled={isCropperActive} />
                  <CustomButton buttonText={"Remove Cropper"} onClickHandle={handleRemoveCropper} isDisabled={!isCropperActive} />
                  <CustomButton buttonText={"Generate Preview"} isDisabled={true} />
               </div>
               <div className='flex gap-2 items-center flex-wrap'>
                  <CustomButton buttonText={"Cancel"} buttonType={"gray"} onClickHandle={onClose} />
               </div>
            </div>
         </div>
      </div>
   );
}

export default ModalCropVideo
import React, { useState } from "react";

import CustomButton from "./components/CustomButton";
import ModalCropVideo from "./components/modals/ModalCropVideo";

function App() {
   const [isModalOpen, setIsModalOpen] = useState(false);

   const openModal = () => setIsModalOpen(true);
   const closeModal = () => setIsModalOpen(false);

   return (
      <div className="App">
         <section className='bg-[hsl(225,7%,10%)] text-[#fff] w-full h-[100vh] flex justify-center items-center'>
            <span className="">
               <CustomButton buttonText={"Crop Video"} onClickHandle={openModal} />
            </span>
         </section>

         {/* Modal Component */}
         <ModalCropVideo isOpen={isModalOpen} onClose={closeModal} />
      </div>
   );
}

export default App;

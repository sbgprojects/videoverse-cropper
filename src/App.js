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

         <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 -z-1 text-white text-opacity-70">
            <span className="">Developed by <strong>Shubham Gujarathi</strong></span>
         </footer>
      </div>
   );
}

export default App;

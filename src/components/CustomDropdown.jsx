import React, { useState } from 'react'

const CustomDropdown = ({ data, optionLabel = "", onChangeHandle, defaultValue }) => {

   return (
      <select onChange={onChangeHandle} value={defaultValue}
         className='p-2 border border-[#494C55] rounded-lg bg-transparent w-fit min-w-[100px]'>
         {data.map(option => (
            <option key={option.value} value={option.value}>
               {option.text}
            </option>
         ))}
      </select>
   );
};

export default CustomDropdown
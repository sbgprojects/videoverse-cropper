import React from 'react'

const CustomButton = ({ buttonText, 
                        buttonType = "primary", 
                        isDisabled = false,
                        onClickHandle = () => { } }) => {
   return (
      <>
         <button
            className={`
                  py-2 px-4 border border-[1px] rounded-lg transition
                  ${
                     buttonType === 'primary' ? 'border-[#7C36D6] bg-[#7C36D6] hover:bg-[hsl(266,66%,40%)] hover:border-[hsl(266,66%,40%)]' :
                     buttonType === 'gray' ? 'border-[#45474E] bg-[#45474E] hover:bg-[hsl(227,6%,35%)] hover:border-[hsl(227,6%,35%)]' : ''
                  }
                  ${
                     isDisabled ? "opacity-50 pointer-events-none select-none" : ""
                  }
                  `}
            onClick={onClickHandle}>
            {buttonText}
         </button>
      </>
   )
}

export default CustomButton
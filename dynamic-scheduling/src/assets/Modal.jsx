import React from 'react'
import clsx from 'clsx'

const Modal = ({ isOpen, onClose, children }) => {

    return (
        <>
            {isOpen &&
                <>

                    <div className='fixed inset-0 flex items-center justify-center z-50 '>
                        <div className='fixed inset-0 bg-black opacity-75 transition-opacity duration-75'></div>
                        <div className={clsx(`absolute ring-2 ring-[#00BD9B] bg-[#121418] p-4 rounded-lg z-10 px-6`)}>
                            <button className='absolute top-[-1.7rem] right-[-2rem] text-[#00BD9B] text-right  font-bold text-lg hover:text-gray-700 focus:outline-none mr-2 bg-transparent ring-1 ring-[#00BD9B] rounded-full px-2' onClick={onClose}>X</button>
                            {children}
                        </div>
                    </div>
                </>}</>


    )
}

export default Modal
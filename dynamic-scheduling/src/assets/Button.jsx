import React from 'react'

const Button = ({ text, textColor, bgColor, url }) => {

    return (
        <button onClick={url} className='py-2 px-8 ring-1 rounded-md ring-[#00BD9B] hover:rounded-3xl font-medium' style={{ color: textColor, background: bgColor }}>{text}</button>
    )
}

export default Button

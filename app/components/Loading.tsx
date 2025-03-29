import React from 'react'

const Loading = ({loading} :{loading: boolean}) => {
  return (
    <div className='loader'>
        <div className="spinner"></div>
    </div>
  )
}

export default Loading
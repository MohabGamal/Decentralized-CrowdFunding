import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { logo, sun } from '../assets'
import { navlinks } from '../constants'

const Icon = ({ styles, name, imgUrl, isActive, handleClick }) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] ${
      isActive && isActive === name && 'bg-[#2c2f32]'
    } flex justify-center items-center cursor-pointer ${styles}`}
    onClick={handleClick}
  >
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img
        src={imgUrl}
        alt="fund_logo"
        className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`}
      />
    )}
  </div>
)

const Sidebar = () => {
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState('dashboard')

  return (
    <div className="flex justify-between flex-col sticky h-[93vh] gap-8">
      <Link to="/" className="w-[100px] h-[50px] mt-1">
        <img src={logo} alt="fund_logo" className={`w-full h-full`} />
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map(link => (
            <Icon
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                setIsActive(link.name)
                navigate(link.link)
              }}
            />
          ))}
        </div>

        <Icon styles="bg-[#1c1c24] shadow-secondary" imgUrl={sun} />
      </div>
    </div>
  )
}

export default Sidebar

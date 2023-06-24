import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Sidebar, Navbar } from './components'
import { CampaignDetails, CreateCampaign, Home, Profile } from './pages'

const App = () => {
  if (localStorage.theme === 'dark') {
    document.documentElement.classList.add('dark')
  }

  return (
    <div className="relative sm:-8 p-4 bg-[#f5f5f5] dark:bg-[#13131a] min-h-screen flex flex-row">
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        {localStorage.theme == 'dark' ? (
          <ToastContainer theme="dark" />
        ) : (
          <ToastContainer />
        )}
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route
            path="/campaign-details/:id/:slug"
            element={<CampaignDetails />}
          />
        </Routes>
      </div>
    </div>
  )
}

export default App

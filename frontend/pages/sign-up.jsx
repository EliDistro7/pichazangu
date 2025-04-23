import React from 'react'
import SignUp from "../components/SignUp";
import SearchEvents from '../components/SearchEvents'

function auth() {
  return (
    <div>
      <SearchEvents />
       
      <SignUp /> {/* Login */}
      
    </div>
  )
}

export default auth
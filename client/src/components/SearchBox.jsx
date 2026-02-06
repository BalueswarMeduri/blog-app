import React, { useState } from 'react'
import {Input} from './ui/input'
import { useNavigate } from 'react-router-dom'
import { RouteSearch } from '../helper/RouteName'

const SearchBox = () => {
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
   const getinput = (e)=>{
    setQuery(e.target.value)
  }
  const handleSubmit = (e)=>{
    e.preventDefault()
    navigate(RouteSearch(query))
    
  }
 
  return (
    <form onSubmit={handleSubmit}>
        <Input name = "q" onInput = {getinput} placeholder="Search here..." className="h-9 bg-yellow-50" />
    </form>
  )
}

export default SearchBox
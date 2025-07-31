'use client'
import Navbar from '@/components/Navbar'
import { useParams } from 'next/navigation'
import React from 'react'

const Board = () => {
   
  let params = useParams()
  const id = params.id
  return (
    <div>
      <Navbar boardTitle='123123' onEditBoard={() => {}}/>
    </div>
  )
}

export default Board
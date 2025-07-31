'use client'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button';
import { useBoards } from '@/lib/hooks/useBoards'
import { useUser } from "@clerk/nextjs";
import { Plus } from 'lucide-react';
import React from 'react'

const Dashboard = () => {
  const {createBoard} = useBoards();
  const { isLoaded, isSignedIn, user } = useUser();

  const handleCreate = async () => {
    try {
      let board = await createBoard({title:'New Board'});
      console.log(board)
    } catch (err) {
      console.error(err);
      alert("Error creating board");
    }
  };

  return (
    <div className='min-h-screen'>
        <Navbar />
        <main className='container mx-auto'>
          <h1>Hello </h1>
          <Button onClick={handleCreate}>
            <Plus /> Create Board
          </Button>
        </main>
    </div>
  )
}

export default Dashboard
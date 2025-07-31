'use client'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBoards } from '@/lib/hooks/useBoards'
import { useUser } from "@clerk/nextjs";
import { Filter, Grid3x3, List, Plus, Rocket, Search, Trello} from 'lucide-react';
import { VscGraph } from "react-icons/vsc";
import React, { useState } from 'react'
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const Dashboard = () => {
  const {createBoard, boards, error, loading} = useBoards();
  const [viewMode, setViewMode] = useState<"grid" | "list">('grid')
  const { isLoaded, isSignedIn, user } = useUser();

  const handleCreateBoard = async () => {
    try {
      let board = await createBoard({title:'New Board'});
      console.log(board)
    } catch (err) {
      console.error(err);
      alert("Error creating board");
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <main className='container mx-auto px-4 py-6 sm:py-8'>
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome back,{" "}
              {user?.firstName ?? user?.emailAddresses[0].emailAddress}! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your boards today.
            </p>
            <Button  className="w-full sm:w-auto" onClick={handleCreateBoard}>
              <Plus className='h-4 w-4 mr-2'/> Create Board
            </Button>
          </div>

          {/* Stats */}
          {/* total boards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardContent>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-xs sm:text-sm font-medium text-gray-600'>Total boards</p>
                    <p className='text-xl sm:text-2xl font-bold text-gray-900'>{boards.length}</p>
                  </div>
                  <div className='h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <Trello className='w-5 h-5 sm:w-6 sm:h-6 text-blue-600' />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* active projects */}
            <Card>
              <CardContent>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-xs sm:text-sm font-medium text-gray-600'>Active Projects</p>
                    <p className='text-xl sm:text-2xl font-bold text-gray-900'>{boards.length}</p>
                  </div>
                  <div className='h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center'>
                    <Rocket className='w-5 h-5 sm:w-6 sm:h-6 text-green-600' />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* recent activity */}
            <Card>
              <CardContent>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-xs sm:text-sm font-medium text-gray-600'>Recent Activities</p>
                    <p className='text-xl sm:text-2xl font-bold text-gray-900'>
                      {
                        boards.filter((board) => {
                          const updatedAt = new Date(board.updated_at);
                          const oneWeekAgo = new Date();
                          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                          return updatedAt >  oneWeekAgo;
                        }).length
                      }
                    </p>
                  </div>
                  <div className='h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                    <VscGraph className='w-5 h-5 sm:w-6 sm:h-6 text-purple-600' />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/*  */}
            <Card>
              <CardContent>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-xs sm:text-sm font-medium text-gray-600'>Total boards</p>
                    <p className='text-xl sm:text-2xl font-bold text-gray-900'>{boards.length}</p>
                  </div>
                  <div className='h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <Trello className='w-5 h-5 sm:w-6 sm:h-6 text-blue-600' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* boards section */}
          <div className='mb-6 sm:mb-8'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6 sm:mb-8'>
                <div>
                    <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>Your boards</h1>
                    <p className='text-xs sm:text-sm  text-gray-600'>Manage your projects and tasks</p>
                </div>
                <div className='flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4'>
                  <div className='flex items-center justify-between space-x-2'>
                    <div className='flex gap-1 rounded-lg bg-white border px-1 py-1'>
                      <Button
                       variant={viewMode === "grid" ? "default" : "ghost"}
                       size="sm"
                      onClick={() => setViewMode("grid")}
                      >
                        <Grid3x3 />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                      >
                        <List  />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Filter />
                      Filter
                    </Button>
                  </div>        
                  <Button className='sm:py-0 py-7' size="lg" onClick={handleCreateBoard}>
                    <Plus />
                    Create Board
                  </Button>                 
                </div>
              </div>

              {/* search */}
              <div className="relative mb-4 sm:mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search boards..."
                  className="pl-10 py-5"
                />
              </div>

              {/* Boards Grid/List */}
              {boards.length === 0 ? (
                <div>No boards yet</div>
              ) : viewMode === "grid" ? (
                <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'>
                  {boards.map ( (board, key) => (
                    <Link href={`/boards/${board.id}`} key={key} className='p-4'>
                     <Card className='hover:shadow-lg transition-shadow cursor-pointer group'>
                        <CardHeader>
                          <div className='flex items-center justify-between'>
                            <div className={`h-4 w-4 ${board.color} rounded`}></div>
                            <Badge className='text-xs' variant="secondary">New</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className='my-4'>
                          <CardTitle className='text-xl sm:text-2xl mb-4 group-hover:text-blue-500 transition-colors'>
                            {board.title}
                          </CardTitle>
                          <CardDescription className='text-sm mb-7'>
                            {board.description}
                          </CardDescription>
                          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0'>
                            <Badge variant={'secondary'} className='text-gray-500 text-[10px]'>Created : <span className='font-normal'>{new Date(board.created_at).toLocaleDateString()}</span></Badge>
                            <Badge variant={'secondary'} className='text-gray-500 text-[10px]'>Updated : <span className='font-normal'>{new Date(board.updated_at).toLocaleDateString()}</span></Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div></div>
              )}
          </div>
        </main>
    </div>
  )
}

export default Dashboard
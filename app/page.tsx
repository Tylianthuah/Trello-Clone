'use client'

import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { SignUpButton, useUser } from '@clerk/nextjs'
import { ArrowRight, CheckSquare, Shield, Users, WavesIcon, Zap } from 'lucide-react'
import React from 'react'

const Home = () => {

  const {isSignedIn , user} = useUser();

   const features = [
    {
      icon: CheckSquare,
      title: "Task Management",
      description: "Organize your tasks with intuitive drag-and-drop boards",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with your team in real-time",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built with Next.js 15 for optimal performance",
    },
    {
      icon: Shield,
      title: "Secure",
      description: "Enterprise-grade security with Clerk authentication",
    },
  ];
  return (
    <div className='mx-auto min-h-screen text-center'>
      <Navbar />
      <section className='container mx-auto mt-10 px-3 py-4 sm:px-5 sm:py-6 '>
        <div className=" mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Organize work and life,{" "}
            <span className="text-blue-600">finally.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            TrelloClone helps teams move work forward. Collaborate, manage
            projects, and reach new productivity peaks. From high rises to the
            home office, the way your team works is unique—accomplish it all
            with TrelloClone.
          </p>

          {!isSignedIn && (
            <div className="flex flex-wrap sm:flex-row gap-4 justify-center">
              <SignUpButton>
                <Button size="lg" className="text-lg px-8 py-6">
                  Start for free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignUpButton>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Watch demo
              </Button>
            </div>
          )}
        </div>
      </section>

       {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Everything you need to stay organized
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features to help your team collaborate and get more done.
          </p>
        </div>

      </section>
    </div>
  )
}

export default Home
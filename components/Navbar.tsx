'use client';

import React from "react";
import { ArrowRight, Trello } from "lucide-react";
import { SignInButton, SignUp, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
const Navbar = () => {
  const { isSignedIn, user } = useUser();
    console.log(user);
  return (
    <div className="border-b bg-white/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="flex items-center justify-between container mx-auto py-3 sm:py-4 px-3">
        <div className="flex items-center space-x-2">
          <Trello className="text-blue-600 h-6 w-6 sm:h-8 sm:w-8" />
          <span className="text-xl sm:text-2xl font-bold font-gray-900">
            Trello
          </span>
        </div>

        {
            isSignedIn ? (
                <div className="flex items-center space-x-3">
                    <span className="text-xs sm:text-sm text-gray-600 hidden sm:block tracking-wider">Welcome, <span className="font-bold">{user?.firstName || user?.username}</span>!</span>
                    <Link href="/dashboard" >
                        <Button size='sm' className="text-xs sm:text-sm">
                            Go to Dashboard, <ArrowRight/>
                        </Button>
                    </Link>
                </div>
            ) : (
              <div className="flex items-center space-x-3">
                <SignInButton> 
                    <Button variant='ghost' size="sm" className="text-xs sm:text-sm"> Sign In</Button>
                </SignInButton>
                <SignUpButton>
                    <Button size="sm" className="text-xs sm:text-sm"> Sign Up</Button>
                </SignUpButton>       
              </div>
            )
        }
      </div>
    </div>
  );
};

export default Navbar;

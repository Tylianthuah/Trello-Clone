'use client';

import React from "react";
import { ArrowLeft, ArrowRight, Filter, FilterIcon, MoreHorizontal, Trello } from "lucide-react";
import { SignInButton, SignUp, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";
import { VscFilterFilled } from "react-icons/vsc";
import { Badge } from "./ui/badge";

interface  props {
  boardTitle?: string;
  onEditBoard?: () => void;
  onFilterOpen? : () => void;
  filterCount?: number
}

const Navbar = ({boardTitle, onEditBoard, onFilterOpen, filterCount = 0} : props) => {
  const { isSignedIn, user } = useUser();
  const pathName = usePathname();

  const isDashboardPage = pathName === "/dashboard";
  const isBoardPage = pathName.startsWith("/boards/");

  if(isDashboardPage){
    return (
    <header className="border-b bg-white/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="flex items-center justify-between container mx-auto py-4 sm:py-6 px-3">
        <div className="flex items-center space-x-2">
          <Trello className="text-blue-600 h-6 w-6 sm:h-8 sm:w-8" />
          <span className="text-xl sm:text-2xl font-bold font-gray-900">
            Trello
          </span>
        </div>
        
        <UserButton />
      </div>
    </header>
  );
  }

  if(isBoardPage) {
    return (
      <header className="border-b bg-white/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="flex items-center justify-between container mx-auto py-4 sm:py-6 px-3">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <Link href={"/dashboard"} className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 flex-shrink-0">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm font-medium hidden sm:inline">Back to dashboard</span>
                <span className="text-sm font-medium sm:hidden">Back</span>
          </Link>
          <div className="h-4 sm:h-6 w-px bg-gray-300  sm:block" />
          <div className="flex items-center space-x-2 sm:space-x-2 min-w-0">
            <Trello className="text-blue-600" />
            <div className="items-center space-x-1 sm:space-x-2 min-w-0">
              <span className={`text-lg font-bold text-gray-900 truncate`}>
                {boardTitle}
              </span>
              {onEditBoard && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 flex-shrink-0 p-0"
                  onClick={onEditBoard}
                >
                  <MoreHorizontal />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {
              onFilterOpen && 
              <Button variant={"outline"} size="sm"
                  className={`text-xs sm:text-sm ${
                    filterCount > 0 ? "bg-blue-100 border-blue-200" : ""
                  }`}
                  onClick={onFilterOpen}
              >
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"  />
                  <span className="hidden sm:inline">Filter</span>
                  {
                    filterCount > 0 &&
                    <Badge variant={"secondary"} className="text-xs ml-1 sm:ml-2 bg-blue-100 border-blue-200">{filterCount}</Badge>
                  }
              </Button>
            }
        </div>
      </div>
    </header>
    )
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="flex items-center justify-between container mx-auto py-4 sm:py-6 px-3">
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
    </header>
  );
};

export default Navbar;

"use client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBoard } from "@/lib/hooks/useBoards";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const Board = () => {
  let params = useParams();
  const id = String(params.id);
  const { board, updateBoard , columns } = useBoard(id);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");
  console.log(!isEditingTitle);
  const handleBoardUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBoard(newTitle, newColor ?? board?.title);
    setIsEditingTitle(false); // close modal or form
  };

  return (
    <div className="min-h-screen bg-gray">
      <Navbar
        boardTitle={board?.title}
        onEditBoard={() => {
          setNewTitle(board?.title ?? "");
          setNewColor(board?.color ?? "");
          setIsEditingTitle(true);
        }}
        onFilterOpen={() => {
          setIsFilterOpen(true);
        }}
      />
      <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
        <DialogContent className="w-[80vw] sm:w-[487px]">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleBoardUpdate}>
            <div className="space-y-2">
              <Label htmlFor="boardTitle">Board Title</Label>
              <Input
                id="boardTitle"
                className="text-sm sm:text-xl text-gray-900"
                onChange={(e) => setNewTitle(e.target.value)}
                required
                value={newTitle}
              />
            </div>

            <div className="space-y-3">
              <Label>Board Color</Label>
              <div className="flex gap-5 px-2 flex-wrap items-center">
                {[
                  "bg-blue-500",
                  "bg-green-500",
                  "bg-yellow-500",
                  "bg-red-500",
                  "bg-purple-500",
                  "bg-pink-500",
                  "bg-indigo-500",
                  "bg-gray-500",
                  "bg-orange-500",
                  "bg-teal-500",
                  "bg-cyan-500",
                  "bg-emerald-500",
                ].map((color, key) => (
                  <button
                    key={key}
                    type="button"
                    className={`h-7 w-7 rounded-full ${color} ${
                      color === newColor
                        ? "ring-2 ring-offset-2 ring-gray-400"
                        : ""
                    }`}
                    onClick={() => setNewColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-15 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-sm font-medium"
                onClick={() => setIsEditingTitle(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-sm font-medium">
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[80vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Filter Tasks</DialogTitle>
            <p className="tracking-wide text-[12px] sm:text-[13px] text-gray-600">
              filter tasks by priority, assignee or due date
            </p>
          </DialogHeader>

          <div className="space-y-5 sm:space-y-7 mt-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex flex-wrap space-x-3">
                {["low", "medium", "high"].map((priority, key) => (
                  <Button key={key} variant={"default"} size={"sm"}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" className="w-auto" />
            </div>
            <div className="flex justify-between mt-10">
              <Button type="button" variant={"outline"}>
                Clear Filters
              </Button>
              <Button type="button" onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 justify-between items-center mb-6 ">
			<div className="flex items-center flex-wrap gap-4 sm:gap-6">
				<div className="text-sm text-gray-600">
					<span>Total Tasks: </span>
					{columns.reduce((sum, col) => sum + col.tasks.length, 0)}
				</div>
			</div>		
			<Dialog>
				<DialogTrigger >
					<Button
						size="sm"
					>
						<Plus />
						Add Task
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							Add task to the board
						</DialogTitle>
					</DialogHeader>
					<form>
						
					</form>
				</DialogContent>
			</Dialog>		
        </div>
      </main>
    </div>
  );
};

export default Board;

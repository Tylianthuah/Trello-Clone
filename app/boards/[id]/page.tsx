"use client";
import DraggableColumn from "@/components/DroppableColumn";
import SortableTask from "@/components/SortableTask";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBoard } from "@/lib/hooks/useBoards";
import { Calendar, Plus, User } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent } from "@/components/ui/card";
import { ColumnWithTasks, Task } from "@/lib/supabase/models";

const Board = () => {
  let params = useParams();
  const id = String(params.id);
  const { board, updateBoard, columns, setColumns, moveTask, createRealTask } =
    useBoard(id);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleBoardUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newTitle.trim() || !board) return;
      await updateBoard(board.id, {
        title: newTitle.trim(),
        color: newColor || board.color,
      });
      setIsEditingTitle(false); // close modal or form
    } catch (error) {}
  };

  async function createTask(taskData: {
    title: string;
    description?: string;
    assignee?: string;
    dueDate?: string;
    priority: "low" | "medium" | "high";
  }) {
    const targetColumn = columns[0];
    if (!targetColumn) throw new Error("No column available to add task.");

    await createRealTask(targetColumn.id, taskData);
  }

  const handleCreateTask = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const taskData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      assignee: (formData.get("assignee") as string) || undefined,
      dueDate: (formData.get("dueDate") as string) || undefined,
      priority:
        (formData.get("priority") as "low" | "medium" | "high") || "medium",
    };

    if (taskData.title.trim()) {
      await createTask(taskData);
      const trigger = document.querySelector(
        '[data-state="open"'
      ) as HTMLElement;
      if (trigger) trigger.click();
    }
  };

  const handleDragStart = (e: DragStartEvent) => {
    const taskId = e.active.id as string;
    const task = columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === taskId);

    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === activeId)
    );

    const targetColumn =
      columns.find((col) => col.tasks.some((task) => task.id === overId)) ||
      columns.find((col) => col.id === overId); // 👈 check column id if not a task

    if (!sourceColumn || !targetColumn) return;

    if (sourceColumn.id === targetColumn.id) {
      const activeIndex = sourceColumn.tasks.findIndex(
        (task) => task.id === activeId
      );

      let overIndex = sourceColumn.tasks.findIndex(
        (task) => task.id === overId
      );

     
      if (overIndex === -1) {
        overIndex = sourceColumn.tasks.length;
      }


      if (activeIndex !== overIndex) {
        setColumns((prev: ColumnWithTasks[]) => {
          const newColumns = [...prev];
          const column = newColumns.find((col) => col.id === sourceColumn.id);
          if(!column) return newColumns;
          
          const tasks = [...column!.tasks];
          const [removed] = tasks.splice(activeIndex, 1);
          tasks.splice(overIndex, 0, removed);
          column!.tasks = tasks;
          return newColumns;
        });
      }
    }
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const targetColumn = columns.find((col) => col.id === overId);
    if (targetColumn) {
      const sourceColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === taskId)
      );

      if (sourceColumn && sourceColumn.id !== targetColumn.id) {
        await moveTask(taskId, targetColumn.id, targetColumn.tasks.length);
      }
    } else {
      // Check to see if were dropping on another task
      const sourceColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === taskId)
      );

      const targetColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === overId)
      );

      if (sourceColumn && targetColumn) {
        const oldIndex = sourceColumn.tasks.findIndex(
          (task) => task.id === taskId
        );

        const newIndex = targetColumn.tasks.findIndex(
          (task) => task.id === overId
        );

        if (oldIndex !== newIndex) {
          await moveTask(taskId, targetColumn.id, newIndex);
        }
      }
    }
  };

  function TaskOverlay({ task }: { task: Task }) {
    function getPriorityColor(priority: "low" | "medium" | "high"): string {
      switch (priority) {
        case "high":
          return "bg-red-500";
        case "medium":
          return "bg-yellow-500";
        case "low":
          return "bg-green-500";
        default:
          return "bg-yellow-500";
      }
    }
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            {/* Task Header */}
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 min-w-0 pr-2">
                {task.title}
              </h4>
            </div>

            {/* Task Description */}
            <p className="text-xs text-gray-600 line-clamp-2">
              {task.description || "No description."}
            </p>

            {/* Task Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                {task.assignee && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span className="truncate">{task.assignee}</span>
                  </div>
                )}
                {task.due_date && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span className="truncate">{task.due_date}</span>
                  </div>
                )}
              </div>
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityColor(
                  task.priority
                )}`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              <Button variant={"outline"}>Clear Filters</Button>
              <Button onClick={() => setIsFilterOpen(false)}>
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
            <DialogTrigger>
              <Button size="sm">
                <Plus />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add task to the board</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTask}>
                <div className="space-y-4 sm:space-y-5">
                  <div className="space-y-2 sm:space-y-3">
                    <Label>Title*</Label>
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      required
                      placeholder="Enter the task title"
                    />
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Enter the description for the task"
                      id="description"
                      name="description"
                      rows={3}
                    ></Textarea>
                  </div>

                  <div className="flex space-y-2 sm:space-y-3 gap-5 items-center">
                    <div className="space-y-2 sm:space-y-3">
                      <Label>Assignee</Label>
                      <Input
                        id="assginee"
                        name="assignee"
                        placeholder="assignee"
                      />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <Label>Priority</Label>
                      <Select name="priority" defaultValue={"medium"}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["low", "medium", "high"].map((priority, key) => (
                            <SelectItem key={key} value={priority}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label>Due date</Label>
                    <Input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      className="w-auto"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="submit">Create Task</Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Board Section */}
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div
            className="flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto 
            lg:pb-6 lg:px-2 lg:-mx-2 lg:[&::-webkit-scrollbar]:h-2 
            lg:[&::-webkit-scrollbar-track]:bg-gray-100 
            lg:[&::-webkit-scrollbar-thumb]:bg-gray-300 lg:[&::-webkit-scrollbar-thumb]:rounded-full 
            space-y-4 lg:space-y-0"
          >
            {columns.map((column, key) => (
              <DraggableColumn
                key={key}
                column={column}
                onCreateTask={handleCreateTask}
                onEditColumn={() => {}}
              >
                <SortableContext
                  items={column.tasks.map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {column.tasks.map((task, key) => (
                      <SortableTask task={task} key={key} />
                    ))}
                  </div>
                </SortableContext>
              </DraggableColumn>
            ))}

            <DragOverlay>
              {activeTask ? <TaskOverlay task={activeTask} /> : null}
            </DragOverlay>
          </div>
        </DndContext>
      </main>
    </div>
  );
};

export default Board;

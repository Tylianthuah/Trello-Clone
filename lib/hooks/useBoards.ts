"use client";
import { useUser } from "@clerk/nextjs";
import { boardDataService, boardService, taskService } from "../services";
import { useEffect, useState } from "react";
import { Board, Column, ColumnWithTasks } from "../supabase/models";
import { useSupabase } from "../supabase/SupabaseProvider";

export function useBoards() {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadBoards();
    }
  }, [user, supabase]);

  async function loadBoards() {
    if (!user) throw new Error("User not authenticated");
    try {
      setLoading(true);
      setError(null);
      const data = await boardService.getBoards(supabase!, user.id);
      setBoards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create board.");
    } finally {
      setLoading(false);
    }
  }

  async function createBoard(boardData: {
    title: string;
    description?: string;
    color?: string;
  }) {
    if (!user) throw new Error("User not authenticated");

    try {
      const newBoard = await boardDataService.createBoardWithDefaultColumns(
        supabase!,
        {
          ...boardData,
          userId: user.id,
        }
      );
      setBoards((prev) => [newBoard, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create board.");
    }
  }
  return { loading, error, boards, createBoard };
}

export function useBoard(boardId: string) {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<ColumnWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadBoard();
    }
  }, [user, supabase]);

  async function loadBoard() {
    if (!user) throw new Error("User not authenticated");

    try {
      setLoading(true);
      const data = await boardDataService.getBoardwithColumns(
        supabase!,
        boardId
      );
      setBoard(data.board);
      setColumns(data.ColumnWithTasks);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : `Failed to load board with id : ${boardId}`
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateBoard(boardId: string, update: Partial<Board>) {
    if (!user) throw new Error("User not authenticated");
    try {
      setLoading(true);
      const data = await boardService.updateBoard(supabase!, boardId, update);
      setBoard(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : `Failed to update board with id: ${boardId}`
      );
    }
  }

  async function createRealTask(
    columnId: string,
    taskData: {
      title: string;
      description?: string;
      assignee?: string;
      dueDate?: string;
      priority: "low" | "medium" | "high";
    }
  ) {
    if (!user) throw new Error("User not authenticated");
    try {
      setLoading(true);
      const newTask = await taskService.createTask(supabase!, {
        title: taskData.title,
        description: taskData.description || null,
        assignee: taskData.assignee || null,
        due_date: taskData.dueDate || null,
        column_id: columnId,
        sort_order:
          columns.find((col) => col.id === columnId)?.tasks.length || 0,
        priority: taskData.priority || "medium",
      });
      
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
        )
      );

      return newTask;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : `Failed to update board with id: ${boardId}`
      );
    }
  }

  return { loading, error, board, columns, updateBoard ,createRealTask };
}

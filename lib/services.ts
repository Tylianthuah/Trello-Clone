import { Board, Column, Task } from "@/lib/supabase/models";
import { SupabaseClient } from "@supabase/supabase-js";
import { error } from "console";

export const boardService = {
  async getBoard(supabase: SupabaseClient, boardId: string): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("id", boardId)
      .single();
    if (error) throw error;
    return data || null;
  },
  async getBoards(supabase: SupabaseClient, userId: string) {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createBoard(
    supabase: SupabaseClient,
    board: Omit<Board, "id" | "created_at" | "updated_at">
  ): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .insert(board)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBoard(
    supabase: SupabaseClient,
    title: string,
    color: string,
    boardId: string
  ): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .update({ title, color })
      .eq("id", boardId)
      .select()
      .single();
    if (error) throw error;
    return data || null;
  },
};

export const columnService = {
  async getColumns(
    supabase: SupabaseClient,
    boardId: string
  ): Promise<Column[]> {
    const { data, error } = await supabase
      .from("columns")
      .select("*")
      .eq("board_id", boardId)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return data || [];
  },
  async createColumn(
    supabase: SupabaseClient,
    column: Omit<Column, "id" | "created_at">
  ): Promise<Column> {
    const { data, error } = await supabase
      .from("columns")
      .insert(column)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};

export const taskService = {
  async getTaskByBoard(
    supabase: SupabaseClient,
    boardId: string
  ): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select(`*,columns!inner(board_id)`)
      .eq("columns.board_id", boardId)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return data || [];
  },
};

export const boardDataService = {
  async createBoardWithDefaultColumns(
    supabase: SupabaseClient,
    boardData: {
      title: string;
      description?: string;
      color?: string;
      userId: string;
    }
  ) {
    const board = await boardService.createBoard(supabase, {
      title: boardData.title,
      description: boardData.description || null,
      color: boardData.color || "bg-blue-500",
      user_id: boardData.userId,
    });

    const defaultColumns = [
      { title: "To Do", sort_order: 0 },
      { title: "In Progress", sort_order: 1 },
      { title: "Review", sort_order: 2 },
      { title: "Done", sort_order: 3 },
    ];

    await Promise.all(
      defaultColumns.map((column) =>
        columnService.createColumn(supabase, {
          ...column,
          board_id: board.id,
          user_id: boardData.userId,
        })
      )
    );

    return board;
  },

  async getBoardwithColumns(supabase: SupabaseClient, boardId: string) {
    const [board, columns, tasks] = await Promise.all([
      	boardService.getBoard(supabase, boardId),
      	columnService.getColumns(supabase, boardId),
		taskService.getTaskByBoard(supabase, boardId)
    ]);

    if (!board) throw new Error("Board not found.");

	const ColumnWithTasks = columns.map((column) => (
		{
			...column,
			tasks: tasks.filter( task => task.column_id === column.id)
		}
	))
    return { board, ColumnWithTasks };
  },
};

import { ColumnWithTasks } from '@/lib/supabase/models'
import React, { ReactNode } from 'react'
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MoreHorizontal } from 'lucide-react';

interface Column {
    column : ColumnWithTasks;
    children : ReactNode;
    onCreateTask : (taskData:  any) => Promise<void>;
    onEditColumn : (column : ColumnWithTasks) => void
}

const Column = ({column, children, onCreateTask, onEditColumn} : Column) => {
  return (
    <div className='w-full lg:flex-shrink-0 lg:w-80'>
        <div className='bg-white rounded-lg shadow-sm border'>
            {/* column header */}
            <div className='p-3 sm:p-4 border-b'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2 min-w-0'>
                        <h3 className='font-semibold text-gray-900 text-sm sm:text-base truncate'>{column.title}</h3>
                        <Badge variant="secondary" className='text-xs flex-shrink-0'>{column.tasks.length}</Badge>       
                    </div>
                    <Button variant="ghost" size="sm" className='flex-shrink-0' >
                        <MoreHorizontal />
                    </Button>
                </div>
            </div>

            {/* {column content} */}
            <div className='p-2'>{children}</div>
        </div>
    </div>
  )
}

export default Column
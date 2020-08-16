import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dro';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksFiltered(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;

    let filteredTasks = this.getAllTasks();

    if (status) {
      filteredTasks = filteredTasks.filter(item => item.status === status);
    }

    if (search) {
      filteredTasks = filteredTasks.filter(
        item =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return filteredTasks;
  }

  getTask(id: string): Task {
    const found = this.tasks.find(item => item.id === id);
    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: Math.random().toString(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks = [...this.tasks, task];
    return task;
  }
  deleteTask(id: string): string {
    const found = this.getTask(id);
    this.tasks = this.tasks.filter(item => item.id !== found.id);
    return 'Deleted';
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const theTask = this.getTask(id);
    theTask.status = status;
    return theTask;
  }
}

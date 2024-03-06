import { Injectable, NotFoundException } from '@nestjs/common';
import { FindAllParameters, TaskDto, TaskStatusEnum } from './task.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TaskService {
  private tasks: TaskDto[] = [];

  create(task: TaskDto) {
    task.id = uuid();
    task.status = TaskStatusEnum.TO_DO;
    this.tasks.push(task);
  }

  findById(id: string): TaskDto {
    const foundTask = this.tasks.filter((t) => t.id === id);
    if (foundTask.length) {
      return foundTask[0];
    }

    throw new NotFoundException(`Task with id ${id} not found`);
  }

  findAll(params: FindAllParameters): TaskDto[] {
    return this.tasks.filter((t) => {
      let match = true;

      const validTitle =
        params.title != undefined && !t.title.includes(params.title);
      const validStatus =
        params.status != undefined && !t.status.includes(params.status);

      if (validTitle || validStatus) {
        match = false;
      }

      return match;
    });
  }

  update(task: TaskDto) {
    let taskIndex = this.tasks.findIndex((t) => t.id === task.id);
    if (taskIndex >= 0) {
      this.tasks[taskIndex] = task;
      return;
    }

    throw new NotFoundException(`Task with id ${task.id} not found`);
  }

  remove(id: string) {
    let taskIndex = this.tasks.findIndex((t) => t.id === id);
    if (taskIndex >= 0) {
      this.tasks.splice(taskIndex, 1);
      return;
    }

    throw new NotFoundException(`Task with id ${id} not found`);
  }
}

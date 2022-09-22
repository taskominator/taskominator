import type { Group, Task } from '@/model';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export interface AppStore {
    tasks: Task[];
    groups: Group[];
}

export const useAppStore = defineStore({
    id: 'appStore',
    state: (): AppStore => ({
        tasks: [],
        groups: [
            {
                uuid: '1',
                name: 'Keep On Livin 🌭',
                taskOrder: [],
            },
            {
                uuid: '2',
                name: 'Empty List',
                taskOrder: [],
            },
            {
                uuid: '3',
                name: '3rd Group',
                taskOrder: [],
            },
        ],
    }),
    getters: {
        getGroups: (state) => state.groups,
        getGroupById: (state) => (groupId: string) =>
            state.groups.find((group) => group.uuid == groupId),
        getGroupTasks: (state) => (groupId: string) =>
            state.tasks.filter((task) => task.projectId == groupId),
        getInboxTasks: (state) => () =>
            state.tasks.filter((task) => !task.projectId),
        getTodayTasks: (state) => () => {
            const today = new Date().getUTCDate();
            return state.tasks.filter(
                (task) => task.dueDate?.getUTCDate() == today
            );
        },
    },
    actions: {
        createTask(header: string, body?: string, groupId?: string) {
            this.tasks.push({
                uuid: uuidv4(),
                projectId: groupId || null,
                header: header,
                body: body || null,
                dateCreated: new Date(),
                complete: false,
                dateCompleted: null,
                dueDate: null,
            });
        },
        updateTask(taskId: string, header: string, body: string) {
            this.tasks.map((task) => {
                if (task.uuid == taskId) {
                    task.header = header;
                    task.body = body;
                }
            });
        },
        toggleTask(taskId: string) {
            this.tasks.map((task) => {
                if (task.uuid == taskId) task.complete = !task.complete;
            });
        },
    },
    persist: {
        storage: localStorage,
        paths: ['tasks', 'groups'],
        afterRestore: (ctx) => {
            // recreate Date objects from stringified json
            ctx.store.$state.tasks = ctx.store.$state.tasks.map(
                (task: Task) => ({
                    ...task,
                    dateCreated: new Date(task.dateCreated),
                    dueDate: task.dueDate ? new Date(task.dueDate) : null,
                    dateCompleted: task.dateCompleted
                        ? new Date(task.dateCompleted)
                        : null,
                })
            );
        },
    },
});

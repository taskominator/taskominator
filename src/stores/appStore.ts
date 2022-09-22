import type { Group, Task } from '@/model';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export interface AppStore {
    tasks: Task[];
    groups: Group[];
}

export const useAppStore = defineStore({
    id: 'appStore',
    state: () => ({
        tasks: [
            {
                uuid: '1',
                projectId: '1',
                header: 'Breathe',
                body: 'this have no due date',
                dateCreated: new Date(),
                complete: true,
                dateCompleted: null,
                dueDate: null,
            },
            {
                uuid: '2',
                projectId: '1',
                header: 'Sleep',
                body: 'this is due on 29 of September',
                dateCreated: new Date(),
                complete: false,
                dateCompleted: null,
                dueDate: new Date(2022, 9, 27),
            },
            {
                uuid: '3',
                projectId: '1',
                header: 'Wake Up',
                body: 'this is due today',
                dateCreated: new Date(),
                complete: false,
                dateCompleted: null,
                dueDate: new Date(),
            },
            {
                uuid: '4',
                projectId: null,
                header: 'Inbox Task',
                body: 'should be in inbox and today',
                dateCreated: new Date(),
                complete: false,
                dateCompleted: null,
                dueDate: new Date(),
            },
            {
                uuid: '5',
                projectId: '3',
                header: 'Task',
                body: 'should be in 3rd group and today',
                dateCreated: new Date(),
                complete: false,
                dateCompleted: null,
                dueDate: new Date(),
            },
        ] as Task[],
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
            state.tasks.filter((task) => task.groupId == groupId),
        getInboxTasks: (state) => () =>
            state.tasks.filter((task) => !task.groupId),
        getTodayTasks: (state) => () => {
            const today = new Date().getUTCDate();
            return state.tasks.filter(
                (task) => task.dueDate?.getUTCDate() == today
            );
        },
    },
    actions: {
        createTask(header: string, body?: string, groupId?: string | null) {
            this.tasks.push({
                uuid: uuidv4(),
                groupId: groupId || null,
                header: header,
                body: body || null,
                dateCreated: new Date(),
                complete: false,
                dateCompleted: null,
                dueDate: null,
            });
        },
        updateTask(
            taskId: string,
            header: string,
            body: string,
            groupId?: string
        ) {
            this.tasks.map((task) => {
                if (task.uuid == taskId) {
                    task.header = header;
                    task.body = body;
                    groupId ? (task.groupId = groupId) : null;
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

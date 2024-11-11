import { test as base } from "@playwright/test";
import TaskManager from "../Pages/TaskManager";

export const test = base.extend({
  taskManager: async ({ page }, use) => {
    const taskManager = new TaskManager(page);
    await page.goto('/');
    // eslint-disable-next-line
    await use(taskManager);
  },
});

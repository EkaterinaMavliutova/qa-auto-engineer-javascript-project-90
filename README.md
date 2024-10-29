# Task Manager testing project at Hexlet:
[![hexlet-check](https://github.com/EkaterinaMavliutova/qa-auto-engineer-javascript-project-90/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/EkaterinaMavliutova/qa-auto-engineer-javascript-project-90/actions/workflows/hexlet-check.yml)

**Task Manager** is a task management system that uses a flexible Kanban board to visualize workflow. The system provides functionality to create tasks, assign them to a particular user, and also to change tasks statuses. Interaction with the Task Manager requires authentication.

E2E testing was conducted using Playwright. Testing covers how the system renders, creates, edits, and deletes the following instances:

* Users (that a particular task can be assigned to).
* Task statuses (ex. 'To do', 'In progress', 'In testing').
* Task labels (ex. 'Feature', 'Bug').
* Tasks (the main instance, represented in the form of a Kanban board).

## Installation
>note: the current version of Task Manager was tested using Node.js v20.11.1
* Clone this repository.
* Install required dependencies:
```
npm ci
```

## How to run tests
* Run Kanban Board app:
```
npm run dev
```
* Run tests:
```
npm test
```
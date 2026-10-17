# StudyMate — Student Study Planner

## Overview
StudyMate is a responsive, browser-based study planner that helps students add tasks, organize them by subject and due date, set priorities, and monitor progress.

## Features
- Add tasks with title, subject, due date, and priority.
- Mark tasks as completed or pending.
- Delete tasks after confirmation.
- Search tasks by title or subject.
- Filter by completion status.
- Sort by due date, priority, or newest task.
- Dashboard statistics: total, completed, pending, and completion rate.
- Highlights overdue tasks.
- Stores tasks in browser `localStorage`, so data remains after refresh on the same browser/device.

## Technology stack
- HTML5 for semantic structure and forms
- CSS3 for responsive layout and visual styling
- Vanilla JavaScript for state, filtering, sorting, and validation
- Browser localStorage for persistence

## How to run
1. Extract the ZIP folder.
2. Open `index.html` in a modern browser.
3. Add a task to test the app. No server or package installation is required.

## Suggested testing
1. Add a task with all fields filled.
2. Refresh the page and verify that the task remains.
3. Mark the task complete and verify the dashboard changes.
4. Search by subject.
5. Filter to pending/completed tasks.
6. Sort by priority.
7. Delete a task and verify it disappears.
8. Add a past-due date and verify the overdue label appears.

## Limitations and future scope
- Data is saved only in the current browser and is not synced across devices.
- There is no login or cloud backup.
- Future versions could add accounts, reminders, calendar integration, weekly analytics, and cloud storage.

## Academic integrity note
Customize the project, test it yourself, and make sure you understand the code before submission. Add your own name, internship details, screenshots, and any required declaration. Do not claim features you have not tested.

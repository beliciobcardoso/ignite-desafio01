import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './util/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: async (req, res) => {
      const tasks = database.select('tasks');

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks/:id'),
    handler: async (req, res) => {
      const { id } = req.params;

      if (!database.exists('tasks', id)) {
        return res.writeHead(404).end('Task not found');
      }

      const task = database.selectOne('tasks', id);

      return res.end(JSON.stringify(task));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: async (req, res) => {
      const { title, description } = req.body;

      if (title === '') {
        return res.writeHead(404).end('Field title is required');
      }

      if (description === '') {
        return res.writeHead(404).end('Field description is required');
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date().toISOString(),
        completed_at: null,
        updated_at: new Date().toISOString(),
      };

      database.insert('tasks', task);
      return res.writeHead(201).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: async (req, res) => {
      const { id } = req.params;

      if (!database.exists('tasks', id)) {
        return res.writeHead(404).end('Task not found');
      }
      database.delete('tasks', id);

      return res.writeHead(204).end();
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: async (req, res) => {
      const { id } = req.params;

      const { title, description } = req.body;

      const tasks = database.selectOne('tasks', id);

      if (!database.exists('tasks', id)) {
        return res.writeHead(404).end('Task not found');
      }

      if (title === '') {
        return res.writeHead(404).end('Field title is required');
      }

      if (description === '') {
        return res.writeHead(404).end('Field description is required');
      }

      if (tasks.completed_at !== null) {
        return res.writeHead(400).end('Task already completed');
      }

      database.update('tasks', id, {
        title,
        description,
        created_at: tasks.created_at,
        completed_at: tasks.completed_at,
        updated_at: new Date().toISOString(),
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: async (req, res) => {
      const { id } = req.params;

      if (!database.exists('tasks', id)) {
        return res.writeHead(404).end('Task not found');
      }

      if (database.selectOne('tasks', id).completed_at === null) {
        const tasks = database.selectOne('tasks', id);

        database.update('tasks', id, {
          title: tasks.title,
          description: tasks.description,
          created_at: tasks.created_at,
          completed_at: new Date().toISOString(),
          updated_at: tasks.updated_at,
        });

        return res.writeHead(200).end();
      }

      return res.writeHead(400).end('Task already completed');
    },
  },
];

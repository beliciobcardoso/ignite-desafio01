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
        updated_at: created_at,
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

      if (!database.exists('tasks', id)) {
        return res.writeHead(404).end('Task not found');
      }

      database.update('tasks', id, {
        title,
        description,
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

      if (database.select('tasks', id).completed_at) {
        return res.writeHead(400).end('Task already completed');
      }

      database.update('tasks', id, {
        completed_at: new Date().toISOString(),
      });

      return res.writeHead(204).end();
    },
  },
];

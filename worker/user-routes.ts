import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, ProjectEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Project } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));
  // USERS
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await UserEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    return ok(c, await UserEntity.create(c.env, { id: crypto.randomUUID(), name: name.trim() }));
  });
  // CHATS
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ChatBoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  // MESSAGES
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
  // PROJECTS
  app.get('/api/projects', async (c) => {
    await ProjectEntity.ensureSeed(c.env);
    const page = await ProjectEntity.list(c.env, null, 100); // Get up to 100 projects
    return ok(c, page.items);
  });
  app.post('/api/projects', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: title.trim(),
      markdown: `# ${title.trim()}\n\nStart writing...`,
      description: '',
      keywords: '',
      updatedAt: Date.now(),
    };
    return ok(c, await ProjectEntity.create(c.env, newProject));
  });
  app.get('/api/projects/:id', async (c) => {
    const id = c.req.param('id');
    const project = new ProjectEntity(c.env, id);
    if (!await project.exists()) return notFound(c, 'project not found');
    return ok(c, await project.getState());
  });
  app.patch('/api/projects/:id', async (c) => {
    const id = c.req.param('id');
    const patchData = (await c.req.json()) as Partial<Project>;
    const project = new ProjectEntity(c.env, id);
    if (!await project.exists()) return notFound(c, 'project not found');
    const updatedData = { ...patchData, updatedAt: Date.now() };
    await project.patch(updatedData);
    return ok(c, await project.getState());
  });

  app.patch('/api/projects/:id/layout', async (c) => {
    const id = c.req.param('id');
    const { layout } = (await c.req.json()) as { layout?: string[] };
    if (!Array.isArray(layout)) return bad(c, 'layout must be an array');
    
    const project = new ProjectEntity(c.env, id);
    if (!await project.exists()) return notFound(c, 'project not found');

    await project.patch({ layout, updatedAt: Date.now() });
    return ok(c, await project.getState());
  });

  app.delete('/api/projects/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await ProjectEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  // DELETE: Users
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));

  // MOCK ANALYTICS
  app.get('/api/analytics/:projectId', async (c) => {
    const mockData = {
      totalVisitors: 2435,
      pageViews: 9876,
      bounceRate: 42.5,
      traffic: Array.from({ length: 7 }, (_, i) => ({ name: `Day ${i + 1}`, uv: Math.floor(Math.random() * 500) + 100 })),
      lighthouseScores: [
        { name: 'Perf', score: 98 }, { name: 'A11y', score: 100 }, { name: 'Best', score: 95 }, { name: 'SEO', score: 100 },
      ],
      topPages: [{ path: '/', views: 4502 }, { path: '/about', views: 1234 }, { path: '/contact', views: 876 }],
      trafficSources: [{ name: 'Direct', value: 400 }, { name: 'Google', value: 300 }, { name: 'Twitter', value: 200 }, { name: 'Other', value: 100 }],
    };
    return ok(c, mockData);
  });

  app.post('/api/users/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await UserEntity.deleteMany(c.env, list), ids: list });
  });
  // DELETE: Chats
  app.delete('/api/chats/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await ChatBoardEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/chats/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await ChatBoardEntity.deleteMany(c.env, list), ids: list });
  });
}
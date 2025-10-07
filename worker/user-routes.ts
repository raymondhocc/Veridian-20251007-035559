import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, AlertsEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { generateMockMetrics, generateRegionalMockData, generateTriggeredAlerts } from '@shared/mock-data';
import { Platform, PlatformData, AlertConfiguration } from '@shared/types';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));
  // METRICS
  app.get('/api/metrics/regional', (c) => {
    const regionalData = generateRegionalMockData();
    return ok(c, regionalData);
  });
  app.get('/api/metrics/all', (c) => {
    const platforms: Platform[] = ['Solana', 'Ethereum', 'BSC'];
    const allMetrics: PlatformData[] = platforms.map(platform => ({
      platform,
      metrics: generateMockMetrics(platform),
    }));
    return ok(c, allMetrics);
  });
  app.get('/api/metrics/:platform', (c) => {
    const platformParam = c.req.param('platform').toLowerCase();
    let platform: Platform;
    switch (platformParam) {
      case 'solana':
        platform = 'Solana';
        break;
      case 'ethereum':
        platform = 'Ethereum';
        break;
      case 'bsc':
        platform = 'BSC';
        break;
      default:
        return bad(c, 'Invalid platform specified');
    }
    const metrics = generateMockMetrics(platform);
    return ok(c, { platform, metrics });
  });
  // ALERTS
  app.get('/api/alerts/triggered', (c) => {
    const triggeredAlerts = generateTriggeredAlerts();
    return ok(c, triggeredAlerts);
  });
  app.get('/api/alerts', async (c) => {
    const alertsEntity = new AlertsEntity(c.env);
    const configs = await alertsEntity.getConfigurations();
    return ok(c, configs);
  });
  app.post('/api/alerts', async (c) => {
    try {
      const configs = await c.req.json<AlertConfiguration[]>();
      if (!Array.isArray(configs)) {
        return bad(c, 'Request body must be an array of alert configurations.');
      }
      const alertsEntity = new AlertsEntity(c.env);
      await alertsEntity.saveConfigurations(configs);
      return ok(c, { success: true });
    } catch (error) {
      console.error('Failed to save alert configurations:', error);
      return c.json({ success: false, error: 'Invalid JSON format' }, 400);
    }
  });
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
  // DELETE: Users
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
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
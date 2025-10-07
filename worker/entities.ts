import { Entity, IndexedEntity, type Env } from "./core-utils";
import type { User, Chat, ChatMessage, AlertConfiguration } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS } from "@shared/mock-data";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map((c) => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter((m) => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate((s) => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}
export class AlertsEntity extends Entity<AlertConfiguration[]> {
  static readonly entityName = "alerts";
  static readonly fixedId = "all-alerts";
  static readonly initialState: AlertConfiguration[] = [];
  constructor(env: Env) {
    super(env, AlertsEntity.fixedId);
  }
  async getConfigurations(): Promise<AlertConfiguration[]> {
    return this.getState();
  }
  async saveConfigurations(configs: AlertConfiguration[]): Promise<void> {
    await this.save(configs);
  }
}
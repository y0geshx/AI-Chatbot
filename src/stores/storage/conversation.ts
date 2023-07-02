import { del, entries, get, set, update } from 'idb-keyval'
import { conversations } from './db'
import type { Conversation } from '@/types/conversation'

const setItem = async(key: string, item: Conversation) => {
  const store = conversations.get()
  if (store)
    await set(key, item, store)
}

const getItem = async(key: string) => {
  const store = conversations.get()
  if (store)
    return get<Conversation>(key, store)
  return null
}

const updateItem = async(key: string, item: Conversation) => {
  const store = conversations.get()
  if (store)
    await update(key, () => item, store)
}

const deleteItem = async(key: string) => {
  const store = conversations.get()
  if (store)
    await del(key, store)
}

const exportData = async() => {
  const store = conversations.get()
  if (store) {
    const entriesData = await entries(store)
    return Object.fromEntries(entriesData) as Record<string, Conversation>
  }
  return null
}

export const db = {
  setItem,
  getItem,
  updateItem,
  deleteItem,
  exportData,
}

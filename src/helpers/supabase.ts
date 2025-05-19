import { createClient } from '@supabase/supabase-js'
import { SUPABASE_ANON_KEY, SUPABASE_PROJECT_URL } from '../config'
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV({ id: 'supabase-storage' })

const mmkvStorageConfig = {
  setItem: (key: string, data: any) => storage.set(key, data),
  getItem: (key: string) => storage.getString(key),
  removeItem: (key: string) => storage.delete(key),
}

export const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: mmkvStorageConfig,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
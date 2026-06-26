import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co',
  supabaseAnonKey || 'missing-anon-key',
);

export type Room = {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
};

export type Message = {
  id: string;
  room_id: string;
  nickname: string;
  icon: string;
  body: string;
  message_type: 'normal' | 'system';
  created_at: string;
};

export type ReportReason =
  | '暴言・嫌がらせ'
  | '荒らし'
  | '個人情報'
  | '違法行為'
  | 'その他';

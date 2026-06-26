create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  is_public boolean default true,
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  nickname text not null,
  icon text default 'default',
  body text not null,
  message_type text default 'normal',
  created_at timestamptz default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references messages(id) on delete cascade,
  reason text,
  created_at timestamptz default now()
);

insert into rooms (name, description) values
('本部', 'メインの集会所'),
('雑談室', '自由に話す場所'),
('作戦会議', '企画やアイデアを話す場所'),
('初参加者の部屋', '初めて来た人向けの場所'),
('深夜集会', '夜に話す場所');

-- Maje Drive: esquema do banco (Supabase / PostgreSQL)
-- Cole no SQL Editor do Supabase e execute.

create table if not exists public.vehicles (
  id           text primary key,
  brand        text not null,
  model        text not null,
  year         int  not null,
  plate        text not null,
  mileage      int  not null default 0,
  fuel_type    text not null,
  color        text not null,
  health_score int  not null default 100,
  photo        text
);

create table if not exists public.maintenances (
  id           text primary key,
  vehicle_id   text not null references public.vehicles(id) on delete cascade,
  category     text not null,
  name         text not null,
  date         date not null,
  mileage      int  not null,
  cost         numeric(12,2) not null default 0,
  notes        text,
  next_mileage int,
  next_date    date
);

create index if not exists maintenances_vehicle_idx on public.maintenances(vehicle_id);

-- RLS ligado. As políticas abaixo liberam leitura/escrita para a chave anônima
-- porque o protótipo ainda NÃO tem login (todos os aparelhos compartilham os dados).
-- Para produção: adicionar Supabase Auth, uma coluna user_id e políticas por usuário.
alter table public.vehicles     enable row level security;
alter table public.maintenances enable row level security;

drop policy if exists "demo_all_vehicles" on public.vehicles;
create policy "demo_all_vehicles" on public.vehicles
  for all to anon using (true) with check (true);

drop policy if exists "demo_all_maintenances" on public.maintenances;
create policy "demo_all_maintenances" on public.maintenances
  for all to anon using (true) with check (true);

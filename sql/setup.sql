-- Execute no SQL Editor do Supabase

create table if not exists public.registros (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade default auth.uid(),
  titulo      text not null,
  descricao   text,
  created_at  timestamptz not null default now(),

  -- Etapa 5: regra de validação no banco
  constraint registros_titulo_tamanho
    check (char_length(trim(titulo)) between 3 and 100)
);

alter table public.registros enable row level security;

-- Cada usuário lê apenas os próprios registros
create policy "registros_select_proprios"
  on public.registros for select
  to authenticated
  using (auth.uid() = user_id);

-- Etapa 5: só pode inserir em nome de si mesmo
create policy "registros_insert_proprios"
  on public.registros for insert
  to authenticated
  with check (auth.uid() = user_id);

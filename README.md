# Validação de Formulários com React Hook Form, Zod e Supabase

Aplicação React + Vite com Supabase Auth, Context API, rotas protegidas e formulários validados com React Hook Form + Zod.

## Como executar

1. `npm install`
2. Crie um projeto no [Supabase](https://supabase.com) e rode o arquivo `sql/setup.sql` no SQL Editor.
3. Copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (chave **anon/public**, nunca a `service_role`).
4. `npm run dev`

Dica: em *Authentication > Providers > Email*, desative "Confirm email" para testar o cadastro mais rápido.

## Rotas

| Rota | Página | Acesso |
| --- | --- | --- |
| `/login` | Login | Público |
| `/registro` | Cadastro | Público |
| `/registros` | Listagem | Autenticado |
| `/registros/novo` | Novo registro | Autenticado |

## Estrutura

- `src/schemas/` — schemas Zod (`authSchemas.js`, `registroSchema.js`)
- `src/lib/supabaseErrors.js` — tradução dos erros do Supabase para mensagens amigáveis
- `src/contexts/AuthContext.jsx` — sessão do usuário
- `src/components/ProtectedRoute.jsx` — proteção de rotas
- `sql/setup.sql` — tabela, constraint e políticas RLS

## Teste da Etapa 5 (fora do formulário)

Com o usuário logado, rode no console do navegador (ou em um script) usando o cliente do Supabase:

```js
// 1) Título curto demais (viola a CHECK)
await supabase.from('registros').insert({ titulo: 'ab', user_id: (await supabase.auth.getUser()).data.user.id })

// 2) Inserir em nome de outro usuário (viola a política RLS)
await supabase.from('registros').insert({ titulo: 'Título válido', user_id: '00000000-0000-0000-0000-000000000000' })
```

**Resultado obtido:** _(cole aqui o erro que apareceu; esperado: código `23514` no teste 1 e `42501` no teste 2)_

## Perguntas

1. **Vantagem do React Hook Form sobre `useState` por campo:** os campos são não controlados (usam `ref`), então digitar não re-renderiza o formulário inteiro; além disso, ele já entrega validação, estado de erros e `isSubmitting`, com bem menos código.
2. **Zod e `zodResolver`:** o Zod descreve as regras de validação (o schema). O `zodResolver` é a ponte que permite ao React Hook Form executar esse schema e transformar os erros do Zod no formato `errors` que ele entende.
3. **Por que o front-end não basta:** o código do navegador pode ser alterado, e qualquer pessoa pode chamar a API do Supabase diretamente, ignorando o formulário. A segurança real precisa estar no servidor.
4. **Erro de formulário x erro do Supabase:** o primeiro acontece no cliente, antes do envio, quando os dados violam o schema. O segundo vem do servidor depois do envio (e-mail já cadastrado, credenciais erradas, constraint ou RLS violada).
5. **Mensagem genérica no login:** dizer "e-mail não cadastrado" ou "senha incorreta" separadamente permite a um atacante descobrir quais e-mails existem (enumeração de usuários).
6. **Constraints e `WITH CHECK`:** a `CHECK` garante a integridade do dado (ex.: tamanho do título) em qualquer inserção. O `WITH CHECK` do RLS valida a linha que está sendo inserida/alterada, garantindo que o usuário só grave dados em seu próprio nome. (`USING` filtra quais linhas já existentes podem ser vistas/alteradas.)

## Fontes consultadas e dificuldades

_(liste aqui a documentação que você leu: React Hook Form, Zod, @hookform/resolvers, Supabase Auth e RLS, e as dificuldades que encontrou)_

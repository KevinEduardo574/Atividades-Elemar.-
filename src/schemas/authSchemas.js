import { z } from 'zod'

const email = z
  .string()
  .min(1, 'Informe o e-mail.')
  .email('Informe um e-mail válido.')

export const loginSchema = z.object({
  email,
  senha: z.string().min(1, 'Informe a senha.'),
})

export const registroSchema = z
  .object({
    nome: z.string().trim().min(1, 'Informe o nome completo.'),
    email,
    senha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.'),
    confirmarSenha: z.string().min(1, 'Confirme a senha.'),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'], // o erro aparece no campo de confirmação
  })

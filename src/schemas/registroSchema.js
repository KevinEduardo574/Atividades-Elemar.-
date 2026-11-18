import { z } from 'zod'

export const novoRegistroSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(3, 'O título deve ter no mínimo 3 caracteres.')
    .max(100, 'O título deve ter no máximo 100 caracteres.'),
  descricao: z
    .string()
    .trim()
    .max(500, 'A descrição deve ter no máximo 500 caracteres.')
    .optional(),
})

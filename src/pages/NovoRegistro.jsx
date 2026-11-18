import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { novoRegistroSchema } from '../schemas/registroSchema'
import { traduzErroBanco } from '../lib/supabaseErrors'

export default function NovoRegistro() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [sucesso, setSucesso] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(novoRegistroSchema),
    mode: 'onBlur',
    defaultValues: { titulo: '', descricao: '' },
  })

  async function onSubmit({ titulo, descricao }) {
    setSucesso('')
    const { error } = await supabase
      .from('registros')
      .insert({ titulo, descricao: descricao || null, user_id: user.id })

    if (error) {
      const { field, message } = traduzErroBanco(error)
      setError(field ?? 'root', { message })
      return
    }

    reset() // limpa o formulário
    setSucesso('Registro salvo com sucesso! Redirecionando...')
    setTimeout(() => navigate('/registros'), 1200)
  }

  return (
    <div className="container">
      <h1>Novo registro</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {errors.root && <div className="alert error-box">{errors.root.message}</div>}
        {sucesso && <div className="alert success-box">{sucesso}</div>}

        <div className="field">
          <label htmlFor="titulo">Título</label>
          <input id="titulo" className={errors.titulo ? 'invalid' : ''} {...register('titulo')} />
          {errors.titulo && <span className="error">{errors.titulo.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="descricao">Descrição (opcional)</label>
          <textarea id="descricao" rows={4} className={errors.descricao ? 'invalid' : ''} {...register('descricao')} />
          {errors.descricao && <span className="error">{errors.descricao.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
        {' '}<Link to="/registros">Cancelar</Link>
      </form>
    </div>
  )
}

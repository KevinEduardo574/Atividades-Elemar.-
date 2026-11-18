import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { registroSchema } from '../schemas/authSchemas'
import { traduzErroAuth } from '../lib/supabaseErrors'

export default function Registro() {
  const navigate = useNavigate()
  const [sucesso, setSucesso] = useState('')
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registroSchema),
    mode: 'onBlur',
    defaultValues: { nome: '', email: '', senha: '', confirmarSenha: '' },
  })

  async function onSubmit({ nome, email, senha }) {
    setSucesso('')
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } },
    })

    if (error) {
      const { field, message } = traduzErroAuth(error, 'registro')
      setError(field ?? 'root', { message })
      return
    }

    // Com confirmação de e-mail ligada, o Supabase não devolve erro para e-mail
    // repetido (evita enumeração de usuários); devolve um usuário sem identities.
    if (data.user && data.user.identities?.length === 0) {
      setError('email', { message: 'Este e-mail já está cadastrado.' })
      return
    }

    if (data.session) {
      navigate('/registros')
    } else {
      setSucesso('Cadastro realizado! Verifique seu e-mail para confirmar a conta.')
    }
  }

  return (
    <div className="container">
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {errors.root && <div className="alert error-box">{errors.root.message}</div>}
        {sucesso && <div className="alert success-box">{sucesso}</div>}

        <div className="field">
          <label htmlFor="nome">Nome completo</label>
          <input id="nome" className={errors.nome ? 'invalid' : ''} {...register('nome')} />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" className={errors.email ? 'invalid' : ''} {...register('email')} />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" className={errors.senha ? 'invalid' : ''} {...register('senha')} />
          {errors.senha && <span className="error">{errors.senha.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="confirmarSenha">Confirmar senha</label>
          <input id="confirmarSenha" type="password" className={errors.confirmarSenha ? 'invalid' : ''} {...register('confirmarSenha')} />
          {errors.confirmarSenha && <span className="error">{errors.confirmarSenha.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      <p>Já tem conta? <Link to="/login">Entrar</Link></p>
    </div>
  )
}

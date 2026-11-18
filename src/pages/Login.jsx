import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { loginSchema } from '../schemas/authSchemas'
import { traduzErroAuth } from '../lib/supabaseErrors'

export default function Login() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', senha: '' },
  })

  async function onSubmit({ email, senha }) {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) {
      const { message } = traduzErroAuth(error, 'login')
      setError('root', { message })
      return
    }
    navigate('/registros')
  }

  return (
    <div className="container">
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {errors.root && <div className="alert error-box">{errors.root.message}</div>}

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

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p>Não tem conta? <Link to="/registro">Cadastre-se</Link></p>
    </div>
  )
}

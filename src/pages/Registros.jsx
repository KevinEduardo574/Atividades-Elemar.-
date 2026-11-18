import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function Registros() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [registros, setRegistros] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase
        .from('registros')
        .select('id, titulo, descricao, created_at')
        .order('created_at', { ascending: false })
      if (error) setErro('Não foi possível carregar os registros.')
      else setRegistros(data)
      setCarregando(false)
    }
    carregar()
  }, [])

  async function sair() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="container wide">
      <nav>
        <span>{user?.email}</span>
        <button className="link" onClick={sair}>Sair</button>
      </nav>
      <h1>Registros</h1>
      <Link to="/registros/novo" className="btn">Novo registro</Link>

      {erro && <div className="alert error-box" style={{ marginTop: 16 }}>{erro}</div>}
      {carregando ? <p>Carregando...</p> : (
        <ul className="lista" style={{ marginTop: 16 }}>
          {registros.length === 0 && <p>Nenhum registro ainda.</p>}
          {registros.map((r) => (
            <li key={r.id}>
              <strong>{r.titulo}</strong>
              {r.descricao && <p>{r.descricao}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

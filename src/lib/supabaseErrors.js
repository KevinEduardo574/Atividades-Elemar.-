// Traduz erros do Supabase em mensagens amigáveis.
// Nunca devolve error.message original ao usuário.
// Retorno: { field?: string, message: string }

export function traduzErroAuth(error, contexto) {
  const code = error?.code

  if (contexto === 'login') {
    // Mensagem genérica de propósito: não revela se o e-mail existe.
    if (code === 'invalid_credentials' || code === 'email_not_confirmed' || error?.status === 400) {
      return { message: 'E-mail ou senha inválidos.' }
    }
  }

  switch (code) {
    case 'user_already_exists':
    case 'email_exists':
      return { field: 'email', message: 'Este e-mail já está cadastrado.' }
    case 'weak_password':
      return { field: 'senha', message: 'Senha fraca. Use uma senha mais forte.' }
    case 'email_address_invalid':
    case 'validation_failed':
      return { field: 'email', message: 'E-mail inválido.' }
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
      return { message: 'Muitas tentativas. Aguarde um pouco e tente novamente.' }
    default:
      return { message: 'Não foi possível concluir a operação. Tente novamente.' }
  }
}

export function traduzErroBanco(error) {
  switch (error?.code) {
    case '23514': // check_violation
      return { field: 'titulo', message: 'O título não atende ao tamanho permitido (3 a 100 caracteres).' }
    case '42501': // violação de política RLS
      return { message: 'Você não tem permissão para realizar esta ação.' }
    default:
      return { message: 'Não foi possível salvar o registro. Tente novamente.' }
  }
}

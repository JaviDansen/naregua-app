# Teste Rápido de Autenticação no Swagger

## Passo 1: Registrar um novo usuário

1. Acesse sua documentação Swagger: `http://localhost:3000/api-docs`
2. Procure por **Autenticação** → **POST /users/register**
3. Clique em "Try it out"
4. Preencha os dados:

```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123456",
  "telefone": "11987654321",
  "perfil": "usuario"
}
```

5. Clique em "Execute"
6. Você verá uma resposta como:
```json
{
  "mensagem": "Usuário cadastrado com sucesso",
  "dados": {
    "id": "abc123",
    "nome": "João Silva",
    "email": "joao@example.com",
    "perfil": "usuario"
  }
}
```

## Passo 2: Fazer Login

1. Procure por **Autenticação** → **POST /users/login**
2. Clique em "Try it out"
3. Preencha com os dados que acabou de registrar:

```json
{
  "email": "joao@example.com",
  "senha": "senha123456"
}
```

4. Clique em "Execute"
5. Você receberá algo assim:

```json
{
  "mensagem": "Login realizado com sucesso",
  "dados": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFiYzEyMyIsIm5vbWUiOiJKb8OjbyBTaWx2YSIsImVtYWlsIjoiam9hb0BleGFtcGxlLmNvbSIsInBlcmZpbCI6InVzdWFyaW8iLCJpYXQiOjE2ODQ3NTA2MzUsImV4cCI6MTY4NDc1NDIzNX0.XyZaBcDeFgHiJkLmNoPqRsTuVwXyZaBcD...",
    "usuario": {
      "id": "abc123",
      "nome": "João Silva",
      "email": "joao@example.com",
      "perfil": "usuario"
    }
  }
}
```

## Passo 3: Usar o Token no Swagger

1. **Copie o valor do `token`** (aquela string longa)
2. Clique no botão **"Authorize"** (🔒) no topo da página
3. Cole o token no campo "Value:" (sem aspas)
4. Clique em "Authorize"
5. Clique em "Close"

✅ **Pronto!** Agora você pode usar qualquer endpoint que exija autenticação!

## Dicas Importantes

- **Tempo de expiração**: O token dura 1 hora. Depois precisa fazer login novamente
- **Segurança**: Nunca compartilhe seu token
- **Prefixo**: O token já tem o prefixo "Bearer" configurado automaticamente
- **Sem autenticação**: Endpoints de `/register` e `/login` não precisam de token

## Teste com outro Endpoint

Agora tente qualquer outro endpoint, como:
- **GET /users** - Lista todos os usuários (requer autenticação)
- **GET /users/:id** - Obtém um usuário específico

O token será automaticamente incluído em todas as requisições! 🚀

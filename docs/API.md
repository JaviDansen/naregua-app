# API - NaReguaApp

Documentacao dos endpoints atuais da API REST do sistema de agendamento para barbearias.

Esta referencia pode ser usada como base para uma Collection do Postman ou para criar um arquivo OpenAPI/Swagger.

## Base URL

Local:

```text
http://localhost:3000
```

Deploy:

```text
https://naregua-app.vercel.app
```

## Autenticacao

A API utiliza JWT.

Rotas protegidas exigem o header:

```http
Authorization: Bearer <token>
```

O token e retornado em `POST /login` e expira em 1 hora.

## Perfis de usuario

```text
usuario
admin
```

Algumas rotas exigem usuario autenticado com perfil `admin`.

## Padrao de resposta

Sucesso com mensagem:

```json
{
  "mensagem": "Operacao realizada com sucesso",
  "dados": {
    "id": 1
  }
}
```

Sucesso com listagem:

```json
{
  "dados": [
    {
      "id": 1
    }
  ]
}
```

Erro:

```json
{
  "erro": "Mensagem do erro"
}
```

## Status HTTP comuns

| Status | Uso |
| --- | --- |
| `200` | Requisicao concluida com sucesso |
| `201` | Registro criado com sucesso |
| `400` | Dados invalidos ou obrigatorios ausentes |
| `401` | Token ausente, mal formatado, invalido ou expirado |
| `403` | Usuario autenticado sem permissao |
| `404` | Registro nao encontrado |
| `409` | Conflito de regra de negocio |
| `500` | Erro interno |

## Health Check

### `GET /`

Verifica se a API esta rodando.

**Autenticacao:** publica

**Response `200`:**

```text
API Barbearia rodando
```

## Auth e Usuarios

### `POST /register`

Cadastra um usuario.

**Autenticacao:** publica

**Regras:**

- `nome`, `email` e `senha` sao obrigatorios.
- `senha` deve ter no minimo 8 caracteres.
- `email` e normalizado para letras minusculas.
- `perfil` aceita apenas `usuario` ou `admin`.
- Quando `perfil` for `usuario`, `telefone` e obrigatorio.
- Se `perfil` nao for enviado, o backend usa `usuario`.

**Request:**

```json
{
  "nome": "Joao",
  "email": "joao@email.com",
  "senha": "12345678",
  "telefone": "11999999999",
  "perfil": "usuario"
}
```

**Response `201`:**

```json
{
  "mensagem": "Usuario cadastrado com sucesso",
  "dados": {
    "id": 1,
    "nome": "Joao",
    "email": "joao@email.com",
    "perfil": "usuario"
  }
}
```

**Erros comuns:** `400`, `409`, `500`

### `POST /login`

Realiza login.

**Autenticacao:** publica

**Request:**

```json
{
  "email": "joao@email.com",
  "senha": "12345678"
}
```

**Response `200`:**

```json
{
  "mensagem": "Login realizado com sucesso",
  "dados": {
    "token": "jwt_token",
    "usuario": {
      "id": 1,
      "nome": "Joao",
      "email": "joao@email.com",
      "perfil": "usuario"
    }
  }
}
```

**Erros comuns:** `400`, `401`, `500`

### `GET /profile`

Retorna o perfil do usuario autenticado.

**Autenticacao:** usuario autenticado

**Response `200`:**

```json
{
  "dados": {
    "id": 1,
    "nome": "Joao",
    "email": "joao@email.com",
    "perfil": "usuario",
    "telefone": "11999999999"
  }
}
```

**Erros comuns:** `401`, `404`, `500`

### `PUT /profile`

Atualiza o perfil do usuario autenticado.

**Autenticacao:** usuario autenticado

**Request:**

```json
{
  "nome": "Joao Silva",
  "telefone": "11988888888"
}
```

**Response `200`:**

```json
{
  "mensagem": "Perfil atualizado com sucesso",
  "dados": {
    "id": 1,
    "nome": "Joao Silva",
    "email": "joao@email.com",
    "perfil": "usuario",
    "telefone": "11988888888"
  }
}
```

**Erros comuns:** `400`, `401`, `404`, `500`

### `GET /users`

Lista usuarios clientes (`perfil = usuario`), ordenados por nome.

**Autenticacao:** admin

**Response `200`:**

```json
{
  "dados": [
    {
      "id": 1,
      "nome": "Joao",
      "email": "joao@email.com",
      "telefone": "11999999999"
    }
  ]
}
```

**Erros comuns:** `401`, `403`, `500`

## Servicos

### `GET /services`

Lista servicos.

**Autenticacao:** publica

**Response `200`:**

```json
{
  "dados": [
    {
      "id": 1,
      "nome": "Corte Masculino",
      "preco": "35.00",
      "duracao": 30
    }
  ]
}
```

**Erros comuns:** `500`

### `POST /services`

Cria um servico.

**Autenticacao:** admin

**Request:**

```json
{
  "nome": "Corte Masculino",
  "preco": 35,
  "duracao": 30
}
```

**Response `201`:**

```json
{
  "mensagem": "Servico criado com sucesso",
  "dados": {
    "id": 1,
    "nome": "Corte Masculino",
    "preco": "35.00",
    "duracao": 30
  }
}
```

**Erros comuns:** `401`, `403`, `500`

### `PUT /services/:id`

Atualiza um servico.

**Autenticacao:** admin

**Path params:**

| Param | Tipo | Obrigatorio |
| --- | --- | --- |
| `id` | number | sim |

**Request:**

```json
{
  "nome": "Corte + Barba",
  "preco": 60,
  "duracao": 60
}
```

**Response `200`:**

```json
{
  "mensagem": "Servico atualizado com sucesso.",
  "dados": {
    "id": 1,
    "nome": "Corte + Barba",
    "preco": "60.00",
    "duracao": 60
  }
}
```

**Erros comuns:** `400`, `401`, `403`, `404`, `500`

### `DELETE /services/:id`

Exclui um servico.

**Autenticacao:** admin

**Regras:**

- Nao permite excluir servico com agendamentos vinculados.

**Response `200`:**

```json
{
  "mensagem": "Servico excluido com sucesso."
}
```

**Erros comuns:** `400`, `401`, `403`, `404`, `409`, `500`

## Funcionarios

### `GET /employees`

Lista funcionarios com dados publicos.

**Autenticacao:** publica

**Response `200`:**

```json
{
  "dados": [
    {
      "id": 1,
      "nome": "Carlos",
      "especialidade": "Corte e barba"
    }
  ]
}
```

**Erros comuns:** `500`

### `GET /employees/admin`

Lista funcionarios com dados completos para administracao.

**Autenticacao:** admin

**Response `200`:**

```json
{
  "dados": [
    {
      "id": 1,
      "nome": "Carlos",
      "especialidade": "Corte e barba",
      "telefone": "11999999999"
    }
  ]
}
```

**Erros comuns:** `401`, `403`, `500`

### `POST /employees`

Cria um funcionario.

**Autenticacao:** admin

**Request:**

```json
{
  "nome": "Carlos",
  "especialidade": "Corte e barba",
  "telefone": "11999999999"
}
```

**Response `201`:**

```json
{
  "mensagem": "Funcionario criado com sucesso",
  "dados": {
    "id": 1,
    "nome": "Carlos",
    "especialidade": "Corte e barba",
    "telefone": "11999999999",
    "criado_em": "2026-04-10T05:02:00-03:00"
  }
}
```

**Erros comuns:** `400`, `401`, `403`, `500`

### `PUT /employees/:id`

Atualiza um funcionario.

**Autenticacao:** admin

**Request:**

```json
{
  "nome": "Carlos Souza",
  "especialidade": "Corte, barba e acabamento",
  "telefone": "11988888888"
}
```

**Response `200`:**

```json
{
  "mensagem": "Funcionario atualizado com sucesso.",
  "dados": {
    "id": 1,
    "nome": "Carlos Souza",
    "especialidade": "Corte, barba e acabamento",
    "telefone": "11988888888",
    "criado_em": "2026-04-10T05:02:00-03:00"
  }
}
```

**Erros comuns:** `400`, `401`, `403`, `404`, `500`

### `DELETE /employees/:id`

Exclui um funcionario.

**Autenticacao:** admin

**Regras:**

- Nao permite excluir funcionario com agendamentos vinculados.

**Response `200`:**

```json
{
  "mensagem": "Funcionario excluido com sucesso."
}
```

**Erros comuns:** `400`, `401`, `403`, `404`, `409`, `500`

## Agendamentos

### `POST /appointments`

Cria um agendamento.

**Autenticacao:** usuario autenticado

**Regras:**

- `servico_id`, `funcionario_id` e `data_hora` sao obrigatorios.
- `data_hora` deve ser enviada como data/hora local no formato `YYYY-MM-DDTHH:mm`.
- Nao permite criar agendamento no passado.
- Nao permite agendar em dia fechado.
- Nao permite horario fora do funcionamento.
- Nao permite conflito de horario considerando a duracao do servico.
- Usuario comum cria agendamento apenas para si mesmo.
- Admin pode informar `usuario_id` para criar agendamento para outro usuario.

**Request usuario comum:**

```json
{
  "servico_id": 1,
  "funcionario_id": 1,
  "data_hora": "2026-04-15T14:00"
}
```

**Request admin:**

```json
{
  "usuario_id": 1,
  "servico_id": 1,
  "funcionario_id": 1,
  "data_hora": "2026-04-15T14:00"
}
```

**Response `201`:**

```json
{
  "mensagem": "Agendamento criado com sucesso",
  "dados": {
    "id": 1,
    "usuario_id": 1,
    "servico_id": 1,
    "funcionario_id": 1,
    "data_hora": "2026-04-15T14:00:00-03:00",
    "status": "agendado",
    "criado_em": "2026-04-10T12:00:00-03:00"
  }
}
```

**Erros comuns:** `400`, `401`, `403`, `404`, `409`, `500`

### `GET /appointments`

Lista todos os agendamentos.

**Autenticacao:** admin

**Response `200`:**

```json
{
  "dados": [
    {
      "id": 1,
      "usuario_id": 1,
      "servico_id": 1,
      "funcionario_id": 1,
      "usuario": "Joao",
      "servico": "Corte Masculino",
      "duracao_servico": 30,
      "funcionario": "Carlos",
      "data_hora": "2026-04-15T14:00:00-03:00",
      "status": "agendado",
      "criado_em": "2026-04-10T12:00:00-03:00",
      "situacao_operacional": "normal"
    }
  ]
}
```

**Erros comuns:** `401`, `403`, `500`

### `GET /my-appointments`

Lista agendamentos do usuario autenticado.

**Autenticacao:** usuario autenticado

**Response `200`:**

```json
{
  "dados": [
    {
      "id": 1,
      "servico_id": 1,
      "funcionario_id": 1,
      "servico": "Corte Masculino",
      "duracao_servico": 30,
      "funcionario": "Carlos",
      "data_hora": "2026-04-15T14:00:00-03:00",
      "status": "agendado",
      "situacao_operacional": "normal"
    }
  ]
}
```

**Erros comuns:** `401`, `500`

### `PUT /appointments/:id`

Edita um agendamento.

**Autenticacao:** usuario autenticado

**Regras:**

- Usuario comum so pode editar seus proprios agendamentos.
- Admin pode editar qualquer agendamento.
- Nao permite editar agendamento cancelado.
- Nao permite editar para data/hora passada.
- Nao permite conflito de horario considerando a duracao do servico.

**Request:**

```json
{
  "servico_id": 1,
  "funcionario_id": 1,
  "data_hora": "2026-04-20T15:00"
}
```

**Response `200`:**

```json
{
  "mensagem": "Agendamento atualizado com sucesso",
  "dados": {
    "id": 1,
    "usuario_id": 1,
    "servico_id": 1,
    "funcionario_id": 1,
    "data_hora": "2026-04-20T15:00:00-03:00",
    "status": "agendado",
    "criado_em": "2026-04-10T12:00:00-03:00"
  }
}
```

**Erros comuns:** `400`, `401`, `403`, `404`, `409`, `500`

### `PUT /appointments/:id/cancel`

Cancela um agendamento.

**Autenticacao:** usuario autenticado

**Regras:**

- Usuario comum so pode cancelar seus proprios agendamentos.
- Admin pode cancelar qualquer agendamento.
- Nao permite cancelar agendamento ja cancelado.

**Response `200`:**

```json
{
  "mensagem": "Agendamento cancelado com sucesso",
  "dados": {
    "id": 1,
    "status": "cancelado",
    "data_hora": "2026-04-15T14:00:00-03:00",
    "criado_em": "2026-04-10T12:00:00-03:00"
  }
}
```

**Erros comuns:** `400`, `401`, `403`, `404`, `500`

### `DELETE /appointments/:id`

Exclui definitivamente um agendamento.

**Autenticacao:** admin

**Response `200`:**

```json
{
  "mensagem": "Agendamento deletado com sucesso.",
  "dados": {
    "id": 1
  }
}
```

**Erros comuns:** `400`, `401`, `403`, `404`, `500`

### `PUT /appointments/:id/complete`

Marca um agendamento como concluido.

**Autenticacao:** admin

**Regras:**

- Nao permite concluir agendamento cancelado.
- Nao permite concluir agendamento ja concluido.
- Nao permite concluir agendamento marcado como falta.

**Response `200`:**

```json
{
  "mensagem": "Agendamento marcado como concluido com sucesso.",
  "dados": {
    "id": 1,
    "status": "concluido",
    "data_hora": "2026-04-15T14:00:00-03:00"
  }
}
```

**Erros comuns:** `400`, `401`, `403`, `404`, `500`

### `PUT /appointments/:id/no-show`

Marca um agendamento como falta.

**Autenticacao:** admin

**Regras:**

- Nao permite marcar falta em agendamento cancelado.
- Nao permite marcar falta em agendamento concluido.
- Nao permite marcar falta em agendamento ja marcado como falta.

**Response `200`:**

```json
{
  "mensagem": "Agendamento marcado como falta com sucesso.",
  "dados": {
    "id": 1,
    "status": "faltou",
    "data_hora": "2026-04-15T14:00:00-03:00"
  }
}
```

**Erros comuns:** `400`, `401`, `403`, `404`, `500`

## Disponibilidade

### `GET /availability`

Consulta ocupacao e regra de funcionamento de um funcionario em uma data para um servico.

**Autenticacao:** usuario autenticado

**Query params:**

| Param | Tipo | Obrigatorio | Exemplo |
| --- | --- | --- | --- |
| `funcionario_id` | number | sim | `1` |
| `data` | string `YYYY-MM-DD` | sim | `2026-04-15` |
| `servico_id` | number | sim | `1` |

**Exemplo:**

```http
GET /availability?funcionario_id=1&data=2026-04-15&servico_id=1
```

**Response `200`:**

```json
{
  "dados": {
    "funcionario_id": 1,
    "data": "2026-04-15",
    "servico_id": 1,
    "intervalo_base_minutos": 20,
    "duracao_servico": 30,
    "horario_funcionamento": {
      "inicio": "09:00",
      "fim": "18:00",
      "fechado": false
    },
    "agendamentos_ocupados": [
      {
        "inicio": "10:00",
        "fim": "10:30",
        "duracao": 30
      }
    ]
  }
}
```

**Erros comuns:** `400`, `401`, `404`, `500`

## Horarios de funcionamento

### `GET /business-hours`

Lista as regras de funcionamento da barbearia.

**Autenticacao:** publica

**Campos:**

- `day_of_week`: `0` domingo, `1` segunda, `2` terca, `3` quarta, `4` quinta, `5` sexta, `6` sabado.
- `open_time` e `close_time`: horarios retornados pelo PostgreSQL.
- `is_closed`: indica se a barbearia esta fechada no dia.

**Response `200`:**

```json
{
  "dados": [
    {
      "id": 1,
      "day_of_week": 0,
      "open_time": null,
      "close_time": null,
      "is_closed": true
    },
    {
      "id": 2,
      "day_of_week": 1,
      "open_time": "09:00:00",
      "close_time": "18:00:00",
      "is_closed": false
    }
  ]
}
```

**Erros comuns:** `500`

## Status de agendamento

```text
agendado
cancelado
concluido
faltou
```

## Situacao operacional

Campo calculado retornado em listagens de agendamentos:

```text
normal
pendente_confirmacao
```

`pendente_confirmacao` e retornado quando o agendamento ainda esta com status `agendado`, mas o horario final estimado ja passou.

## Modelos principais

### Usuario

```json
{
  "id": 1,
  "nome": "Joao",
  "email": "joao@email.com",
  "perfil": "usuario",
  "telefone": "11999999999"
}
```

### Servico

```json
{
  "id": 1,
  "nome": "Corte Masculino",
  "preco": "35.00",
  "duracao": 30
}
```

### Funcionario

```json
{
  "id": 1,
  "nome": "Carlos",
  "especialidade": "Corte e barba",
  "telefone": "11999999999",
  "criado_em": "2026-04-10T05:02:00-03:00"
}
```

### Agendamento

```json
{
  "id": 1,
  "usuario_id": 1,
  "servico_id": 1,
  "funcionario_id": 1,
  "data_hora": "2026-04-15T14:00:00-03:00",
  "status": "agendado",
  "criado_em": "2026-04-10T12:00:00-03:00"
}
```

## Observacoes para Swagger/Postman

- Configure `Bearer Token` como autenticacao da collection.
- Use variaveis como `{{baseUrl}}`, `{{token}}`, `{{serviceId}}`, `{{employeeId}}`, `{{appointmentId}}`.
- Em Swagger/OpenAPI, os endpoints com `admin` devem usar o mesmo security scheme JWT, mas documentar a exigencia de perfil.
- Datas de agendamento devem ser enviadas no formato local `YYYY-MM-DDTHH:mm`.
- Respostas de data/hora sao retornadas como ISO-like com offset `-03:00`.

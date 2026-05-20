# NaReguaApp

Sistema web para gerenciamento de agendamentos em barbearias.

O projeto possui backend em Node.js/Express, frontend em React/Vite e banco PostgreSQL. A API cobre autenticacao JWT, cadastro de clientes, funcionarios, servicos, horarios de funcionamento e controle de agendamentos com validacao de disponibilidade.

## Funcionalidades

- Cadastro e login de usuarios
- Autenticacao com JWT
- Perfil de usuario com edicao de dados
- Controle de acesso por perfil `usuario` e `admin`
- Listagem de clientes para administradores
- Cadastro, edicao e exclusao de servicos
- Cadastro, edicao e exclusao de funcionarios
- Criacao, edicao, cancelamento e exclusao de agendamentos
- Marcacao de agendamentos como `concluido` ou `faltou`
- Consulta de disponibilidade por funcionario, data e servico
- Regras de horario de funcionamento da barbearia
- Documentacao da API com Swagger

## Tecnologias

### Backend

- Node.js
- Express
- PostgreSQL / Neon
- JWT
- bcrypt
- CORS
- Swagger UI / swagger-jsdoc

### Frontend

- React
- Vite
- React Router
- React Query
- Axios
- TailwindCSS

### Banco de dados

- PostgreSQL
- Extensao `citext`
- Tabelas principais:
  - `usuarios`
  - `servicos`
  - `funcionarios`
  - `agendamentos`
  - `business_hours`

## Estrutura do projeto

```text
.
|-- backend/
|   |-- docs/
|   |-- middlewares/
|   |-- routes/
|   |-- scripts/
|   |-- app.js
|   |-- db.js
|   `-- index.js
|-- database/
|   `-- schema.sql
|-- docs/
|   |-- API.md
|   `-- swagger-ui/
`-- frontend/
    |-- src/
    |-- index.html
    `-- vite.config.js
```

## Requisitos

- Node.js 18+
- npm
- PostgreSQL ou banco Neon

## Variaveis de ambiente

Crie um arquivo `.env` dentro de `backend/`:

```env
DATABASE_URL=sua_url_do_postgresql
JWT_SECRET=uma_chave_secreta
FRONTEND_URL=http://localhost:5173
```

No frontend, se quiser apontar para uma API diferente do padrao local, crie `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Como executar

### Backend

```bash
cd backend
npm install
npm run dev
```

Servidor local:

```text
http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicacao local:

```text
http://localhost:5173
```

## Banco de dados

O arquivo principal do schema esta em:

```text
database/schema.sql
```

Para criar as tabelas em um banco PostgreSQL, execute o SQL desse arquivo no seu banco local ou no SQL Editor do Neon.

O backend espera as tabelas `usuarios`, `servicos`, `funcionarios`, `agendamentos` e `business_hours`.

## API

A API segue o padrao REST e retorna respostas no formato:

```json
{
  "dados": {}
}
```

ou:

```json
{
  "mensagem": "Operacao realizada com sucesso",
  "dados": {}
}
```

Erros seguem o formato:

```json
{
  "erro": "Mensagem do erro"
}
```

A documentacao textual completa esta em:

```text
docs/API.md
```

## Documentacao (Swagger)

- Documentacao interativa local: `http://localhost:3000/api-docs` (executando o backend)
- Para publicar uma versao estatica da documentacao no GitHub Pages:

1. No diretorio `backend`, gere o JSON estatico:

```bash
cd backend
npm install
npm run export-swagger
```

2. Commit e push dos arquivos gerados em `docs/swagger-ui`.

3. Habilite o GitHub Pages nas configuracoes do repositorio (publishing source: branch `main`, pasta `/docs`).

4. A URL publica tipica ficara em: `https://<seu-usuario>.github.io/naregua-app/swagger-ui/` (substitua `<seu-usuario>` pelo seu usuario GitHub).

Observacao: rode `npm run export-swagger` sempre que atualizar comentarios JSDoc nas rotas para manter a documentacao sincronizada.

## Principais rotas

### Autenticacao e usuarios

- `POST /register`
- `POST /login`
- `GET /profile`
- `PUT /profile`
- `GET /users`

### Servicos

- `GET /services`
- `POST /services`
- `PUT /services/:id`
- `DELETE /services/:id`

### Funcionarios

- `GET /employees`
- `GET /employees/admin`
- `POST /employees`
- `PUT /employees/:id`
- `DELETE /employees/:id`

### Agendamentos

- `POST /appointments`
- `GET /appointments`
- `GET /my-appointments`
- `PUT /appointments/:id`
- `PUT /appointments/:id/cancel`
- `PUT /appointments/:id/complete`
- `PUT /appointments/:id/no-show`
- `DELETE /appointments/:id`
- `GET /availability`

### Horarios de funcionamento

- `GET /business-hours`

## Deploy

Backend em producao:

```text
https://naregua-app.vercel.app
```

Banco de dados:

```text
Neon PostgreSQL
```

## Scripts uteis

### Backend

```bash
npm run dev
npm start
npm run export-swagger
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```
# 💈 NaReguaApp

Sistema de agendamento para barbearias desenvolvido como projeto acadêmico, com foco em boas práticas de arquitetura, API REST, autenticação e gerenciamento de horários.

O sistema permite gerenciar usuários, funcionários, serviços e agendamentos, com validações de disponibilidade e regras de funcionamento da barbearia.

---

# 🚀 Tecnologias

## Backend
- Node.js
- Express
- PostgreSQL (Neon)
- JWT (Autenticação)
- Bcrypt

## Frontend
- React
- Vite
- TailwindCSS
- React Query
- Axios

---

# 🌐 Deploy

Backend hospedado na Vercel:

https://naregua-app.vercel.app

Banco de dados:

Neon PostgreSQL

---

# 🎯 Funcionalidades

- Autenticação de usuários
- Cadastro de serviços
- Cadastro de funcionários
- Criação de agendamentos
- Cancelamento de agendamentos
- Edição de agendamentos
- Disponibilidade por funcionário
- Horário de funcionamento da barbearia
- Controle de conflitos de horário

---

# 📌 Objetivo do Projeto

Projeto desenvolvido para disciplina acadêmica com foco em:

- API REST
- Autenticação JWT
- PostgreSQL
- Arquitetura Backend
- Boas práticas de desenvolvimento

---

# 📌 Status do Projeto

🚧 Em desenvolvimento

---

## 📚 Documentação (Swagger)

- Documentação interativa local: `http://localhost:3000/api-docs` (executando o backend)
- Para publicar uma versão estática da documentação no GitHub Pages:

1. No diretório `backend`, gere o JSON estático:

```bash
cd backend
npm install
npm run export-swagger
```

2. Commit e push dos arquivos gerados em `docs/swagger-ui`.

3. Habilite o GitHub Pages nas configurações do repositório (publishing source: branch `main`, pasta `/docs`).

4. A URL pública típica ficará em: `https://<seu-usuario>.github.io/naregua-app/swagger-ui/` (substitua `<seu-usuario>` pelo seu usuário GitHub).

Observação: rode `npm run export-swagger` sempre que atualizar comentários JSDoc nas rotas para manter a documentação sincronizada.

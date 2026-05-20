# Guia de Documentação da API com Swagger

Este guia explica como documentar os endpoints da API NaReguaApp usando comentários JSDoc.

## Estrutura do Swagger

O arquivo `swagger.js` já contém:
- ✅ Definição OpenAPI 3.0.0
- ✅ Informações gerais da API
- ✅ Servidores (desenvolvimento e produção)
- ✅ Tags para agrupar endpoints
- ✅ Esquemas de componentes (User, Employee, Service, Appointment, BusinessHours)
- ✅ Configuração de segurança JWT

## Como Documentar um Endpoint

Adicione comentários JSDoc acima de cada rota. Exemplo:

```javascript
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar todos os usuários
 *     description: Retorna uma lista paginada de todos os usuários do sistema
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página (padrão: 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Quantidade de registros por página (padrão: 10)
 *     responses:
 *       200:
 *         description: Lista de usuários obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: integer
 *       401:
 *         description: Não autorizado - token inválido ou expirado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/users', authMiddleware, listUsers);
```

## Métodos HTTP

```javascript
/**
 * @swagger
 * /users:
 *   post:     // Para criar (POST)
 *   get:      // Para listar/obter (GET)
 *   put:      // Para atualizar (PUT)
 *   patch:    // Para atualizar parcialmente (PATCH)
 *   delete:   // Para deletar (DELETE)
 */
```

## Parâmetros Comuns

### Query Parameters
```javascript
parameters:
  - in: query
    name: search
    schema:
      type: string
    description: Termo de busca
```

### Path Parameters
```javascript
parameters:
  - in: path
    name: id
    required: true
    schema:
      type: string
    description: ID do recurso
```

### Body (Request)
```javascript
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required:
          - name
          - email
        properties:
          name:
            type: string
            description: Nome do usuário
          email:
            type: string
            format: email
            description: Email do usuário
          phone:
            type: string
            description: Telefone do usuário
```

## Respostas

### Sucesso (200)
```javascript
responses:
  200:
    description: Operação realizada com sucesso
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/User'
```

### Criado (201)
```javascript
responses:
  201:
    description: Recurso criado com sucesso
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/User'
```

### Erro (400, 401, 404, 500)
```javascript
responses:
  400:
    description: Requisição inválida
  401:
    description: Não autorizado
  404:
    description: Recurso não encontrado
  500:
    description: Erro interno do servidor
```

## Exemplo Completo de Documentação

```javascript
/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Criar novo agendamento
 *     description: Cria um novo agendamento para um cliente
 *     tags:
 *       - Agendamentos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - employeeId
 *               - serviceId
 *               - date
 *               - time
 *             properties:
 *               clientId:
 *                 type: string
 *                 description: ID do cliente
 *               employeeId:
 *                 type: string
 *                 description: ID do funcionário
 *               serviceId:
 *                 type: string
 *                 description: ID do serviço
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data do agendamento (YYYY-MM-DD)
 *               time:
 *                 type: string
 *                 description: Hora do agendamento (HH:MM)
 *               notes:
 *                 type: string
 *                 description: Observações adicionais
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       409:
 *         description: Conflito - horário já ocupado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/appointments', authMiddleware, createAppointment);
```

## Tags Disponíveis

Use uma destas tags para agrupar seus endpoints:

- **Autenticação** - login, registro, refresh token
- **Usuários** - gerenciamento de perfis
- **Funcionários** - cadastro e gerenciamento de barbeiros
- **Serviços** - gerenciamento de serviços
- **Agendamentos** - CRUD de agendamentos
- **Horários de Funcionamento** - configuração de horários

## Referências aos Esquemas

Use `$ref` para referenciar esquemas pré-definidos:

```javascript
schema:
  $ref: '#/components/schemas/User'

// Para arrays:
schema:
  type: array
  items:
    $ref: '#/components/schemas/User'
```

## Verificar a Documentação

Acesse a documentação Swagger em:
- Desenvolvimento: `http://localhost:3000/api-docs`
- Produção: `https://naregua-app.vercel.app/api-docs`

## Dicas Importantes

1. **Sempre inclua descrições** - Explique o que cada campo faz
2. **Documente erros possíveis** - Quais status codes podem retornar
3. **Use os esquemas existentes** - Referencie User, Employee, etc
4. **Indentação importa** - O JSDoc é sensível à indentação
5. **Teste a documentação** - Acesse o Swagger UI e verifique se tudo está correto

## Validação de Tipos

Tipos suportados:
- `string` - texto
- `integer` - números inteiros
- `number` - números decimais
- `boolean` - true/false
- `array` - lista de itens
- `object` - objeto com propriedades

Formatos especiais:
- `email` - endereço de email
- `date` - data (YYYY-MM-DD)
- `date-time` - data e hora (ISO 8601)
- `uuid` - identificador único
- `binary` - arquivo binário

## Publicar a documentação no GitHub (GitHub Pages)

Você pode publicar uma versão estática do Swagger UI no GitHub Pages para que a documentação apareça diretamente no GitHub. Passos resumidos:

1. Gere o arquivo `swagger.json` estático (vai para `docs/swagger-ui/swagger.json`):

```bash
cd backend
npm install
npm run export-swagger
```

2. O comando acima cria (ou atualiza) `docs/swagger-ui/swagger.json` no repositório. Commit e faça push dessas mudanças:

```bash
git add docs/swagger-ui/swagger.json
git commit -m "docs: export Swagger JSON for GitHub Pages"
git push
```

3. Habilite o GitHub Pages nas configurações do repositório: escolha publicar a partir da branch `main` (ou `master`) e a pasta `/docs`.

4. Acesse a URL pública (normalmente): `https://<seu-usuario>.github.io/naregua-app/swagger-ui/`

Observações:
- O arquivo estático `swagger.json` é gerado a partir da configuração/JSdoc atual do backend. Rode o `npm run export-swagger` sempre que atualizar os comentários JSDoc nas rotas.
- Você também pode customizar `docs/swagger-ui/index.html` (já incluído no repositório) para ajustar cores, título ou opções do Swagger UI.

Se preferir não colocar o `swagger.json` no repositório, é possível apontar o `index.html` para o `raw.githubusercontent.com` apontando para o `swagger.json` gerado em outra branch ou pipeline, mas isso exige passos adicionais de CI/CD.

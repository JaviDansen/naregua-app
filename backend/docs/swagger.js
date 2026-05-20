/**
 * @fileoverview Configuração da documentação Swagger/OpenAPI para a API NaReguaApp
 * Este arquivo define todos os esquemas, segurança e metadados da API
 */

const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'NaReguaApp API',
      version: '1.0.0',
      description: 'API RESTful completa para gerenciamento de agendamentos em barbearias. Oferece autenticação JWT, gestão de usuários, funcionários, serviços, horários de funcionamento e agendamentos.',
      contact: {
        name: 'Suporte NaReguaApp',
        email: 'suporte@naregua-app.com.br'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },

    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento local'
      },
      {
        url: 'https://naregua-app.vercel.app',
        description: 'Servidor de produção'
      }
    ],

    tags: [
      {
        name: 'Autenticação',
        description: 'Endpoints para autenticação e registro de usuários'
      },
      {
        name: 'Usuários',
        description: 'Gerenciamento de perfis e dados de usuários'
      },
      {
        name: 'Funcionários',
        description: 'Cadastro e gerenciamento de funcionários da barbearia'
      },
      {
        name: 'Serviços',
        description: 'Gerenciamento de serviços oferecidos pela barbearia'
      },
      {
        name: 'Agendamentos',
        description: 'Criação, consulta e gerenciamento de agendamentos'
      },
      {
        name: 'Horários de Funcionamento',
        description: 'Configuração dos horários de operação da barbearia'
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticação. Obtém-se através do endpoint de login.'
        }
      },

      schemas: {
        // Esquema de Usuário
        User: {
          type: 'object',
          required: ['id', 'email', 'name', 'role', 'phone'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único do usuário'
            },
            name: {
              type: 'string',
              description: 'Nome completo do usuário'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único do usuário'
            },
            phone: {
              type: 'string',
              description: 'Número de telefone do usuário'
            },
            role: {
              type: 'string',
              enum: ['admin', 'employee', 'client'],
              description: 'Papel do usuário no sistema'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do usuário'
            }
          }
        },

        // Esquema de Funcionário
        Employee: {
          type: 'object',
          required: ['id', 'name', 'email', 'phone', 'specialties'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único do funcionário'
            },
            name: {
              type: 'string',
              description: 'Nome do funcionário'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do funcionário'
            },
            phone: {
              type: 'string',
              description: 'Telefone do funcionário'
            },
            specialties: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Lista de especialidades/serviços que o funcionário oferece'
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Indica se o funcionário está ativo'
            }
          }
        },

        // Esquema de Serviço
        Service: {
          type: 'object',
          required: ['id', 'name', 'duration', 'price'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único do serviço'
            },
            name: {
              type: 'string',
              description: 'Nome do serviço'
            },
            description: {
              type: 'string',
              description: 'Descrição detalhada do serviço'
            },
            duration: {
              type: 'integer',
              description: 'Duração do serviço em minutos'
            },
            price: {
              type: 'number',
              format: 'double',
              description: 'Preço do serviço em reais'
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Indica se o serviço está disponível'
            }
          }
        },

        // Esquema de Agendamento
        Appointment: {
          type: 'object',
          required: ['id', 'clientId', 'employeeId', 'serviceId', 'date', 'time', 'status'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único do agendamento'
            },
            clientId: {
              type: 'string',
              description: 'ID do cliente'
            },
            employeeId: {
              type: 'string',
              description: 'ID do funcionário responsável'
            },
            serviceId: {
              type: 'string',
              description: 'ID do serviço contratado'
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Data do agendamento (YYYY-MM-DD)'
            },
            time: {
              type: 'string',
              pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
              description: 'Hora do agendamento (HH:MM)'
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'cancelled', 'completed'],
              description: 'Status do agendamento'
            },
            notes: {
              type: 'string',
              description: 'Notas ou observações adicionais'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do agendamento'
            }
          }
        },

        // Esquema de Horários de Funcionamento
        BusinessHours: {
          type: 'object',
          required: ['dayOfWeek', 'opening', 'closing'],
          properties: {
            dayOfWeek: {
              type: 'integer',
              minimum: 0,
              maximum: 6,
              description: 'Dia da semana (0=domingo, 6=sábado)'
            },
            opening: {
              type: 'string',
              pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
              description: 'Hora de abertura (HH:MM)'
            },
            closing: {
              type: 'string',
              pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
              description: 'Hora de fechamento (HH:MM)'
            },
            isClosed: {
              type: 'boolean',
              default: false,
              description: 'Indica se a barbearia está fechada neste dia'
            }
          }
        },

        // Esquema de Erro
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro'
            },
            code: {
              type: 'string',
              description: 'Código de erro'
            },
            details: {
              type: 'object',
              description: 'Detalhes adicionais do erro'
            }
          }
        }
      }
    },

    security: [
      {
        bearerAuth: []
      }
    ]
  },

  // Padrão para encontrar comentários JSDoc nos arquivos de rota
  apis: [path.join(__dirname, '../routes/*.js')]
};

/**
 * Gera a especificação Swagger baseada nas configurações e comentários JSDoc
 * @type {Object}
 */
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
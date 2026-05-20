CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,

    nome VARCHAR(100),

    email CITEXT UNIQUE,

    perfil VARCHAR(50) NOT NULL DEFAULT 'usuario',
    senha TEXT,
    telefone VARCHAR(20)
);

CREATE TABLE servicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    duracao INT NOT NULL
);

CREATE TABLE business_hours (
    id SERIAL PRIMARY KEY,
    day_of_week INT NOT NULL UNIQUE,
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT business_hours_day_of_week_check
    CHECK (day_of_week >= 0 AND day_of_week <= 6)
);

CREATE TABLE funcionarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especialidade VARCHAR(100),
    telefone VARCHAR(20),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    servico_id INT NOT NULL,
    funcionario_id INT NOT NULL,
    data_hora TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'agendado',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT agendamentos_status_check
    CHECK (status IN ('agendado', 'cancelado', 'concluido', 'faltou')),

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (servico_id) REFERENCES servicos(id),
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

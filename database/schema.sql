CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,

    email VARCHAR(100) NOT NULL,
    email_normalizado VARCHAR(100) GENERATED ALWAYS AS (LOWER(TRIM(email))) STORED,

    perfil VARCHAR(50) NOT NULL DEFAULT 'usuario',
    senha TEXT NOT NULL,
    telefone VARCHAR(20),

    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT usuarios_email_normalizado_unique
    UNIQUE (email_normalizado),

    CONSTRAINT usuarios_perfil_check
    CHECK (perfil IN ('usuario', 'admin')),

    CONSTRAINT usuarios_email_formato_check
    CHECK (
        email = TRIM(email)
        AND email <> ''
        AND email LIKE '%@%'
    ),

    CONSTRAINT usuarios_telefone_obrigatorio_check
    CHECK (
        perfil = 'admin'
        OR (
            perfil = 'usuario'
            AND telefone IS NOT NULL
            AND TRIM(telefone) <> ''
        )
    )
);

CREATE TABLE servicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    duracao INT NOT NULL
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
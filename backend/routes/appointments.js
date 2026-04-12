const express = require('express');
const router = express.Router();

const pool = require('../db');
const auth = require('../middlewares/auth');

function getDayOfWeekAndTimeInSaoPaulo(dataHora) {
  const data = new Date(dataHora);

  const formatterDia = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short'
  });

  const formatterHora = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const diaTexto = formatterDia.format(data);
  const horario = formatterHora.format(data);

  const mapaDias = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6
  };

  return {
    day_of_week: mapaDias[diaTexto],
    horario
  };
}

// Criar agendamento
router.post('/appointments', auth, async (req, res) => {
  const { servico_id, funcionario_id, data_hora } = req.body;
  const usuario_id = req.usuario.id;

  try {
    if (servico_id == null || funcionario_id == null || !data_hora) {
      return res.status(400).json({
        erro: 'servico_id, funcionario_id e data_hora são obrigatórios'
      });
    }

    if (isNaN(Date.parse(data_hora))) {
      return res.status(400).json({
        erro: 'data_hora inválida'
      });
    }

    if (new Date(data_hora) < new Date()) {
      return res.status(400).json({
        erro: 'Não é possível criar agendamento em data/hora passada'
      });
    }

    const { day_of_week, horario } = getDayOfWeekAndTimeInSaoPaulo(data_hora);

    const regraFuncionamento = await pool.query(
      `SELECT day_of_week, open_time, close_time, is_closed
       FROM business_hours
       WHERE day_of_week = $1`,
      [day_of_week]
    );

    if (regraFuncionamento.rows.length === 0) {
      return res.status(500).json({
        erro: 'Regra de funcionamento não cadastrada para esse dia'
      });
    }

    const regraDia = regraFuncionamento.rows[0];

    if (regraDia.is_closed) {
      return res.status(400).json({
        erro: 'Não é possível agendar em um dia em que a barbearia está fechada'
      });
    }

    const openTime = regraDia.open_time.slice(0, 5);
    const closeTime = regraDia.close_time.slice(0, 5);

    if (horario < openTime || horario >= closeTime) {
      return res.status(400).json({
        erro: 'Horário fora do funcionamento da barbearia'
      });
    }

    const usuarioExiste = await pool.query(
      `SELECT id FROM usuarios WHERE id = $1`,
      [usuario_id]
    );

    if (usuarioExiste.rows.length === 0) {
      return res.status(404).json({
        erro: 'Usuário não encontrado'
      });
    }

    const servicoExiste = await pool.query(
      `SELECT id FROM servicos WHERE id = $1`,
      [servico_id]
    );

    if (servicoExiste.rows.length === 0) {
      return res.status(404).json({
        erro: 'Serviço não encontrado'
      });
    }

    const funcionarioExiste = await pool.query(
      `SELECT id FROM funcionarios WHERE id = $1`,
      [funcionario_id]
    );

    if (funcionarioExiste.rows.length === 0) {
      return res.status(404).json({
        erro: 'Funcionário não encontrado'
      });
    }

    const conflitoHorario = await pool.query(
      `SELECT id
       FROM agendamentos
       WHERE funcionario_id = $1
         AND data_hora = $2
         AND status != 'cancelado'`,
      [funcionario_id, data_hora]
    );

    if (conflitoHorario.rows.length > 0) {
      return res.status(409).json({
        erro: 'Já existe um agendamento para esse funcionário nesse horário'
      });
    }

    const result = await pool.query(
      `INSERT INTO agendamentos (usuario_id, servico_id, funcionario_id, data_hora)
       VALUES ($1, $2, $3, $4)
       RETURNING
         id,
         usuario_id,
         servico_id,
         funcionario_id,
         TO_CHAR(
           data_hora AT TIME ZONE 'America/Sao_Paulo',
           'DD/MM/YYYY HH24:MI'
         ) AS data_hora,
         status,
         TO_CHAR(
           criado_em AT TIME ZONE 'America/Sao_Paulo',
           'DD/MM/YYYY HH24:MI'
         ) AS criado_em`,
      [usuario_id, servico_id, funcionario_id, data_hora]
    );

    return res.status(201).json({
      mensagem: 'Agendamento criado com sucesso',
      dados: result.rows[0]
    });
  } catch (error) {
    console.error('Erro no POST /appointments:', error.message);
    return res.status(500).json({
      erro: 'Erro ao criar agendamento'
    });
  }
});

// Listar agendamentos
router.get('/appointments', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id,
        u.nome AS usuario,
        s.nome AS servico,
        f.nome AS funcionario,
        TO_CHAR(
          a.data_hora AT TIME ZONE 'America/Sao_Paulo',
          'DD/MM/YYYY HH24:MI'
        ) AS data_hora,
        a.status,
        TO_CHAR(
          a.criado_em AT TIME ZONE 'America/Sao_Paulo',
          'DD/MM/YYYY HH24:MI'
        ) AS criado_em
      FROM agendamentos a
      INNER JOIN usuarios u ON a.usuario_id = u.id
      INNER JOIN servicos s ON a.servico_id = s.id
      INNER JOIN funcionarios f ON a.funcionario_id = f.id
      ORDER BY a.data_hora ASC
    `);

    return res.status(200).json({
      dados: result.rows
    });
  } catch (error) {
    console.error('Erro no GET /appointments:', error.message);
    return res.status(500).json({
      erro: 'Erro ao buscar agendamentos'
    });
  }
});

// Cancelar agendamento
router.put('/appointments/:id/cancel', auth, async (req, res) => {
  const { id } = req.params;

  try {
    if (isNaN(Number(id))) {
      return res.status(400).json({
        erro: 'ID inválido'
      });
    }

    const agendamentoExistente = await pool.query(
      `SELECT id, status
       FROM agendamentos
       WHERE id = $1`,
      [id]
    );

    if (agendamentoExistente.rows.length === 0) {
      return res.status(404).json({
        erro: 'Agendamento não encontrado'
      });
    }

    if (agendamentoExistente.rows[0].status === 'cancelado') {
      return res.status(400).json({
        erro: 'Esse agendamento já está cancelado'
      });
    }

    const result = await pool.query(
      `UPDATE agendamentos
       SET status = 'cancelado'
       WHERE id = $1
       RETURNING
         id,
         status,
         TO_CHAR(
           data_hora AT TIME ZONE 'America/Sao_Paulo',
           'DD/MM/YYYY HH24:MI'
         ) AS data_hora,
         TO_CHAR(
           criado_em AT TIME ZONE 'America/Sao_Paulo',
           'DD/MM/YYYY HH24:MI'
         ) AS criado_em`,
      [id]
    );

    return res.status(200).json({
      mensagem: 'Agendamento cancelado com sucesso',
      dados: result.rows[0]
    });
  } catch (error) {
    console.error('Erro no PUT /appointments/:id/cancel:', error.message);
    return res.status(500).json({
      erro: 'Erro ao cancelar agendamento'
    });
  }
});

// Editar agendamento
router.put('/appointments/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { servico_id, funcionario_id, data_hora } = req.body;
  const usuario_id = req.usuario.id;

  try {
    if (!usuario_id || !servico_id || !funcionario_id || !data_hora) {
      return res.status(400).json({
        erro: 'servico_id, funcionario_id e data_hora são obrigatórios'
      });
    }

    if (isNaN(Number(id))) {
      return res.status(400).json({
        erro: 'ID inválido'
      });
    }

    if (isNaN(Date.parse(data_hora))) {
      return res.status(400).json({
        erro: 'data_hora inválida'
      });
    }

    if (new Date(data_hora) < new Date()) {
      return res.status(400).json({
        erro: 'Não é possível editar agendamento para data/hora passada'
      });
    }

    const { day_of_week, horario } = getDayOfWeekAndTimeInSaoPaulo(data_hora);

    const regraFuncionamento = await pool.query(
      `SELECT day_of_week, open_time, close_time, is_closed
       FROM business_hours
       WHERE day_of_week = $1`,
      [day_of_week]
    );

    if (regraFuncionamento.rows.length === 0) {
      return res.status(500).json({
        erro: 'Regra de funcionamento não cadastrada para esse dia'
      });
    }

    const regraDia = regraFuncionamento.rows[0];

    if (regraDia.is_closed) {
      return res.status(400).json({
        erro: 'Não é possível agendar em um dia em que a barbearia está fechada'
      });
    }

    const openTime = regraDia.open_time.slice(0, 5);
    const closeTime = regraDia.close_time.slice(0, 5);

    if (horario < openTime || horario >= closeTime) {
      return res.status(400).json({
        erro: 'Horário fora do funcionamento da barbearia'
      });
    }

    const agendamentoExistente = await pool.query(
      `SELECT id, status
       FROM agendamentos
       WHERE id = $1`,
      [id]
    );

    if (agendamentoExistente.rows.length === 0) {
      return res.status(404).json({
        erro: 'Agendamento não encontrado'
      });
    }

    if (agendamentoExistente.rows[0].status === 'cancelado') {
      return res.status(400).json({
        erro: 'Não é possível editar um agendamento cancelado'
      });
    }

    const usuarioExiste = await pool.query(
      `SELECT id FROM usuarios WHERE id = $1`,
      [usuario_id]
    );

    if (usuarioExiste.rows.length === 0) {
      return res.status(404).json({
        erro: 'Usuário não encontrado'
      });
    }

    const servicoExiste = await pool.query(
      `SELECT id FROM servicos WHERE id = $1`,
      [servico_id]
    );

    if (servicoExiste.rows.length === 0) {
      return res.status(404).json({
        erro: 'Serviço não encontrado'
      });
    }

    const funcionarioExiste = await pool.query(
      `SELECT id FROM funcionarios WHERE id = $1`,
      [funcionario_id]
    );

    if (funcionarioExiste.rows.length === 0) {
      return res.status(404).json({
        erro: 'Funcionário não encontrado'
      });
    }

    const conflitoHorario = await pool.query(
      `SELECT id
       FROM agendamentos
       WHERE funcionario_id = $1
         AND data_hora = $2
         AND status != 'cancelado'
         AND id != $3`,
      [funcionario_id, data_hora, id]
    );

    if (conflitoHorario.rows.length > 0) {
      return res.status(409).json({
        erro: 'Já existe um agendamento para esse funcionário nesse horário'
      });
    }

    const result = await pool.query(
      `UPDATE agendamentos
       SET usuario_id = $1,
           servico_id = $2,
           funcionario_id = $3,
           data_hora = $4
       WHERE id = $5
       RETURNING
         id,
         usuario_id,
         servico_id,
         funcionario_id,
         TO_CHAR(
           data_hora AT TIME ZONE 'America/Sao_Paulo',
           'DD/MM/YYYY HH24:MI'
         ) AS data_hora,
         status,
         TO_CHAR(
           criado_em AT TIME ZONE 'America/Sao_Paulo',
           'DD/MM/YYYY HH24:MI'
         ) AS criado_em`,
      [usuario_id, servico_id, funcionario_id, data_hora, id]
    );

    return res.status(200).json({
      mensagem: 'Agendamento atualizado com sucesso',
      dados: result.rows[0]
    });
  } catch (error) {
    console.error('Erro no PUT /appointments/:id:', error.message);
    return res.status(500).json({
      erro: 'Erro ao atualizar agendamento'
    });
  }
});

// Meus agendamentos
router.get('/my-appointments', auth, async (req, res) => {
  const usuario_id = req.usuario.id;

  try {
    const result = await pool.query(
      `SELECT
         a.id,
         s.nome AS servico,
         f.nome AS funcionario,
         TO_CHAR(
           a.data_hora AT TIME ZONE 'America/Sao_Paulo',
           'DD/MM/YYYY HH24:MI'
         ) AS data_hora,
         a.status
       FROM agendamentos a
       INNER JOIN servicos s ON a.servico_id = s.id
       INNER JOIN funcionarios f ON a.funcionario_id = f.id
       WHERE a.usuario_id = $1
       ORDER BY a.data_hora ASC`,
      [usuario_id]
    );

    return res.status(200).json({
      dados: result.rows
    });
  } catch (error) {
    console.error('Erro no GET /my-appointments:', error.message);
    return res.status(500).json({
      erro: 'Erro ao buscar seus agendamentos'
    });
  }
});

// Disponibilidade Funcionário + Data
router.get('/availability', auth, async (req, res) => {
  const { funcionario_id, data } = req.query;

  try {
    if (!funcionario_id || !data) {
      return res.status(400).json({
        erro: 'funcionario_id e data são obrigatórios'
      });
    }

    if (isNaN(Number(funcionario_id))) {
      return res.status(400).json({
        erro: 'funcionario_id inválido'
      });
    }

    if (isNaN(Date.parse(data))) {
      return res.status(400).json({
        erro: 'data inválida'
      });
    }

    const funcionarioExiste = await pool.query(
      `SELECT id FROM funcionarios WHERE id = $1`,
      [funcionario_id]
    );

    if (funcionarioExiste.rows.length === 0) {
      return res.status(404).json({
        erro: 'Funcionário não encontrado'
      });
    }

    const result = await pool.query(
      `SELECT
         TO_CHAR(
           data_hora AT TIME ZONE 'America/Sao_Paulo',
           'HH24:MI'
         ) AS horario
       FROM agendamentos
       WHERE funcionario_id = $1
         AND DATE(data_hora AT TIME ZONE 'America/Sao_Paulo') = $2
         AND status != 'cancelado'
       ORDER BY data_hora ASC`,
      [funcionario_id, data]
    );

    const horarios_ocupados = result.rows.map((item) => item.horario);

    return res.status(200).json({
      dados: {
        funcionario_id: Number(funcionario_id),
        data,
        horarios_ocupados
      }
    });
  } catch (error) {
    console.error('Erro no GET /availability:', error.message);
    return res.status(500).json({
      erro: 'Erro ao buscar disponibilidade'
    });
  }
});

module.exports = router;
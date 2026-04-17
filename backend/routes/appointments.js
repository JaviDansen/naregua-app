const express = require('express');
const router = express.Router();

const pool = require('../db');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');

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
      `SELECT id, duracao FROM servicos WHERE id = $1`,
      [servico_id]
    );

    if (servicoExiste.rows.length === 0) {
      return res.status(404).json({
        erro: 'Serviço não encontrado'
      });
    }

    const duracaoNovoServico = Number(servicoExiste.rows[0].duracao);

    if (isNaN(duracaoNovoServico) || duracaoNovoServico <= 0) {
      return res.status(400).json({
        erro: 'Duração do serviço inválida'
      });
    }

    const inicioNovoAgendamento = new Date(data_hora);
    const fimNovoAgendamento = new Date(inicioNovoAgendamento);
    fimNovoAgendamento.setMinutes(
      fimNovoAgendamento.getMinutes() + duracaoNovoServico
    );

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
      `SELECT a.id
       FROM agendamentos a
       INNER JOIN servicos s ON a.servico_id = s.id
       WHERE a.funcionario_id = $1
         AND a.status != 'cancelado'
         AND $2::timestamp < (a.data_hora + (s.duracao || ' minutes')::interval)
         AND $3::timestamp > a.data_hora`,
      [funcionario_id, data_hora, fimNovoAgendamento.toISOString()]
    );

    if (conflitoHorario.rows.length > 0) {
      return res.status(409).json({
        erro: 'Já existe um agendamento para esse funcionário nesse intervalo de horário'
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
      `SELECT id, duracao FROM servicos WHERE id = $1`,
      [servico_id]
    );

    if (servicoExiste.rows.length === 0) {
      return res.status(404).json({
        erro: 'Serviço não encontrado'
      });
    }

    const duracaoNovoServico = Number(servicoExiste.rows[0].duracao);

    if (isNaN(duracaoNovoServico) || duracaoNovoServico <= 0) {
      return res.status(400).json({
        erro: 'Duração do serviço inválida'
      });
    }

    const inicioNovoAgendamento = new Date(data_hora);
    const fimNovoAgendamento = new Date(inicioNovoAgendamento);
    fimNovoAgendamento.setMinutes(
      fimNovoAgendamento.getMinutes() + duracaoNovoServico
    );

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
      `SELECT a.id
       FROM agendamentos a
       INNER JOIN servicos s ON a.servico_id = s.id
       WHERE a.funcionario_id = $1
         AND a.status != 'cancelado'
         AND a.id != $4
         AND $2::timestamp < (a.data_hora + (s.duracao || ' minutes')::interval)
         AND $3::timestamp > a.data_hora`,
      [funcionario_id, data_hora, fimNovoAgendamento.toISOString(), id]
    );

    if (conflitoHorario.rows.length > 0) {
      return res.status(409).json({
        erro: 'Já existe um agendamento para esse funcionário nesse intervalo de horário'
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
         a.servico_id,
         a.funcionario_id,
         s.nome AS servico,
         f.nome AS funcionario,
         TO_CHAR(
           a.data_hora AT TIME ZONE 'America/Sao_Paulo',
           'DD/MM/YYYY HH24:MI'
         ) AS data_hora,
         a.status,
         a.data_hora AS data_hora_iso
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

// Disponibilidade Funcionário + Data + Serviço
router.get('/availability', auth, async (req, res) => {
  const { funcionario_id, data, servico_id } = req.query;
  const intervalo_base_minutos = 20;

  try {
    if (!funcionario_id || !data || !servico_id) {
      return res.status(400).json({
        erro: 'funcionario_id, data e servico_id são obrigatórios'
      });
    }

    if (isNaN(Number(funcionario_id))) {
      return res.status(400).json({
        erro: 'funcionario_id inválido'
      });
    }

    if (isNaN(Number(servico_id))) {
      return res.status(400).json({
        erro: 'servico_id inválido'
      });
    }

    const formatoDataValido = /^\d{4}-\d{2}-\d{2}$/;

    if (!formatoDataValido.test(data)) {
      return res.status(400).json({
        erro: 'data deve estar no formato YYYY-MM-DD'
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

    const servicoExiste = await pool.query(
      `SELECT id, duracao
       FROM servicos
       WHERE id = $1`,
      [servico_id]
    );

    if (servicoExiste.rows.length === 0) {
      return res.status(404).json({
        erro: 'Serviço não encontrado'
      });
    }

    const duracaoServico = Number(servicoExiste.rows[0].duracao);

    if (isNaN(duracaoServico) || duracaoServico <= 0) {
      return res.status(400).json({
        erro: 'Duração do serviço inválida'
      });
    }

    const [ano, mes, dia] = data.split('-').map(Number);
    const dataLocal = new Date(ano, mes - 1, dia);

    const day_of_week = dataLocal.getDay();

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

    const openTime = regraDia.open_time
      ? regraDia.open_time.slice(0, 5)
      : null;

    const closeTime = regraDia.close_time
      ? regraDia.close_time.slice(0, 5)
      : null;

    const result = await pool.query(
      `SELECT
         TO_CHAR(
           a.data_hora AT TIME ZONE 'America/Sao_Paulo',
           'HH24:MI'
         ) AS inicio,
         TO_CHAR(
           (a.data_hora + (s.duracao || ' minutes')::interval) AT TIME ZONE 'America/Sao_Paulo',
           'HH24:MI'
         ) AS fim,
         s.duracao
       FROM agendamentos a
       INNER JOIN servicos s ON a.servico_id = s.id
       WHERE a.funcionario_id = $1
         AND DATE(a.data_hora AT TIME ZONE 'America/Sao_Paulo') = $2
         AND a.status != 'cancelado'
       ORDER BY a.data_hora ASC`,
      [funcionario_id, data]
    );

    const agendamentos_ocupados = result.rows.map((item) => ({
      inicio: item.inicio,
      fim: item.fim,
      duracao: Number(item.duracao)
    }));

    return res.status(200).json({
      dados: {
        funcionario_id: Number(funcionario_id),
        data,
        servico_id: Number(servico_id),
        intervalo_base_minutos,
        duracao_servico: duracaoServico,
        horario_funcionamento: {
          inicio: openTime,
          fim: closeTime,
          fechado: regraDia.is_closed
        },
        agendamentos_ocupados
      }
    });
  } catch (error) {
    console.error('Erro no GET /availability:', error.message);
    return res.status(500).json({
      erro: 'Erro ao buscar disponibilidade'
    });
  }
});

// Deletar agendamento (hard delete - apenas admin)
router.delete(
  '/appointments/:id',
  auth,
  authorize('admin', 'Acesso negado. Apenas administradores podem deletar agendamentos.'),
  async (req, res) => {
    const { id } = req.params;

    try {
      if (isNaN(Number(id))) {
        return res.status(400).json({
          erro: 'ID do agendamento inválido. Informe um identificador numérico válido.'
        });
      }

      const agendamentoExistente = await pool.query(
        `SELECT id
         FROM agendamentos
         WHERE id = $1`,
        [id]
      );

      if (agendamentoExistente.rows.length === 0) {
        return res.status(404).json({
          erro: 'Agendamento não encontrado para o ID informado.'
        });
      }

      const result = await pool.query(
        `DELETE FROM agendamentos
         WHERE id = $1
         RETURNING id`,
        [id]
      );

      return res.status(200).json({
        mensagem: 'Agendamento deletado com sucesso.',
        dados: result.rows[0]
      });
    } catch (error) {
      console.error('Erro no DELETE /appointments/:id:', error.message);
      return res.status(500).json({
        erro: 'Erro ao deletar agendamento. Tente novamente.'
      });
    }
  }
);

module.exports = router;
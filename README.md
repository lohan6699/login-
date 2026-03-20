<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Cadastro de Clientes</title>
  
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      min-height: 100vh;
      padding: 20px;
      color: #1f2937;
    }
    .container {
      background: white;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.18);
      overflow: hidden;
    }
    .tabs {
      display: flex;
      background: #f3f4f6;
      border-bottom: 1px solid #e5e7eb;
    }
    .tab {
      flex: 1;
      padding: 16px;
      text-align: center;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      color: #4b5563;
    }
    .tab.active {
      background: white;
      color: #4f46e5;
      border-bottom: 3px solid #4f46e5;
    }
    .tab-content {
      padding: 28px;
      min-height: 420px;
    }
    .tab-content.hidden { display: none; }

    /* Form styles */
    .form-group { margin-bottom: 24px; }
    label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 0.95rem; color: #374151; }
    input, select {
      width: 100%; padding: 14px 16px; border: 1px solid #d1d5db; border-radius: 10px;
      font-size: 1rem; transition: all 0.2s;
    }
    input:focus, select:focus {
      outline: none; border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
    }
    .error { color: #dc2626; font-size: 0.84rem; margin-top: 6px; min-height: 1.2em; }
    button {
      width: 100%; padding: 16px; background: #4f46e5; color: white; border: none;
      border-radius: 10px; font-size: 1.1rem; font-weight: 600; cursor: pointer; margin-top: 16px;
      transition: all 0.25s;
    }
    button:hover:not(:disabled) { background: #4338ca; transform: translateY(-2px); }
    button:disabled { background: #9ca3af; cursor: not-allowed; }

    .success-msg, .error-msg {
      padding: 16px; margin: 20px 0; border-radius: 10px; text-align: center; font-weight: 500;
    }
    .success-msg { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
    .error-msg   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    @media (max-width: 520px) { .row { grid-template-columns: 1fr; gap: 24px; } }

    /* Lista de clientes */
    .client-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .client-list { display: flex; flex-direction: column; gap: 16px; }
    .client-card {
      background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px;
      padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      position: relative;
    }
    .client-card h3 { margin: 0 0 12px; color: #1f2937; font-size: 1.15rem; }
    .client-info { font-size: 0.95rem; color: #4b5563; line-height: 1.6; }
    .client-info strong { color: #374151; }
    .delete-btn {
      position: absolute; top: 16px; right: 16px;
      background: #ef4444; color: white; border: none;
      border-radius: 6px; padding: 6px 12px; font-size: 0.85rem;
      cursor: pointer; transition: background 0.2s;
    }
    .delete-btn:hover { background: #dc2626; }
    .no-clients { text-align: center; color: #6b7280; padding: 80px 20px; font-size: 1.1rem; }
  </style>
</head>
<body>

  <div class="container">
    <div class="tabs">
      <div class="tab active" data-tab="cadastro">Novo Cadastro</div>
      <div class="tab" data-tab="lista">Clientes Cadastrados</div>
    </div>

    <div class="tab-content" id="cadastro">
      <form id="cadastro-form" novalidate>
        <!-- Campos do formulário (mantidos iguais à versão anterior) -->
        <div class="form-group">
          <label for="nome">Nome completo *</label>
          <input type="text" id="nome" required minlength="3" placeholder="Ex: João Silva Santos">
          <span class="error" id="erro-nome"></span>
        </div>

        <div class="row">
          <div class="form-group">
            <label for="cpf">CPF *</label>
            <input type="text" id="cpf" required placeholder="000.000.000-00" maxlength="14" inputmode="numeric">
            <span class="error" id="erro-cpf"></span>
          </div>
          <div class="form-group">
            <label for="nascimento">Data de nascimento *</label>
            <input type="date" id="nascimento" required>
            <span class="error" id="erro-nascimento"></span>
          </div>
        </div>

        <div class="form-group">
          <label for="email">E-mail *</label>
          <input type="email" id="email" required placeholder="seuemail@exemplo.com">
          <span class="error" id="erro-email"></span>
        </div>

        <div class="row">
          <div class="form-group">
            <label for="telefone">Telefone/WhatsApp *</label>
            <input type="tel" id="telefone" required placeholder="(41) 99999-9999" maxlength="15" inputmode="numeric">
            <span class="error" id="erro-telefone"></span>
          </div>
          <div class="form-group">
            <label>Gênero</label>
            <div style="display:flex; gap:24px; margin-top:10px; flex-wrap:wrap;">
              <label><input type="radio" name="genero" value="M"> Masculino</label>
              <label><input type="radio" name="genero" value="F"> Feminino</label>
              <label><input type="radio" name="genero" value="O"> Outro</label>
              <label><input type="radio" name="genero" value="N" checked> Prefiro não informar</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="estado">Estado</label>
          <select id="estado">
            <option value="">Selecione...</option>
            <option value="PR" selected>Paraná</option>
            <!-- Adicione outros estados se quiser -->
          </select>
        </div>

        <div class="form-group">
          <label style="display:flex; align-items:flex-start; gap:12px; font-size:0.92rem;">
            <input type="checkbox" id="lgpd" required>
            <span>Concordo com a <a href="#" style="color:#4f46e5;">Política de Privacidade</a> e LGPD.</span>
          </label>
          <span class="error" id="erro-lgpd"></span>
        </div>

        <div id="mensagem" style="display:none;"></div>
        <button type="submit" id="btn-submit" disabled>Cadastrar Cliente</button>
      </form>
    </div>

    <div class="tab-content hidden" id="lista">
      <div class="client-header">
        <h2 style="color:#4f46e5; margin:0;">Clientes Cadastrados</h2>
        <span id="contador" style="color:#6b7280; font-weight:500;">0 clientes</span>
      </div>
      <div id="client-list" class="client-list"></div>
    </div>

    <div style="text-align:center; padding:16px; color:#6b7280; font-size:0.9rem; border-top:1px solid #f3f4f6; background:#f9fafb;">
      Sistema de Cadastro • © 2026
    </div>
  </div>

  <script>
    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        document.getElementById(tab.dataset.tab).classList.remove('hidden');
        if (tab.dataset.tab === 'lista') renderizarClientes();
      });
    });

    // Máscaras
    function mascaraCPF(el) {
      let v = el.value.replace(/\D/g,'');
      v = v.replace(/(\d{3})(\d)/,'$1.$2');
      v = v.replace(/(\d{3})(\d)/,'$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/,'$1-$2');
      el.value = v.slice(0,14);
    }

    function mascaraTelefone(el) {
      let v = el.value.replace(/\D/g,'');
      if (v.length <= 10) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      else v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      el.value = v.slice(0,15);
    }

    document.getElementById('cpf').addEventListener('input', e => mascaraCPF(e.target));
    document.getElementById('telefone').addEventListener('input', e => mascaraTelefone(e.target));

    // Validações (resumida - pode expandir como antes)
    function validarFormulario(mostrar = false) {
      let valido = true;
      const campos = [
        {id: 'nome',      check: v => v.trim().length >= 3,      msg: 'Nome muito curto'},
        {id: 'cpf',       check: v => validarCPF(v),             msg: 'CPF inválido'},
        {id: 'nascimento',check: v => idadeMinima(v),            msg: 'Idade mínima 16 anos'},
        {id: 'email',     check: v => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(v), msg: 'E-mail inválido'},
        {id: 'telefone',  check: v => {
          const limpo = v.replace(/\D/g,''); return limpo.length >= 10 && limpo.length <= 11;
        }, msg: 'Telefone inválido'},
        {id: 'lgpd',      check: el => el.checked,               msg: 'Aceite a política'}
      ];

      campos.forEach(c => {
        const el = document.getElementById(c.id);
        const erro = document.getElementById(`erro-${c.id}`);
        const valor = c.id === 'lgpd' ? el : el.value;
        const ok = typeof c.check === 'function' ? c.check(valor) : c.check(el);
        if (mostrar) erro.textContent = ok ? '' : c.msg;
        else erro.textContent = '';
        if (!ok) valido = false;
      });

      document.getElementById('btn-submit').disabled = !valido;
      return valido;
    }

    function validarCPF(cpf) {
      cpf = cpf.replace(/\D/g,'');
      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
      let s = 0;
      for (let i = 0; i < 9; i++) s += parseInt(cpf[i]) * (10 - i);
      let r = (s * 10) % 11; if (r === 10 || r === 11) r = 0;
      if (r !== parseInt(cpf[9])) return false;
      s = 0;
      for (let i = 0; i < 10; i++) s += parseInt(cpf[i]) * (11 - i);
      r = (s * 10) % 11; if (r === 10 || r === 11) r = 0;
      return r === parseInt(cpf[10]);
    }

    function idadeMinima(data) {
      if (!data) return false;
      const hoje = new Date();
      const nasc = new Date(data);
      let idade = hoje.getFullYear() - nasc.getFullYear();
      const m = hoje.getMonth() - nasc.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
      return idade >= 16;
    }

    ['input','change','blur'].forEach(e => document.getElementById('cadastro-form').addEventListener(e, () => validarFormulario(), true));

    // Limite data nascimento
    const hoje = new Date();
    const max = new Date(hoje.getFullYear()-16, hoje.getMonth(), hoje.getDate()-1).toISOString().split('T')[0];
    document.getElementById('nascimento').max = max;

    // Cadastro
    document.getElementById('cadastro-form').addEventListener('submit', e => {
      e.preventDefault();
      if (!validarFormulario(true)) {
        document.getElementById('mensagem').textContent = 'Corrija os erros destacados.';
        document.getElementById('mensagem').className = 'error-msg';
        document.getElementById('mensagem').style.display = 'block';
        setTimeout(() => document.getElementById('mensagem').style.display = 'none', 5000);
        return;
      }

      const cliente = {
        nome: document.getElementById('nome').value.trim(),
        cpf: document.getElementById('cpf').value,
        nascimento: document.getElementById('nascimento').value,
        email: document.getElementById('email').value.trim(),
        telefone: document.getElementById('telefone').value,
        genero: document.querySelector('input[name="genero"]:checked')?.value || 'N',
        estado: document.getElementById('estado').value || 'Não informado',
        data: new Date().toLocaleString('pt-BR')
      };

      let clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      clientes.push(cliente);
      localStorage.setItem('clientes', JSON.stringify(clientes));

      document.getElementById('mensagem').textContent = 'Cliente cadastrado com sucesso!';
      document.getElementById('mensagem').className = 'success-msg';
      document.getElementById('mensagem').style.display = 'block';
      setTimeout(() => document.getElementById('mensagem').style.display = 'none', 5000);

      document.getElementById('cadastro-form').reset();
      validarFormulario();
    });

    // Renderizar lista + excluir
    function renderizarClientes() {
      const container = document.getElementById('client-list');
      const contador = document.getElementById('contador');
      let clientes = JSON.parse(localStorage.getItem('clientes') || '[]');

      contador.textContent = `${clientes.length} cliente${clientes.length !== 1 ? 's' : ''}`;

      if (clientes.length === 0) {
        container.innerHTML = '<div class="no-clients">Nenhum cliente cadastrado ainda.</div>';
        return;
      }

      container.innerHTML = clientes.map((c, index) => `
        <div class="client-card">
          <button class="delete-btn" onclick="excluirCliente(${index})">Excluir</button>
          <h3>${c.nome}</h3>
          <div class="client-info">
            <strong>CPF:</strong> ${c.cpf}<br>
            <strong>Nascimento:</strong> ${c.nascimento ? new Date(c.nascimento).toLocaleDateString('pt-BR') : '—'}<br>
            <strong>E-mail:</strong> ${c.email}<br>
            <strong>Telefone:</strong> ${c.telefone}<br>
            <strong>Gênero:</strong> ${c.genero === 'M' ? 'Masculino' : c.genero === 'F' ? 'Feminino' : c.genero === 'O' ? 'Outro' : 'Não informado'}<br>
            <strong>Estado:</strong> ${c.estado}<br>
            <strong>Cadastrado em:</strong> ${c.data}
          </div>
        </div>
      `).join('');
    }

    function excluirCliente(index) {
      if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
      let clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      clientes.splice(index, 1);
      localStorage.setItem('clientes', JSON.stringify(clientes));
      renderizarClientes();
    }
  </script>

</body>
</html>
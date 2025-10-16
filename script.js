
/**
 * Função principal para verificar infrações RP
 */
function verificar() {
    // Obter e limpar o texto de entrada
    const textoEntrada = document.getElementById('entrada').value.trim().toLowerCase();

    // Verificar se há texto para analisar
    if (!textoEntrada) {
        document.getElementById('resultado').innerHTML = `
            <div class="nenhum">
                ℹ️ Por favor, digite uma descrição da infração para verificar.
            </div>
        `;
        document.getElementById('estatisticas').style.display = 'none';
        return;
    }

    // Inicializar variáveis para resultados
    let infracoesEncontradas = [];
    let regrasVerificadas = new Set(); // Para evitar duplicatas
    let contadoresCategoria = {
        "RP": 0,
        "Chat": 0,
        "Abuso": 0,
        "Alerta": 0,
        "Contas": 0,
        "Nome": 0,
        "Mídia": 0,
        "Clan": 0
    };

    // Iterar sobre todas as regras
    for (const [codigo, dadosRegra] of Object.entries(regras.regras)) {
        // Verificar cada palavra-chave da regra atual
        for (const palavra of dadosRegra.keywords) {
            if (textoEntrada.includes(palavra) && !regrasVerificadas.has(codigo)) {
                infracoesEncontradas.push({
                    codigo: codigo,
                    descricao: dadosRegra.descricao,
                    penalidade: dadosRegra.penalidade,
                    categoria: dadosRegra.categoria
                });
                regrasVerificadas.add(codigo);

                // Contar por categoria
                if (contadoresCategoria.hasOwnProperty(dadosRegra.categoria)) {
                    contadoresCategoria[dadosRegra.categoria]++;
                }
                break; // Parar após encontrar uma correspondência para esta regra
            }
        }
    }

    // Atualizar estatísticas
    atualizarEstatisticas(infracoesEncontradas.length, contadoresCategoria);

    // Exibir resultados
    exibirResultados(infracoesEncontradas, 'resultado');
}

/**
 * Função para verificar infrações da Polícia
 */
function verificarPolicia() {
    // Obter e limpar o texto de entrada
    const textoEntrada = document.getElementById('entradaPolicia').value.trim().toLowerCase();

    // Verificar se há texto para analisar
    if (!textoEntrada) {
        document.getElementById('resultadoPolicia').innerHTML = `
            <div class="nenhum">
                ℹ️ Por favor, digite uma descrição da infração policial para verificar.
            </div>
        `;
        document.getElementById('estatisticasPolicia').style.display = 'none';
        return;
    }

    // Inicializar variáveis para resultados
    let infracoesEncontradas = [];
    let regrasVerificadas = new Set(); // Para evitar duplicatas
    let contadoresCategoria = {
        "Criminal": 0,
        "Civil": 0,
        "Administrativa": 0
    };

    // Iterar sobre todas as regras da polícia
    for (const [codigo, dadosRegra] of Object.entries(regrasPolicia.infracoesPolicia)) {
        // Verificar cada palavra-chave da regra atual
        for (const palavra of dadosRegra.keywords) {
            if (textoEntrada.includes(palavra) && !regrasVerificadas.has(codigo)) {
                infracoesEncontradas.push({
                    codigo: codigo,
                    descricao: dadosRegra.descricao,
                    penalidade: dadosRegra.penalidade,
                    categoria: dadosRegra.categoria
                });
                regrasVerificadas.add(codigo);

                // Contar por categoria
                if (contadoresCategoria.hasOwnProperty(dadosRegra.categoria)) {
                    contadoresCategoria[dadosRegra.categoria]++;
                }
                break; // Parar após encontrar uma correspondência para esta regra
            }
        }
    }

    // Atualizar estatísticas
    atualizarEstatisticasPolicia(infracoesEncontradas.length, contadoresCategoria);

    // Exibir resultados
    exibirResultadosPolicia(infracoesEncontradas);
}

/**
 * Atualiza as estatísticas na interface RP
 */
function atualizarEstatisticas(total, categorias) {
    document.getElementById('estatisticas').style.display = 'flex';
    document.getElementById('totalInfracoes').textContent = total;
    document.getElementById('categoriaRP').textContent = categorias.RP;
    document.getElementById('categoriaCHAT').textContent = categorias.Chat;
    document.getElementById('categoriaGRAVE').textContent = categorias.Abuso + categorias.Alerta;
}

/**
 * Atualiza as estatísticas na interface da Polícia
 */
function atualizarEstatisticasPolicia(total, categorias) {
    document.getElementById('estatisticasPolicia').style.display = 'flex';
    document.getElementById('totalInfracoesPolicia').textContent = total;
    document.getElementById('categoriaCriminal').textContent = categorias.Criminal;
    document.getElementById('categoriaCivil').textContent = categorias.Civil;
    document.getElementById('categoriaAdministrativa').textContent = categorias.Administrativa;
}

/**
 * Exibe os resultados da verificação RP
 */
function exibirResultados(infracoes, elementoId = 'resultado') {
    const resultadoElemento = document.getElementById(elementoId);

    if (infracoes.length === 0) {
        resultadoElemento.innerHTML = `
            <div class="nenhum">
                ✅ Nenhuma infração identificada com base na descrição fornecida.
            </div>
        `;
        return;
    }

    // Ordenar infrações por categoria e código
    infracoes.sort((a, b) => {
        if (a.categoria !== b.categoria) {
            return a.categoria.localeCompare(b.categoria);
        }
        return a.codigo.localeCompare(b.codigo);
    });

    // Construir HTML dos resultados
    let htmlResultados = `
        <h2>Infrações Identificadas (${infracoes.length})</h2>
    `;

    let categoriaAtual = '';

    infracoes.forEach(infracao => {
        // Adicionar cabeçalho de categoria se mudou
        if (infracao.categoria !== categoriaAtual) {
            categoriaAtual = infracao.categoria;
            htmlResultados += `
                <h3 style="margin: 15px 0 10px 0; color: var(--primary-color); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                    ${categoriaAtual}
                </h3>
            `;
        }

        htmlResultados += `
            <div class="regra">
                <p><b>${infracao.codigo}</b>: ${infracao.descricao}</p>
                <p><i>Penalidade:</i> ${infracao.penalidade}</p>
            </div>
        `;
    });

    resultadoElemento.innerHTML = htmlResultados;
}

/**
 * Exibe os resultados da verificação da Polícia
 */
function exibirResultadosPolicia(infracoes) {
    const resultadoElemento = document.getElementById('resultadoPolicia');

    if (infracoes.length === 0) {
        resultadoElemento.innerHTML = `
            <div class="nenhum">
                ✅ Nenhuma infração policial identificada com base na descrição fornecida.
            </div>
        `;
        return;
    }

    // Ordenar infrações por categoria e código
    infracoes.sort((a, b) => {
        if (a.categoria !== b.categoria) {
            return a.categoria.localeCompare(b.categoria);
        }
        return a.codigo.localeCompare(b.codigo);
    });

    // Construir HTML dos resultados
    let htmlResultados = `
        <h2>Infrações Policiais Identificadas (${infracoes.length})</h2>
    `;

    let categoriaAtual = '';

    infracoes.forEach(infracao => {
        // Adicionar cabeçalho de categoria se mudou
        if (infracao.categoria !== categoriaAtual) {
            categoriaAtual = infracao.categoria;
            htmlResultados += `
                <h3 style="margin: 15px 0 10px 0; color: var(--police-color); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                    ${categoriaAtual}
                </h3>
            `;
        }

        htmlResultados += `
            <div class="regra">
                <p><b>${infracao.codigo}</b>: ${infracao.descricao}</p>
                <p><i>Penalidade:</i> ${infracao.penalidade}</p>
            </div>
        `;
    });

    resultadoElemento.innerHTML = htmlResultados;
}

/**
 * Mostra as regras do departamento de polícia
 */
function mostrarRegrasPolicia() {
    const modal = document.getElementById('modalRegrasPolicia');
    const content = document.getElementById('regrasPoliciaContent');
    
    let html = `
        <p>Abaixo listamos uma série de regras que devem ser seguidas por TODOS que forem membros da Polícia em OneState.</p>
    `;

    regrasPolicia.regrasDepartamento.forEach(regra => {
        html += `
            <div class="regra-policia">
                <h3>Regra ${regra.numero}</h3>
                <p>${regra.descricao}</p>
            </div>
        `;
    });

    content.innerHTML = html;
    modal.style.display = 'flex';
}

/**
 * Fecha o modal das regras da polícia
 */
function fecharModalRegras() {
    document.getElementById('modalRegrasPolicia').style.display = 'none';
}

// Event Listeners para Enter
document.getElementById('entrada').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        verificar();
    }
});

document.getElementById('entradaPolicia').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        verificarPolicia();
    }
});

// Fechar modal ao clicar fora
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modalRegrasPolicia');
    if (event.target === modal) {
        fecharModalRegras();
    }
});

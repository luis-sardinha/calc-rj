function detectEnter(event) {
  if (event.key === "Enter") {
      event.preventDefault(); // Evita o comportamento padrão do Enter
      calculate(); // Chama a função calcular
  }
}

function formatarValorEmReais(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  
  function showResult() {
    var resultContainer = document.getElementById('result');
    resultContainer.classList.add('show');
  }

  window.onload = function(){
    calculate();
  }
  
  function calculate() {
     
    var valorSemAdd = 352.96
  
    var fetj = valorSemAdd * 0.2;
    fetj = Math.floor(fetj * 100) / 100; // Trunca para 2 casas decimais
  
    var funperj = valorSemAdd * 0.05;
    funperj = Math.floor(funperj * 100) / 100; // Trunca para 2 casas decimais
  
    var funarpen = valorSemAdd * 0.06;
    funarpen = Math.floor(funarpen * 100) / 100; // Trunca para 2 casas decimais
  
    var pmcmv = valorSemAdd * 0.02;
    pmcmv = Math.floor(pmcmv * 100) / 100; // Trunca para 2 casas decimais
  
    var distribuicao = 39.93
  
    var iss = valorSemAdd * 0.05;
    iss = Math.floor(iss * 100) / 100; // Trunca para 2 casas decimais
  
    var selo = 2.77
  
    var atoeletronico = 1.35
  
    var emolumentos = valorSemAdd + fetj + funperj + funperj + funarpen + pmcmv + distribuicao + iss + selo + atoeletronico;
  
    // Montagem do texto do resultado
    var resultText =
     '<strong>Cobrança detalhada:</strong><br>' +
     '<table class="excel-style">' +
     '<tr><td>Escritura de Autocuratela</td><td>' + formatarValorEmReais(valorSemAdd) + '</td></tr>' +
     '<tr><td>FETJ(20%)</td><td>' + formatarValorEmReais(fetj) + '</td></tr>' +
     '<tr><td>FUNPERJ(5%)</td><td>' + formatarValorEmReais(funperj) + '</td></tr>' +
     '<tr><td>FUNPERJ(5%)</td><td>' + formatarValorEmReais(funperj) + '</td></tr>' +
     '<tr><td>FUNARPEN(6%)</td><td>' + formatarValorEmReais(funarpen) + '</td></tr>' +
     '<tr><td>PMCMV(2%)</td><td>' + formatarValorEmReais(pmcmv) + '</td></tr>' +
     '<tr><td>Distribuição</td><td>' + formatarValorEmReais(distribuicao) + '</td></tr>' +
     '<tr><td>Selo eletrônico</td><td>' + formatarValorEmReais(selo) + '</td></tr>' +
     '<tr><td>ISS</td><td>' + formatarValorEmReais(iss) + '</td></tr>' +
     '<tr><td>Ato eletrônico</td><td>' + formatarValorEmReais(atoeletronico) + '</td></tr>' +
     '<tr><td><strong>Emolumentos totais</strong></td><td>' + formatarValorEmReais(emolumentos) + '</td></tr>' +
     '</table>' +
     '<p>Atenção: Este é um documento não fiscal, o presente orçamento não envolve qualificação registral do título e poderá sofrer alterações.</p>';
  
    var resultContainer = document.getElementById('result');
    resultContainer.innerHTML = resultText;
  
    showResult();
  
    var imprimirButton = document.getElementById('imprimirButton');
    imprimirButton.style.display = 'inline-block';

    var exportarExcelButton = document.getElementById('exportarExcelButton');
    exportarExcelButton.style.display = 'inline-block';
  }

  function exportarParaExcel() {
    // Captura os dados do resumo que foram exibidos no `resultContainer`
    var resultContainer = document.getElementById('result');
    var tabelaHtml = resultContainer.querySelector('.excel-style');
  
    // Prepara os dados da tabela para exportação
    var workbook = XLSX.utils.book_new(); // Cria uma nova planilha
    var ws_data = [];
  
    // Extrai as linhas e colunas da tabela HTML
    for (var i = 0; i < tabelaHtml.rows.length; i++) {
        var row = [];
        for (var j = 0; j < tabelaHtml.rows[i].cells.length; j++) {
            row.push(tabelaHtml.rows[i].cells[j].innerText);
        }
        ws_data.push(row);
    }
  
    // Converte os dados em uma worksheet do Excel
    var worksheet = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resumo do Cálculo');
  
    // Exporta o arquivo Excel
    XLSX.writeFile(workbook, 'Resumo_que_versem.xlsx');
  }
  
  function imprimirResultado() {
    var resultContainer = document.getElementById('result');
    var conteudoParaImprimir = resultContainer.innerHTML;
  
    var janelaImpressao = window.open('', '_blank');
    janelaImpressao.document.write('<html><head><title>Resultado da Calculadora</title>');
  
    // Adicione uma folha de estilo para a tabela na janela de impressão
    janelaImpressao.document.write('<style>');
    janelaImpressao.document.write('table { border-collapse: collapse; width: 100%; }');
    janelaImpressao.document.write('table, th, td { border: 1px solid black; }');
    janelaImpressao.document.write('th, td { padding: 8px; text-align: left; }');
    janelaImpressao.document.write('@media print { .logo { display: flex; width: 150px; height: auto; } }');
    janelaImpressao.document.write('</style>');
  
    janelaImpressao.document.write('</head><body>');
  
    // Adicione sua logo aqui (substitua 'caminho/para/sua/logo.png' pelo caminho real da sua imagem)
    janelaImpressao.document.write('<img class="logo" src="images/Logo_Principal.png" alt="Logo da Empresa"><br>');
  
    janelaImpressao.document.write(conteudoParaImprimir);
    janelaImpressao.document.write('</body></html>');
    janelaImpressao.document.close();
  
    // Chama o diálogo de impressão padrão
    janelaImpressao.print();
  }
  
  function encontrarValorNaTabela(valor, tabela) {
    for (var i = 0; i < tabela.length; i++) {
        var intervalo = tabela[i].intervalo;
        if (valor >= intervalo[0] && valor <= intervalo[1]) {
            return tabela[i].valor;
        }
    }
    return tabela[tabela.length - 1].valor;
  }
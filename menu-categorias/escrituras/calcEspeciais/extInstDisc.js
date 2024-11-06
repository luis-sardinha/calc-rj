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

function calculate() {
  // Obter o valor digitado pelo usuário
  var inputOption = document.getElementById('inputOption').value;

    if (inputOption === '') {
      inputOption = 0;
  } else {
      inputOption = parseInt(inputOption); // Converte para número se houver um valor
  }
  
  // Definir os valores e o cálculo do multiplicador
  var undSemAdd = 128.64;
  var multiplier = parseInt(inputOption) * undSemAdd; // Converte o valor para número e calcula o multiplicador
  
  var valorSemAdd = 1830.39;
  var valorTotalEmolumentos = valorSemAdd + multiplier;

  // Cálculos adicionais
  var fetj = Math.floor(valorTotalEmolumentos * 0.2 * 100) / 100;
  var funperj = Math.floor(valorTotalEmolumentos * 0.05 * 100) / 100;
  var funarpen = Math.floor(valorTotalEmolumentos * 0.06 * 100) / 100;
  var pmcmv = Math.floor(valorTotalEmolumentos * 0.02 * 100) / 100;
  
  var distribuicao = 38.15;
  var iss = 5.00;
  var selo = 2.59;
  var atoeletronico = 1.29;

  var emolumentos = valorTotalEmolumentos + fetj + funperj + funarpen + pmcmv + distribuicao + iss + selo + atoeletronico;

  // Montagem do texto do resultado
  var resultText =
      '<strong>Cobrança detalhada:</strong><br>' +
      '<table class="excel-style">' +
      '<tr><td>Escritura Pública</td><td>' + formatarValorEmReais(valorTotalEmolumentos) + '</td></tr>' +
      '<tr><td>FETJ(20%)</td><td>' + formatarValorEmReais(fetj) + '</td></tr>' +
      '<tr><td>FUNPERJ(5%)</td><td>' + formatarValorEmReais(funperj) + '</td></tr>' +
      '<tr><td>FUNARPEN(6%)</td><td>' + formatarValorEmReais(funarpen) + '</td></tr>' +
      '<tr><td>PMCMV(2%)</td><td>' + formatarValorEmReais(pmcmv) + '</td></tr>' +
      '<tr><td>Distribuição</td><td>' + formatarValorEmReais(distribuicao) + '</td></tr>' +
      '<tr><td>Selo eletrônico</td><td>' + formatarValorEmReais(selo) + '</td></tr>' +
      '<tr><td>ISS</td><td>' + formatarValorEmReais(iss) + '</td></tr>' +
      '<tr><td>Ato eletrônico</td><td>' + formatarValorEmReais(atoeletronico) + '</td></tr>' +
      '<tr><td>Unidades excedentes</td><td>' + formatarValorEmReais(multiplier) + '</td></tr>' +
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
  XLSX.writeFile(workbook, 'Resumo_tabeliao_rogo.xlsx');
}

// Mantém as demais funções do seu código, como calculate e showResult, sem modificações




function imprimirResultado() {
  var resultContainer = document.getElementById('result');
  var conteudoParaImprimir = resultContainer.innerHTML;

  var janelaImpressao = window.open('', '_blank');
  janelaImpressao.document.write('<html><head><title>Resultado da Calculadora</title>');
  janelaImpressao.document.write('<style>');
  janelaImpressao.document.write('table { border-collapse: collapse; width: 100%; }');
  janelaImpressao.document.write('table, th, td { border: 1px solid black; }');
  janelaImpressao.document.write('th, td { padding: 8px; text-align: left; }');
  janelaImpressao.document.write('@media print { .logo { display: flex; width: 150px; height: auto; } }');
  janelaImpressao.document.write('</style>');
  janelaImpressao.document.write('</head><body>');
  janelaImpressao.document.write('<img class="logo" src="images/Logo_Principal.png" alt="Logo da Empresa"><br>');
  janelaImpressao.document.write(conteudoParaImprimir);
  janelaImpressao.document.write('</body></html>');
  janelaImpressao.document.close();
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
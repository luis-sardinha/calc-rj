function formatCurrency(input) {
  // Remove caracteres não numéricos
  const value = input.value.replace(/[^\d]/g, '');

  // Formata o valor adicionando separadores de milhares e casas decimais
  const formattedValue = (parseFloat(value) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Atualiza o valor no campo de entrada
  input.value = formattedValue;
}

function formatarValorEmReais(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function showResult() {
  var resultContainer = document.getElementById('result');
  resultContainer.classList.add('show');
}

function calculate() {
  // Obter os valores digitados
  const value1 = parseFloat(document.getElementById('value1').value.replace(/[^\d]/g, ''));
  //const value2 = parseFloat(document.getElementById('value2').value.replace(/[^\d]/g, ''));

  var inputValue = Math.max(value1) / 100;  // Dividir por 100 para ajustar o formato

  // Tabela de Emolumentos
  var tabelaValores = [
    { intervalo: [0, 18435.10], valor: 290.48 },
    { intervalo: [18435.11, 36870.23], valor: 480.00 },
    { intervalo: [36870.24, 55305.35], valor: 669.56 },
    { intervalo: [55305.36, 73740.49], valor: 821.15 },
    { intervalo: [73740.50, 98320.64], valor: 1455.47 },
    { intervalo: [98320.65, 122900.81], valor: 1718.27 },
    { intervalo: [122900.82, 245801.64], valor: 2324.72 },
    { intervalo: [245801.65, 491603.30], valor: 2494.48 }
];

  // Configurações para os intervalos adicionais
  const intervaloInicial = 491603.31;
  const valorInicial = 2494.48;
  const tamanhoFaixa = 122900.81;
  const incrementoValor = 220.93;
  const limiteSuperior = 40000000; // 40 milhões

  // Variáveis auxiliares
  let faixaInicio = intervaloInicial;
  let faixaFim = intervaloInicial + tamanhoFaixa - 0.01;
  let valorAtual = valorInicial + incrementoValor;

  // Loop para gerar os intervalos até próximo de 40 milhões
  while (faixaFim <= limiteSuperior) {
      tabelaValores.push({
          intervalo: [parseFloat(faixaInicio.toFixed(2)), parseFloat(faixaFim.toFixed(2))],
          valor: parseFloat(valorAtual.toFixed(2)),
      });
      faixaInicio += tamanhoFaixa;
      faixaFim += tamanhoFaixa;
      valorAtual += incrementoValor;
  }

  // Encontrar o valor correspondente na tabela
  var valorTabela = encontrarValorNaTabela(inputValue, tabelaValores);
  
  // Cálculo dos emolumentos adicionais
  var pmcmv = valorTabela * 0.02;
  pmcmv = Math.floor(pmcmv * 100) / 100; // Trunca para 2 casas decimais

  var emolumentos = valorTabela + pmcmv; //+ certidao + arquivamento + conferencia;

  // Montagem do texto do resultado
  var resultText =
      '<strong>Cobrança detalhada:</strong><br>' +
      '<table class="excel-style">' +
      '<tr><td>16.3 - Compra e Venda</td><td>' + formatarValorEmReais(valorTabela) + '</td></tr>' +
      '<tr><td>16.1 - PMCMV</td><td>' + formatarValorEmReais(pmcmv) + '</td></tr>' +
      '<tr><td><strong>Emolumentos totais</strong></td><td>' + formatarValorEmReais(emolumentos) + '</td></tr>' +
      '</table>' +
      '<p>Atenção: Este é um documento não fiscal, o presente orçamento não envolve qualificação registral do título e poderá sofrer alterações.</p>';

  var resultContainer = document.getElementById('result');
  resultContainer.innerHTML = resultText;

  showResult();

  var imprimirButton = document.getElementById('imprimirButton');
  imprimirButton.style.display = 'inline-block';
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

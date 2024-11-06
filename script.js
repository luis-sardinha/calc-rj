function loadSelectedPage(selectedPage) {
    if (!selectedPage) {
        return;
    }

    // Redireciona o navegador para a página selecionada
    window.location.href = selectedPage;
}

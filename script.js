const express = require('express');
const app = express();
const port = 3000;

// Objeto para armazenar variáveis por sala
let salas = {};

// Função para gerar um código único de sala (ex: 4 dígitos aleatórios)
function gerarCodigoSala() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Rota para criar uma nova sala
app.get('/criar-sala', (req, res) => {
    let novoCodigoSala = gerarCodigoSala();

    // Certificar-se de que o código da sala seja único
    while (salas[novoCodigoSala]) {
        novoCodigoSala = gerarCodigoSala();
    }

    // Criar uma nova sala
    salas[novoCodigoSala] = {};
    console.log(`Nova sala criada com código: ${novoCodigoSala}`);
    res.send(novoCodigoSala);  // Retornar apenas o código da sala
});

// Rota para entrar em uma sala (verificar se ela existe)
app.get('/entrar-sala', (req, res) => {
    const codigoSala = req.query.code;  // Código da sala passado pela URL

    if (!codigoSala || !salas[codigoSala]) {
        return res.status(404).send('Erro: Sala não existe.');
    }

    console.log(`Entrou na sala: ${codigoSala}`);
    res.send(`Entrou na sala ${codigoSala}`);
});

// Rota para atualizar o valor de uma variável em uma sala
app.get('/a-var', (req, res) => {
    const codigoSala = req.query.code;  // Código da sala fornecido pelo Pocket Code
    const nomeVariavel = Object.keys(req.query).find(key => key !== 'code');  // Pega o nome da variável (exceto 'code')
    const valorVariavel = req.query[nomeVariavel];  // Pega o valor da variável

    if (!codigoSala || !nomeVariavel || !valorVariavel) {
        return res.status(400).send('Código da sala, nome ou valor da variável não foram fornecidos corretamente.');
    }

    // Verificar se a sala existe
    if (!salas[codigoSala]) {
        return res.status(404).send('Erro: Sala não existe.');
    }

    // Atualizar ou criar a variável na sala
    salas[codigoSala][nomeVariavel] = valorVariavel;
    console.log(`Sala '${codigoSala}': Variável '${nomeVariavel}' atualizada com valor: ${valorVariavel}`);
    res.send(`Sala '${codigoSala}': Variável '${nomeVariavel}' atualizada com sucesso.`);
});

// Rota para verificar o valor de uma variável em uma sala
app.get('/v-var', (req, res) => {
    const codigoSala = req.query.code;  // Código da sala fornecido pelo Pocket Code
    const nomeVariavel = Object.keys(req.query).find(key => key !== 'code');  // Pega o nome da variável

    if (!codigoSala || !nomeVariavel) {
        return res.status(400).send('Código da sala ou nome da variável não foram fornecidos corretamente.');
    }

    // Verificar se a sala existe
    if (!salas[codigoSala]) {
        return res.status(404).send('Erro: Sala não existe.');
    }

    // Verificar se a variável existe
    const valorVariavel = salas[codigoSala][nomeVariavel];
    if (valorVariavel === undefined) {
        return res.status(404).send(`Variável '${nomeVariavel}' não encontrada na sala ${codigoSala}.`);
    }

    console.log(`Sala '${codigoSala}': Variável '${nomeVariavel}' verificada com valor: ${valorVariavel}`);
    res.send(valorVariavel.toString());
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

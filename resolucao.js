const { table } = require('console');
const fs = require('fs');
const { text, json } = require('stream/consumers');

//Função para ler o arquivo corrompido "broken-database.json"
function le_arquivo() {
    const raw_data = fs.readFileSync('broken-database.json');
    const dados = JSON.parse(raw_data);
    return dados;
}

//Função para corrigir os caracteres corrompidos
function corrige_caracteres(name) {
    const corrige = {'æ' : 'a', '¢' : 'c', 'ß' : 'b', 'ø' : 'o',}

    return name.replace(/æ|¢|ß|ø/gi, function(substitui) {
        return corrige[substitui]
    })
}

//Função para corrigir os preços que foram transformados em string
function corrige_preco(price){
    return parseFloat(price);
}

//Função para corrigir as quantidas corrompidas
function corrige_quantidade(quantity){
    if (quantity > 0)
        return quantity;
    else
        return 0;
}

//Função para exportar o arquivo JSON com o banco corrigido
function arquivo_corrigido(){
    const corretor = le_arquivo().map(database => ({
        id: database.id,
        name: corrige_caracteres(database.name),
        quantity: corrige_quantidade(database.quantity),
        price: corrige_preco(database.price),
        category: database.category,
    }));

    return fs.writeFileSync('saida.json', JSON.stringify(corretor, null, 4), err => {
        if(err)
            console.log(err);
    });
}

//Função o de validação que imprime a lista com todos os nomes dos produtos, ordenados primeiro por categoria em ordem alfabética e ordenados por id em ordem crescente
function ordena_database(){
    const raw_data = fs.readFileSync('saida.json');
    const dados = JSON.parse(raw_data);

    dados.sort((item1, item2) => {
        if(item1.category < item2.category)
            return -1;
        else{
            if (item1.category == item2.category && item1.id < item2.id)
                return -1;
        }
    })
    return dados;
}

//Função que calcula qual é o valor total do estoque por categoria, ou seja, a soma do valor de todos os produtos em estoque de cada categoria, considerando a quantidade de cada produto. 
function calcula_preco_total(){
    var database_ordenada = ordena_database();
    var total_panela = 0, total_eletrodomesticos = 0, total_eletronicos = 0, total_acessorios = 0;
    console.log(database_ordenada);

    database_ordenada.forEach((dados) => {
        if(dados.category == 'Panelas')
            total_panela = total_panela + (dados.price * dados.quantity);
        if(dados.category == 'Eletrodomésticos')
            total_eletrodomesticos = total_eletrodomesticos + (dados.price * dados.quantity)
        if(dados.category == 'Eletrônicos')
            total_eletronicos = total_eletronicos + (dados.price * dados.quantity)
        if(dados.category == 'Acessórios')
            total_acessorios = total_acessorios + (dados.price * dados.quantity)
    })
    console.log('Valor total acessórios: ', total_acessorios.toFixed(2));
    console.log('Valor total eletrodomésticos: ', total_eletrodomesticos.toFixed(2));
    console.log('Valor total eletrônicos: ', total_eletronicos.toFixed(2));
    console.log('Valor total panela: ', total_panela.toFixed(2));
}

arquivo_corrigido();

ordena_database();

calcula_preco_total();

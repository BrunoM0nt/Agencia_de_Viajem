app.initialize();

var codigos = new Array();
var x = 0;

var db = window.openDatabase("Database", "1.0", "Agencia", 2000); //Nota: window.openDatabase não funciona em Firefox
db.transaction(createDB, errorDB, successDB);
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    db.transaction(createDB, errorDB, successDB);
}

function errorDB(err) {
    alert("Erro: " + err);
}

function successDB() { }

function createDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Agencia(id INTEGER PRIMARY KEY, nome VARCHAR(50) , qtd_estoque NUM(15),preco NUM(15))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Carrinho(id_Compra INTEGER PRIMARY KEY,nome VARCHAR(50) , id_prod NUM(15),preco num(15),qtd_compra NUM(15))');
}

function agencia_insert() {
    db.transaction(agencia_insert_db, errorDB, successDB)
}

function agencia_insert_db(tx) {
    var nome = $("#nome_pacote").val();
    var qtd_estoque = $("#quantidade_estoque").val();
    var preco = $("#pacote_preco").val();
    tx.executeSql('INSERT INTO Agencia (nome,qtd_estoque,preco) VALUES ("' + nome + '","' + qtd_estoque + '","' + preco + '")');
    alert("Cadastrado Com Sucesso");
    limpar();

}


function agencia_view() {
    db.transaction(agencia_view_db, errorDB, successDB)
}

function agencia_view_db(tx) {
    tx.executeSql('SELECT * FROM Agencia', [], agencia_view_data, errorDB);
}

//Apresentação de dados ------------------+
function agencia_view_data(tx, results) {
    $("#pacotes_listagem").empty();
    var len = results.rows.length;

    for (var i = 0; i < len; i++) {
        $("#pacotes_listagem").append("<tr class='agenda_item_lista'>" +
            "<td> <h3>" + results.rows.item(i).nome + "</h3> </td >" +
            "<td> <h3>" + results.rows.item(i).qtd_estoque + "</h3> </td >" +
            "<td> <h3>" + results.rows.item(i).preco + "</h3> </td >" +
            "<td><input type='button' class='btn btn-lg btn-warning' value='Comprar'+ onclick='view_compra(" + results.rows.item(i).id + ")'>" +
            "<td><input type='button' class='btn btn-lg btn-danger' value='x' + onclick='agencia_delete(" + results.rows.item(i).id + ")'>" +
            "</tr>");
    }
}

// Consulta no banco de dados o item selecionado e pede a quantidade que sera comprada
function view_compra(compra_id) {
    $("#id_compra").val(compra_id);

    db.transaction(compra_view_db, errorDB, successDB)
}
function compra_view_db(tx) {
    var agencia_id_compra = $("#id_compra").val();
    $("#tela_lista").hide();
    $("#tela_compra").show();
    tx.executeSql('SELECT * FROM Agencia where id = ' + agencia_id_compra + '', [], agencia_view_compra, errorDB);
}

function agencia_view_compra(tx, results) {
    $("#listagem_compra").empty();
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        $("#listagem_compra").append("<tr class='compra_item_lista'>" +
            "<td> <h3>" + results.rows.item(i).nome + "</h3> </td >" +
            "<td> <h3>" + results.rows.item(i).qtd_estoque + "</h3> </td >" +
            "<td> <h3>" + results.rows.item(i).preco + "</h3> </td >" +
            //envia os dados do pacote comprado para variavel html
            $("#prod_nome").val(results.rows.item(i).nome) +
            $("#prod_qtd").val(results.rows.item(i).qtd_estoque) +
            $("#prod_preco").val(results.rows.item(i).preco) +
            $("#id_carrinho").val(results.rows.item(i).id) +
            "<td><br><input id='qtd_para_compra' + type='text' + class='form-control'>" + "" +//campo que recebe a quantidade que sera comprada
            "<td><br><input type='button' class='btn btn-lg btn-warning' value='Confirmar Comprar'+ onclick='insert_carrinho(" + results.rows.item(i).id + ")'>" +
            "</tr>");
    }
}

// insere no db carrinho os dados da compra
function insert_carrinho() {
    db.transaction(carrinho_insert_db, errorDB, successDB)
}
function carrinho_insert_db(tx) {
    //recebe os dados das variaveis html
    var qt_compra = $("#qtd_para_compra").val();
    var id_carrinho_compra = $("#id_carrinho").val();
    var nome = $("#prod_nome").val();
    var precos = $("#prod_preco").val();
    var quanti_estoq = $("#prod_qtd").val();
    var update_estoque = quanti_estoq - qt_compra;
    
    if (qt_compra == "") {
        alert("Informa a Quantidade que Deseja Comprar");
    } else {
        // insere  os dados da compra no db carrinho 
        tx.executeSql('INSERT INTO Carrinho (id_prod,nome,preco,qtd_compra) VALUES ("' + id_carrinho_compra + '","' + nome + '","' + precos + '","' + qt_compra + '")');
        alert("Produto Enviado Para o Carrinho");
        //Atualiza a quantidade estoque da quantidade comprada
        tx.executeSql('UPDATE Agencia SET qtd_estoque ="' + update_estoque + '" WHERE id= "' + id_carrinho_compra + '"');
        agencia_view();
    }
}

//exibe no carrinho de compras os pacotes selecionados
function carrinho_view() {
    db.transaction(carrinho_view_db, errorDB, successDB)
}

function carrinho_view_db(tx) {
    tx.executeSql('SELECT * FROM Carrinho', [], carrinho_view_data, errorDB);
}

function carrinho_view_data(tx, results) {
    $("#pacotes_compra").empty();
    var len = results.rows.length;

    for (var i = 0; i < len; i++) {
        $("#pacotes_compra").append("<tr class='carrinho_item_lista'>" +
            "<td> <h3>" + results.rows.item(i).nome + "</h3> </td >" +
            "<td> <h3>" + ' R$' + results.rows.item(i).preco + "</h3> </td >" +
            "<td> <h3>" + results.rows.item(i).qtd_compra + "</h3> </td >" +
            "<td> <h3>" + ' R$' + results.rows.item(i).qtd_compra * results.rows.item(i).preco + "</h3> </td >" +
            "</tr>");
    }
}


//Apresentação de dados ------------------+
function compra_view_data(tx, results) {
    $("#pacote_compra").empty();
    var len = results.rows.length;

    for (var i = 0; i < len; i++) {
        $("#pacote_compra").append("<tr class='compra_item_compra'>" +
            "<td> <h3>" + results.rows.item(i).nome + "</h3> </td >" +
            "<td> <h3>" + results.rows.item(i).qtd_estoque + "</h3> </td >" +
            "<td> <h3>" + results.rows.item(i).preco + "</h3> </td >" +
            "<td><input type='button' class='btn btn-lg btn-danger' value='x' + onclick='compra_item_delete(" + results.rows.item(i).id + ")'>" +
            "</tr>");
    }
}
// Funçõe que limpa o carrinho de compras após finalizar compra
function carrinho_delete() {
    db.transaction(carrinho_delete_db, errorDB, successDB)
}


function carrinho_delete_db(tx) {
    tx.executeSql("delete FROM Carrinho");
    alert("Compra Realizada Com Sucesso");
    carrinho_view();
}

function compra_item_delete(agencia_id) {
    document.getElementById('id_delete').value = agencia_id;
    db.transaction(compra_item_delete_db, errorDB, successDB)
}

function compra_item_delete_db(tx) {
    alert("Item removido da lista!")
    tx.executeSql("delete from produtos where id = '" + document.getElementById('id_delete').value + "'");
    agencia_view();
}

//funçõe que deleta um pacote Cadastrados

function agencia_delete(agencia_id) {
    document.getElementById('id_delete').value = agencia_id;
    db.transaction(agencia_delete_db, errorDB, successDB)
}

function agencia_delete_db(tx) {
    alert("Item removido da lista!")
    tx.executeSql("delete from Agencia where id = '" + document.getElementById('id_delete').value + "'");
    agencia_view();
}

function limpar() {
    if (document.getElementById('nome_pacote').value != "" || document.getElementById('quantidade_estoque').value != "" || document.getElementById('pacote_preco').value != "") {
        document.getElementById('nome_pacote').value = "";
        document.getElementById('quantidade_estoque').value = "";
        document.getElementById('pacote_preco').value = "";
    }
}


// funções de troca de tela
function abrir_tela_menu() {
    $("#tela_compra").hide();
    $("#tela_carrinho").hide();
    $("#tela_lista").hide();
    $("#tela_cadastro").hide();
    $("#menu").show();
}

function abrir_tela_cadastro() {
    $("#menu").hide();
    $("#tela_cadastro").show();
}

function abrir_tela_lista() {
    $("#menu").hide();
    $("#tela_lista").show();
}

function abrir_tela_carrinho() {
    $("#menu").hide();
    $("#tela_carrinho").show();
}

function fechar_tela_compra() {
    $("#tela_compra").hide();
    $("#tela_lista").show();
}


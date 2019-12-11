app.initialize();

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
    tx.executeSql('CREATE TABLE IF NOT EXISTS Carrinho(id_Compra INTEGER PRIMARY KEY, id_prod NUM(15), qtd NUM(15))');
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
            "<td><input type='button' class='btn btn-lg btn-warning' value='Comprar' onclick='compra_tela(" + results.rows.item(i).id + ")'>" +
            "<td><input type='button' class='btn btn-lg btn-danger' value='x' + onclick='agenda_delete(" + results.rows.item(i).id + ")'>" +
            "</tr>");
    }
}
// Consulta no banco de dados o item selecionado na compra
function compra_tela(compra_id) {
    $("#id_compra").val(compra_id);
    db.transaction(compra_view_db, errorDB, successDB)
}
function compra_tela_db(tx) {
    var id_compra = $("#id_compra").val();
    $("#tela_lista").hide();
    $("#tela_compra").show();
    tx.executeSql('SELECT * FROM Agencia where id = ' + id_compra + '', [], compra_tela_data, errorDB);
}

//Compras ------------------+
function compra_tela_data(tx, results) {
    $("#listagem_compra").empty();
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        $("#listagem_compra").append("<tr class='compra_item_lista'>" +
            "<td> <h3>" + results.rows.item(i).nome + "</h3> </td >" +
            "<td> <h3>" + results.rows.item(i).qtd_estoque + "</h3> </td >" +
            "<td> <h3>" + results.rows.item(i).preco + "</h3> </td >" +
            "<td><br><input id='qtd_compra' type='text' class='form-control'>" +
            "<td><br><input type='button' class='btn btn-lg btn-warning' value='Continuar Compra' onclick='continuar_compra(" + results.rows.item(i).id + ", " + $('qtd_compra').val() +")'>" +
            "</tr>");
    }
}

function continuar_compra(prod_id, prod_qtd){
    $("#prod_id").val(prod_id);
    $("#prod_qtd").val(prod_qtd);
    alert(prod_qtd)
    db.transaction(continuar_compra_db, errorDB, successDB)
}

function continuar_compra_db(tx){
    tx.executeSql("INSERT INTO carrinho (id_prod, qtd) VALUES('" + $("#prod_id").val() + "', '" + $("#prod_qtd").val() + "')")
    alert($("#prod_id").val())
    alert($("#prod_qtd").val())
}

function compra_view() {
    db.transaction(compra_view_db, errorDB, successDB)
}

function compra_view_db(tx) {
    tx.executeSql('SELECT * FROM produtos', [], compra_view_data, errorDB);
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
            //"<input type='button'  class='btn btn-lg btn-warning' value='Add'  onclick='agenda_update_abrir_tela(" + results.rows.item(i).id + ")'></td>" +
            "</tr>");
    }
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

function agenda_delete(agencia_id) {
    document.getElementById('id_delete').value = agencia_id;
    db.transaction(agenda_delete_db, errorDB, successDB)
}

function agenda_delete_db(tx) {
    alert("Item removido da lista!")
    tx.executeSql("delete from Agencia where id = '" + document.getElementById('id_delete').value + "'");
    agencia_view();
}



0
function limpar() {
    if (document.getElementById('nome_pacote').value != "" || document.getElementById('quantidade_estoque').value != "" || document.getElementById('pacote_preco').value != "") {
        document.getElementById('nome_pacote').value = "";
        document.getElementById('quantidade_estoque').value = "";
        document.getElementById('pacote_preco').value = "";
    }
}

function abrir_tela_cadastro() {
    $("#menu").hide();//escode tela menu
    $("#tela_cadastro").show(); // mostra tela de cadastro
}

function fechar_tela_cadastro() {
    $("#menu").show();//escode tela menu
    $("#tela_cadastro").hide(); // mostra tela de cadastro
}

function abrir_tela_lista() {
    $("#menu").hide();//escode tela menu
    $("#tela_lista").show(); // mostra tela lista
}

function fechar_tela_lista() {
    $("#menu").show();//escode tela menu
    $("#tela_lista").hide(); // mostra tela lista
}

function abrir_tela_carrinho() {
    $("#menu").hide();//escode tela menu
    $("#tela_carrinho").show(); // mostra tela lista
}

function fechar_tela_carrinho() {
    $("#menu").show();//escode tela menu
    $("#tela_carrinho").hide(); // mostra tela lista
}
function fechar_tela_compra() {
    $("#tela_compra").hide();
    $("#tela_lista").show();
}

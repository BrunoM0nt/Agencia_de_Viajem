app.initialize();

var db = window.openDatabase("Database", "1.0", "Agencia", 2000);
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
    tx.executeSql('CREATE TABLE IF NOT EXISTS Agencia(id INTEGER PRIMARY KEY, nome VARCHAR(50), qtd_estoque NUM(15),preco NUM(15))');
}

function agencia_insert() {
    db.transaction(agencia_insert_db, errorDB, successDB)
}

function agencia_insert_db(tx) {
    var nome = $("#nome_pacote").val();
    var qtd_estoque = $("#quantidade_estoque").val();
    var preco = $("#pacote_preco").val();
    tx.executeSql('INSERT INTO Agencia (nome,qtd_estoque,preco) VALUES ("' + nome + '","' + qtd_estoque + '","' + preco + '")');
}


function abrir_tela_cadastro() {
    $("#menu").hide();//escode tela menu
    $("#tela_cadastro").show(); // mostra tela de cadastro

}

function abrir_tela_lista() {
    $("#menu").hide();//escode tela menu
    $("#tela_lista").show(); // mostra tela lista

}

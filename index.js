const express = require('express');
const expressMongoDb = require('express-mongo-db');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;

const app = express();

//cria conexão com o banco de dados
//e a disponibiliza na variável req.db
app.use(expressMongoDb('mongodb://usuarios:usuarios123@165.227.221.155/usuarios'));

//converte os dados presentes no corpo da requisição em JSON
//e os disponibiliza na variável req.body
app.use(bodyParser.json());

//adiciona o header Access-Control-Allow-Origin:*
//que libera acesso para essa API por qualquer domínio
app.use(cors());

// busca todos os usuarios
app.get('/usuarios', (req, res) => {
    req.db.collection('usuario').find().toArray((err, data) => {
        if(err){
            res.status(500).send();
            return;
        }

        res.send(data);
    });
});

// busca um usuario pelo id
app.get('/usuario/:id', (req, res) => {
    let query = {
        _id: ObjectID(req.params.id)
    };

    
    req.db.collection('usuario').findOne(query, (err, data) => {
        if(err){
            res.status(500).send();
            return;
        }

        if(!data){
            res.status(404).send();
            return;
        }

        res.send(data);
    });
});
// busca um usuario pelo nome
app.get('/usuario/nome/:nome', (req, res) => {
    
    let query = {
        nome: {'$regex': `.*${req.params.nome}.*`}
    };
    
    req.db.collection('usuario').findOne(query, (err, data) => {
        if(err){
            res.status(500).send();
            return;
        }

        if(!data){
            res.status(404).send();
            return;
        }

        res.send(data);
    });
});
// busca um usuario pelo email
app.get('/usuario/email/:email', (req, res) => {
    
    let query = {
        email: {'$regex': `.*${req.params.email}.*`}
    };
    
    req.db.collection('usuario').findOne(query, (err, data) => {
        if(err){
            res.status(500).send();
            return;
        }

        if(!data){
            res.status(404).send();
            return;
        }

        res.send(data);
    });
});



//insere um novo cadastro
app.post('/cadastro', (req, res) => {
    //remove dados indesejados do body
    let cadastro = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        nascimento: req.body.nascimento
    };

    // exemplo de validação de email
    if(req.body.email.indexOf('@') == -1){
        res.status(400).send({mensagem: 'Email inválido'});
        return;
    }

    req.db.collection('usuario').insert(cadastro, (err) => {
        if(err){
            res.status(500).send();
            return;
        }

        res.send(req.body);
    });
});

// atualiza um usuario pelo id
app.put('/usuario/:id', (req, res) => {
    let query = {
        _id: ObjectID(req.params.id)
    };

    let cadastro = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        nascimento: req.body.nascimento
    };

    req.db.collection('usuario').updateOne(query, cadastro, (err, data) => {
        if(err){
            res.status(500).send();
            return;
        }

        res.send(data);
    });
});

//atualiza um usuario pelo nome

app.put('/usuario/nome/:nome', (req, res) => {
    
    let query = {
        nome: {'$regex': `.*${req.params.nome}.*`}
    };
    let cadastro = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        nascimento: req.body.nascimento
    };

    req.db.collection('usuario').updateOne(query, cadastro, (err, data) => {
        if(err){
            res.status(500).send();
            return;
        }

        res.send(data);
    });
});

// deleta um usuario pelo id
app.delete('/usuario/:id', (req, res) => {
    let query = {
        _id: ObjectID(req.params.id)
    };

    req.db.collection('usuario').deleteOne(query, (err, data) => {
        if(err){
            res.status(500).send();
            return;
        }

        res.send(data);
    });
});

app.listen(process.env.PORT || 3000, () => console.log('Aplicação Concluida'));
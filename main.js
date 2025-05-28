const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config();

const UserAccountService = require("./services/useraccount")

const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // application/x-www-form-urlencoded
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('combined')); // toutes les requêtes HTTP dans le log du serveur
app.use(express.text()); // pour parser le body en texte brut

const port = process.env.PORT || 3333;

var dsn = process.env.CONNECTION_STRING

console.log(`Using database ${dsn}`)
const db = new pg.Pool({ connectionString:  dsn})

const userAccountService = new UserAccountService(db)
const jwt = require('./jwt')(userAccountService)
require('./api/useraccount')(app, userAccountService, jwt)
require('./api/IGDB')(app);

const seedDatabase = async () => require('./datamodel/seeder')(userAccountService)
if (require.main === module) {
    seedDatabase().then( () =>
        app.listen(port, () =>
            console.log(`Listening on the port ${port}`)
        )
    )
}
module.exports= { app, seedDatabase, userAccountService }
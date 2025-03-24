const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config();

const CarService = require("./services/car")
const UserAccountService = require("./services/useraccount")

const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // application/x-www-form-urlencoded
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('combined')); // toutes les requêtes HTTP dans le log du serveur

const port = process.env.PORT || 3333;

var dsn = process.env.CONNECTION_STRING
if (dsn === undefined) {
    const { env } = process;
    const read_base64_json = function(varName) {
        try {
            return JSON.parse(Buffer.from(env[varName], "base64").toString())
        } catch (err) {
            throw new Error(`no ${varName} environment variable`)
        }
    };
    const variables = read_base64_json('PLATFORM_VARIABLES')
    dsn = variables["CONNECTION_STRING"]
}

console.log(`Using database ${dsn}`)
const db = new pg.Pool({ connectionString:  dsn})

const carService = new CarService(db)
const userAccountService = new UserAccountService(db)
const jwt = require('./jwt')(userAccountService)
require('./api/car')(app, carService, jwt)
require('./api/useraccount')(app, userAccountService, jwt)

const seedDatabase = async () => require('./datamodel/seeder')(userAccountService, carService)
if (require.main === module) {
    seedDatabase().then( () =>
        app.listen(port, () =>
            console.log(`Listening on the port ${port}`)
        )
    )
}
module.exports= { app, seedDatabase, userAccountService }
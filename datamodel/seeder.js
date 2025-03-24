module.exports = async (userAccountService, carService) => {
    return new Promise(async (resolve, reject) => {
        console.log("Seeding database...")
        try {
            await userAccountService.dao.db.query("CREATE TABLE useraccount(id SERIAL PRIMARY KEY, displayname TEXT NOT NULL, login TEXT NOT NULL, password TEXT NOT NULL)")
            await carService.dao.db.query(`CREATE TABLE car (id SERIAL PRIMARY KEY, make TEXT, model TEXT, 
                                        isrunning BOOLEAN, price NUMERIC, builddate DATE,
                                        useraccount_id INTEGER REFERENCES useraccount(id))`)
            resolve()
        }catch(e)  {
            if (e.code === "42P07") { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
                resolve()
            } else {
                console.log(e)
                reject(e)
            }
        }
    })
}
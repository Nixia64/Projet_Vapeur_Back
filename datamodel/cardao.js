const BaseDAO = require('./basedao')

module.exports = class CarDAO extends BaseDAO {
    constructor(db) {
        super(db, "car")
    }
    insert(car) {
        return this.db.query("INSERT INTO car(make,model,isrunning,price,builddate,useraccount_id) VALUES ($1,$2,$3,$4,$5,$6)",
            [car.make, car.model, car.isrunning, car.price, car.builddate, car.useraccount_id])
    }
    getAll(user) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM car WHERE useraccount_id=$1 ORDER BY make,model", [user.id])
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }
    update(car) {
        return this.db.query("UPDATE car SET make=$2,model=$3,isrunning=$4,price=$5,builddate=$6 WHERE id=$1",
            [car.id, car.make, car.model, car.isrunning, car.price, car.builddate])
    }

}
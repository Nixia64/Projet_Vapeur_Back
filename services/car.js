const CarDAO = require("../datamodel/cardao")

module.exports = class CarService {
    constructor(db) {
        this.dao = new CarDAO(db)
    }

    isValid(car) {
        if ((car.make === undefined) || (car.model === undefined) || (car.price === undefined)) return false
        car.make = car.make.trim()
        if (car.make === "") return false
        car.model = car.model.trim()
        if (car.model === "") return false
        if ((car.price != null) && (car.price < 0)) return false
        if (car.builddate != null) {
            if (car.builddate instanceof String) {
                car.builddate = new Date(car.builddate)
            }
            if (car.builddate >= new Date()) return false
        }
        return true
    }
}
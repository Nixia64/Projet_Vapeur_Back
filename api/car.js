module.exports = (app, svc, jwt) => {
    app.get("/car", jwt.validateJWT, async (req, res) => {
        res.json(await svc.dao.getAll(req.user))
    })
    app.get("/car/:id", jwt.validateJWT, async (req, res) => {
        try {
            const car = await svc.dao.getById(req.params.id)
            if (car === undefined) {
                return res.status(404).end()
            }
            if (car.useraccount_id !== req.user.id) {
                return res.status(403).end()
            }
            return res.json(car)
        } catch (e) {
            console.log(e)
            res.status(400).end()
        }
    })

    app.post("/car", jwt.validateJWT, (req, res) => {
        const car = req.body
        if (!svc.isValid(car))  {
            res.status(400).end()
            return
        }
        car.useraccount_id = req.user.id
        svc.dao.insert(car)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.delete("/car/:id", jwt.validateJWT, async (req, res) => {
        try {
        const car = await svc.dao.getById(req.params.id)
        if (car === undefined) {
            return res.status(404).end()
        }
        if (car.useraccount_id !== req.user.id) {
            return res.status(403).end()
        }
        svc.dao.delete(req.params.id)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
        } catch (e) {
            console.log(e)
            res.status(400).end()
        }
    })
    app.put("/car", jwt.validateJWT, async (req, res) => {
        const car = req.body
        if ((car.id === undefined) || (car.id == null) || (!svc.isValid(car))) {
            return res.status(400).end()
        }
        const prevCar = await svc.dao.getById(car.id)
        if (prevCar === undefined) {
            return res.status(404).end()
        }
        if (prevCar.useraccount_id !== req.user.id) {
            return res.status(403).end()
        }
        svc.dao.update(car)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
}

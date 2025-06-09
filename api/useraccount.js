module.exports = (app, svc, jwt) => {

    app.post('/useraccount/authenticate', async (req, res) => {
        const {login, password} = req.body
        if ((login === undefined) || (password === undefined)) {
            return res.status(400).end()
        }
        svc.validatePassword(login, password)
            .then(user => {
                if (user == null) {
                    res.status(401).end()
                    return
                }
                console.log(`${user.displayname} authenticated`)
                return res.json({
                    'login' : user.login,
                    'displayname': user.displayname,
                    'token': jwt.generateJWT(login)
                })
            })
            .catch(e => {
                console.log(e)
                return res.status(500).end()
            })
    })

    app.post('/useraccount', async (req, res) => {
        const {displayname, login, password} = req.body
        if ((displayname === undefined) || (login === undefined) || (password === undefined)) {
            console.log(req.body);
            return res.status(400).end()
        }
        const user = await svc.get(login)
        if (user != null) {
            return res.status(400).end()
        }
        svc.insert(displayname, login, password)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                return res.status(500).end()
            })
    })

    app.get("/useraccount/refreshtoken", jwt.validateJWT, (req, res) => {
        res.json({'token': jwt.generateJWT(req.user.login)})
    })
    
    app.get("/useraccount/:login", async (req, res) => {
        return res.status(await svc.get(req.params.login) == null ? 404 : 200).end()
    })

    // Endpoint pour récupérer les infos du user connecté
    app.get("/useraccount/me", jwt.validateJWT, async (req, res) => {
        try {
            // req.user est rempli par le middleware JWT, il contient au moins le login
            const user = await svc.get(req.user.login);
            if (!user) return res.status(404).end();
            res.json({
                displayname: user.displayname,
                login: user.login
            });
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    });

}
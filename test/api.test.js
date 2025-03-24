const chai = require('chai')
const chaiHttp = require('chai-http');
const { app, seedDatabase, userAccountService} = require("../main");   // TODO : remplacer par le nom de votre script principal
const {expect} = require("chai");
const should = chai.should();

chai.use(chaiHttp);

describe('API Tests', function() {
    this.timeout(5000);
    let token = '';

    // Connexion à l'API pour récupérer le token JWT
    before( (done) => {
        seedDatabase().then( async () => {
            console.log("Creating test user");
            userAccountService.insert('User1', 'user1', 'default').then( () => // TODO adapter à votre fonction insert()
                chai.request(app)
                    .post('/useraccount/authenticate') // TODO : remplacer par votre URL d'authentification
                    .send({login: 'user1', password: 'default'}) // TODO : remplacer par les champs attendus par votre route
                    .end((err, res) => {
                        res.should.have.status(200);
                        token = res.body.token;
                        done();
                    })
        )})
    });

    // Suppression de l'utilisateur utilisé à la fin des tests
    after( (done) => {
        console.log("Deleting test user")
        userAccountService.get('user1').then(
            (user) => {
                userAccountService.dao.delete(user.id).then(done())
            }
        )
    })

    // Test avec un token JWT valide
    it('should allow access with valid token', (done) => {
        chai.request(app)
            .get('/car') // TODO : remplacer par une de vos routes protégée par validateJWT
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array'); // TODO : remplacer array par object si votre route retourne un objet
                res.body.should.have.lengthOf(0); // TODO remplacer par votre test
                done();
            });
    });

    // Test avec un token JWT non valide
    it('should deny access with invalid token', (done) => {
        chai.request(app)
            .get('/car') // TODO : remplacer par une de vos routes protégée par validateJWT
            .set('Authorization', 'Bearer wrongtoken')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    // TODO : remplacer les tests ci-dessous par vos propres tests

    // Tests insertion de données
    it('should insert a Car', (done) => {
        chai.request(app)
            .post('/car')
            .set('Authorization', `Bearer ${token}`)
            .send({make: 'Renault', model: 'Clio', price: 1234.5, builddate: '2019/06/02'})
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
    it('should not insert a Car without "make"', (done) => {
        chai.request(app)
            .post('/car')
            .set('Authorization', `Bearer ${token}`)
            .send({model: 'Clio', price: 1234.5, builddate: '2019/06/02'})
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });
    it('should not insert a Car without "model"', (done) => {
        chai.request(app)
            .post('/car')
            .set('Authorization', `Bearer ${token}`)
            .send({make: 'Renault', price: 1234.5, builddate: '2019/06/02'})
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });
    it('should not insert a Car without "price"', (done) => {
        chai.request(app)
            .post('/car')
            .set('Authorization', `Bearer ${token}`)
            .send({make: 'Renault', model: 'Clio', builddate: '2019/06/02'})
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    // Tests sélection de données
    var car
    it('should return only one Car', (done) => {
        chai.request(app)
            .get('/car')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.lengthOf(1);
                car = res.body[0]
                done()
            });
    });
    it('should return the inserted Car', (done) => {
        chai.request(app)
            .get(`/car/${car.id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an("object")
                res.body.should.include({
                    'make' : 'Renault',
                    'model': 'Clio',
                    'price': '1234.5',
                })
                done()
            });
    });
    it('should not return a Car (invalid id)', (done) => {
        chai.request(app)
            .get(`/car/kopooapz`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(400);
                done()
            });
    });
    it('should not return a Car (unknown id)', (done) => {
        chai.request(app)
            .get(`/car/12345`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(404);
                done()
            });
    });

    // Tests suppression de données
    it('should delete a Car', (done) => {
        chai.request(app)
            .delete(`/car/${car.id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                done()
            });
    });
    it('should not delete a Car (unknown id)', (done) => {
        chai.request(app)
            .delete(`/car/${car.id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(404);
                done()
            });
    });
    it('should not delete a Car (invalid id)', (done) => {
        chai.request(app)
            .delete(`/car/deaazaz`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(400);
                done()
            });
    });

});

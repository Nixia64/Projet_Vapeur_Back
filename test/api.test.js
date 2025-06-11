const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, seedDatabase, userAccountService } = require("../main");
const { expect } = require("chai");
const should = chai.should();

chai.use(chaiHttp);

describe('API Tests', function() {
    this.timeout(10000);
    let token = '';

    // Création d'un utilisateur de test et récupération du token JWT
    before((done) => {
        seedDatabase().then(async () => {
            // Supprime l'utilisateur s'il existe déjà
            const existing = await userAccountService.get('user1');
            if (existing) await userAccountService.dao.delete(existing.id);
            await userAccountService.insert('User1', 'user1', 'default');
            chai.request(app)
                .post('/useraccount/authenticate')
                .send({ login: 'user1', password: 'default' })
                .end((err, res) => {
                    res.should.have.status(200);
                    token = res.body.token;
                    done();
                });
        });
    });

    // Suppression de l'utilisateur utilisé à la fin des tests
    after((done) => {
        userAccountService.get('user1').then(
            (user) => {
                if (user) {
                    userAccountService.dao.delete(user.id).then(() => done());
                } else {
                    done();
                }
            }
        );
    });

    // Test IGDB genres (GET)
    it('should fetch IGDB genres', (done) => {
        chai.request(app)
            .get('/api/igdb/genres')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });

    // Test IGDB games (POST)
    it('should fetch IGDB games', (done) => {
        const body = `
            fields name;
            limit 1;
        `;
        chai.request(app)
            .post('/api/igdb/games')
            .set('Content-Type', 'text/plain')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                if (res.body.length > 0) {
                    res.body[0].should.have.property('name');
                }
                done();
            });
    });

    // Test accès protégé avec token valide
    it('should allow access to /api/library with valid token', (done) => {
        chai.request(app)
            .get('/api/library')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });

    // Test accès protégé avec token invalide
    it('should deny access to /api/library with invalid token', (done) => {
        chai.request(app)
            .get('/api/library')
            .set('Authorization', 'Bearer wrongtoken')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

});

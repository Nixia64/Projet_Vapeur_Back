const UserGameLibraryDAO = require('../datamodel/usergamelibrarydao');

module.exports = class UserGameLibraryService {
    constructor(db) {
        this.dao = new UserGameLibraryDAO(db);
    }

    async addGame(user_id, igdb_id, game_name) {
        // Optionnel : éviter les doublons
        if (await this.dao.hasGame(user_id, igdb_id)) {
            return null;
        }
        return this.dao.addGame(user_id, igdb_id, game_name);
    }

    async getGames(user_id) {
        return this.dao.getGamesByUser(user_id);
    }

    async removeGame(user_id, igdb_id) {
        return this.dao.removeGame(user_id, igdb_id);
    }
};
const UserGameLibrary = require('./usergamelibrary');

module.exports = class UserGameLibraryDAO {
    constructor(db) {
        this.db = db;
    }

    async addGame(user_id, igdb_id, game_name) {
        const result = await this.db.query(
            `INSERT INTO usergamelibrary (user_id, igdb_id, game_name) VALUES ($1, $2, $3) RETURNING id`,
            [user_id, igdb_id, game_name]
        );
        return result.rows[0]?.id;
    }

    async getGamesByUser(user_id) {
        const result = await this.db.query(
            `SELECT * FROM usergamelibrary WHERE user_id = $1 ORDER BY added_at DESC`,
            [user_id]
        );
        return result.rows.map(row => new UserGameLibrary(row));
    }

    async removeGame(user_id, igdb_id) {
        await this.db.query(
            `DELETE FROM usergamelibrary WHERE user_id = $1 AND igdb_id = $2`,
            [user_id, igdb_id]
        );
    }

    async hasGame(user_id, igdb_id) {
        const result = await this.db.query(
            `SELECT * FROM usergamelibrary WHERE user_id = $1 AND igdb_id = $2`,
            [user_id, igdb_id]
        );
        return result.rows.length > 0;
    }
};
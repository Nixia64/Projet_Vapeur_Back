const UserGameLibrary = require('./usergamelibrary');

module.exports = class UserGameLibraryDAO {
    constructor(db) {
        this.db = db;
    }

    async addGame(user_id, igdb_id, game_name, cover_url) {
        const result = await this.db.query(
            `INSERT INTO usergamelibrary (user_id, igdb_id, game_name, cover_url) VALUES ($1, $2, $3, $4) RETURNING id`,
            [user_id, igdb_id, game_name, cover_url]
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
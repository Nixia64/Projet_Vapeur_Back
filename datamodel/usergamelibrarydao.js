const UserGameLibrary = require('./usergamelibrary');

module.exports = class UserGameLibraryDAO {
    constructor(db) {
        this.db = db;
    }

    async addGame(user_id, igdb_id, game_name, cover_url) {
        const result = await this.db.run(
            `INSERT INTO usergamelibrary (user_id, igdb_id, game_name, cover_url) VALUES (?, ?, ?, ?)`,
            [user_id, igdb_id, game_name, cover_url]
        );
        return result.lastID;
    }

    async getGamesByUser(user_id) {
        const rows = await this.db.all(
            `SELECT * FROM usergamelibrary WHERE user_id = ? ORDER BY added_at DESC`,
            [user_id]
        );
        return rows.map(row => new UserGameLibrary(row));
    }

    async removeGame(user_id, igdb_id) {
        await this.db.run(
            `DELETE FROM usergamelibrary WHERE user_id = ? AND igdb_id = ?`,
            [user_id, igdb_id]
        );
    }

    async hasGame(user_id, igdb_id) {
        const row = await this.db.get(
            `SELECT * FROM usergamelibrary WHERE user_id = ? AND igdb_id = ?`,
            [user_id, igdb_id]
        );
        return !!row;
    }
};
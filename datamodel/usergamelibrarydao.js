const UserGameLibrary = require('./usergamelibrary');

module.exports = class UserGameLibraryDAO {
    constructor(db) {
        this.db = db;
    }

    async addGame(user_id, igdb_id, game_name, cover_url, developer, release_date, rating, genres, themes, modes, perspectives, description) {
        const result = await this.db.query(
            `INSERT INTO usergamelibrary
            (user_id, igdb_id, game_name, cover_url, developer, release_date, rating, genres, themes, modes, perspectives, description)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
            RETURNING id`,
            [
                user_id,
                igdb_id,
                game_name,
                cover_url,
                developer,
                release_date,
                rating,
                JSON.stringify(genres),
                JSON.stringify(themes),
                JSON.stringify(modes),
                JSON.stringify(perspectives),
                description
            ]
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
            `SELECT 1 FROM usergamelibrary WHERE user_id = $1 AND igdb_id = $2`,
            [user_id, igdb_id]
        );
        return result.rows.length > 0;
    }
};
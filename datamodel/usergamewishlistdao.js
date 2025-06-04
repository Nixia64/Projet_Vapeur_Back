const UserGameWishlist = require('./usergamewishlist');

module.exports = class UserGameWishlistDAO {
    constructor(db) {
        this.db = db;
    }

    async addGame(user_id, igdb_id, game_name, cover_url, developer, release_date, rating, genres, themes, modes, perspectives, description) {
        // Récupère le max display_index pour l'utilisateur
        const { rows } = await this.db.query(
            `SELECT COALESCE(MAX(display_index), 0) AS maxidx FROM usergamewishlist WHERE user_id = $1`, [user_id]
        );
        const display_index = rows[0].maxidx + 1;

        const result = await this.db.query(
            `INSERT INTO usergamewishlist
            (user_id, igdb_id, game_name, cover_url, developer, release_date, rating, genres, themes, modes, perspectives, description, display_index)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
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
                description,
                display_index
            ]
        );
        return result.rows[0]?.id;
    }

    async getGamesByUser(user_id) {
        const result = await this.db.query(
            `SELECT * FROM usergamewishlist WHERE user_id = $1 ORDER BY display_index ASC`,
            [user_id]
        );
        return result.rows.map(row => new UserGameWishlist(row));
    }

    async removeGame(user_id, igdb_id) {
        await this.db.query(
            `DELETE FROM usergamewishlist WHERE user_id = $1 AND igdb_id = $2`,
            [user_id, igdb_id]
        );
    }

    async hasGame(user_id, igdb_id) {
        const result = await this.db.query(
            `SELECT 1 FROM usergamewishlist WHERE user_id = $1 AND igdb_id = $2`,
            [user_id, igdb_id]
        );
        return result.rows.length > 0;
    }
};
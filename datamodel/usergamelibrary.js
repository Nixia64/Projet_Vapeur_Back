class UserGameLibrary {
    constructor({ id, user_id, igdb_id, game_name, cover_url, added_at }) {
        this.id = id;
        this.user_id = user_id;
        this.igdb_id = igdb_id;
        this.game_name = game_name;
        this.cover_url = cover_url;
        this.added_at = added_at;
    }
}

module.exports = UserGameLibrary;
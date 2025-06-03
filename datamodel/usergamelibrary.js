class UserGameLibrary {
    constructor({
        id, user_id, igdb_id, game_name, cover_url, developer,
        release_date, rating, genres, themes, modes, perspectives,
        description, added_at
    }) {
        this.id = id;
        this.user_id = user_id;
        this.igdb_id = igdb_id;
        this.game_name = game_name;
        this.cover_url = cover_url;
        this.developer = developer;
        this.release_date = release_date;
        this.rating = rating;
        this.genres = genres;
        this.themes = themes;
        this.modes = modes;
        this.perspectives = perspectives;
        this.description = description;
        this.added_at = added_at;
    }
}

module.exports = UserGameLibrary;
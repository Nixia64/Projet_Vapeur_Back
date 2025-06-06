module.exports = async (userAccountService) => {
    return new Promise(async (resolve, reject) => {
        console.log("Seeding database...")
        try {
            // Création de la table useraccount
            await userAccountService.dao.db.query(`
                CREATE TABLE IF NOT EXISTS useraccount(
                    id SERIAL PRIMARY KEY,
                    displayname TEXT NOT NULL,
                    login TEXT NOT NULL,
                    password TEXT NOT NULL
                )
            `);

            // Création de la table usergamelibrary
            await userAccountService.dao.db.query(`
                CREATE TABLE IF NOT EXISTS usergamelibrary (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES useraccount(id) ON DELETE CASCADE,
                    igdb_id INTEGER NOT NULL,
                    game_name TEXT NOT NULL,
                    cover_url TEXT,
                    developer TEXT,
                    release_date BIGINT,
                    rating REAL,
                    genres JSONB,
                    themes JSONB,
                    modes JSONB,
                    perspectives JSONB,
                    description TEXT,
                    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Index unique pour éviter les doublons (un même jeu par utilisateur)
            await userAccountService.dao.db.query(`
                CREATE UNIQUE INDEX IF NOT EXISTS idx_user_game_unique ON usergamelibrary(user_id, igdb_id)
            `);

            // Création de la table usergamewishlist
            await userAccountService.dao.db.query(`
                CREATE TABLE IF NOT EXISTS usergamewishlist (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES useraccount(id) ON DELETE CASCADE,
                    igdb_id INTEGER NOT NULL,
                    game_name TEXT NOT NULL,
                    cover_url TEXT,
                    developer TEXT,
                    release_date BIGINT,
                    rating REAL,
                    genres JSONB,
                    themes JSONB,
                    modes JSONB,
                    perspectives JSONB,
                    description TEXT,
                    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    display_index INTEGER DEFAULT 0
                )
            `);

            // Index unique pour éviter les doublons (un même jeu par utilisateur)
            await userAccountService.dao.db.query(`
                CREATE UNIQUE INDEX IF NOT EXISTS idx_user_wishlist_unique ON usergamewishlist(user_id, igdb_id)
            `);

            resolve();
        } catch(e)  {
            if (e.code === "42P07") { // TABLE ALREADY EXISTS
                resolve();
            } else {
                console.log(e);
                reject(e);
            }
        }
        try {
            // Vérifie si l'utilisateur admin existe déjà
            const existingAdmin = await userAccountService.get("admin");
            if (!existingAdmin) {
                await userAccountService.insert("admin", "admin", "admin");
            }
        } catch(e) {
            console.log(e);
            reject(e);
        }
    });
}
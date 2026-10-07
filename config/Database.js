import { Sequelize } from "sequelize";

const db = new Sequelize('db_konter', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;
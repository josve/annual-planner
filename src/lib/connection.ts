import "server-only";
import mysql, { Pool, PoolConnection } from "mysql2/promise";

export default class Connection {
    private static instance: Connection;
    private readonly pool: Pool;

    private constructor() {
        const poolConfig: mysql.PoolOptions = {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10,
            timezone: "+01:00",
        };

        this.pool = mysql.createPool(poolConfig);
    }

    public static getInstance(): Connection {
        if (!this.instance) {
            this.instance = new Connection();
        }

        return this.instance;
    }

    public async getConnection(): Promise<PoolConnection> {
        return this.pool.getConnection();
    }

    public async closePool(): Promise<void> {
        await this.pool.end();
    }
}

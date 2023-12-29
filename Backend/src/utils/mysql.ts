import { createPool, FieldPacket, OkPacket, Pool, PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise'

export class MySql {
    private static _mysql: MySql | undefined;
    private pool: Pool;
    private total_connections_limit: number = 0;
    private active_connections: number = 0;
    private constructor() {
        this.total_connections_limit = Number(process.env['DB_CONN_LIMIT']);
        this.pool = createPool({
            host: 'localhost',
            user: 'root',
            // password: 'root'
            password: 'Arham_.2@'
        });
        this.pool.on('connection', () => {
            this.active_connections++;
        });
        this.pool.on('release', () => {
            this.active_connections--;
        })
    }
    public getConnectionStatusString() {
        return `<h1>Connection stats</h1>
        <p><strong>Total Limit: </strong> ${this.total_connections_limit}</p>
        <p><strong>Currently connected: </strong> ${this.active_connections}</p>
        `;
    }
    static getConfig() {

        return {
            host: process.env['DB_HOST'] || '',
            database: process.env['database'] || ''
        }
    }
    static getMysqlInstance() {
        if (!this._mysql) {
            this._mysql = new MySql();
        }
        return this._mysql;
    }
    public async poolQuery(formattedQuery: string) {
        return new Promise<[OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]]>(async (res, rej) => {
            try {
                let rest = await this.pool.query(formattedQuery);
                res(rest)
            } catch (err) {
                rej(err);
            }
        })
    }
    /**
     * Creat a new connection from the pool
     * @returns returns a connection from the pool
     */
    public async getConnectionFromPool() {
        return new Promise<PoolConnection>(async (res, rej) => {
            try {
                let c = await this.pool.getConnection();
                res(c);
            } catch (err) {
                rej(err);
            }
        })
    }
    /**
     * Run multiple queries with a Transaction
     * @param formattedQueries array of formatted queries
     * @returns message of done
     */
    public async poolQueriesTransaction(formattedQueries: string[]) {
        return new Promise<string>(async (res, rej) => {
            let conn = await this.pool.getConnection().catch(_ => undefined);
            try {
                if (!conn)
                    throw new Error("could not establish a connection");
                await conn.beginTransaction();
                for (const q of formattedQueries)
                    await conn.execute(q);
                await conn.commit();
                conn.release();
                res("done")
            } catch (err) {
                await conn?.rollback();
                conn?.release();
                rej(err);
            }
        })
    }
    public dispose(): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                await this.pool.end();
                resolve("done");
            } catch (err) {
                reject(err);
            }
        })
    }
}
import { DataSource, DataSourceOptions } from "typeorm"
import { rootFolder } from "../../rootFolder";

export let AppDataStore: DataSource | null = null

export async function initDbStore() : Promise<[DataSource,unknown|null]> {
    const dbSettings ={
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [getDirEntities()],        
        synchronize: true,
        logging: false
    } as any;
    try {
        AppDataStore = new DataSource(dbSettings)
        await AppDataStore.initialize()
        console.log(`In memory Db initialized`);

        return [AppDataStore, null];
    } catch (err ) {
        console.error(`dbConnectionManager - error initializing db. Error: ${err.message}`)
        throw [null, err.message];
    }
}


function getDirEntities() {
    const isTsNode =  true;
    const dirNameEntities = isTsNode ? rootFolder + '/src/entities/*.ts' : rootFolder + '/src/entities/*.js';
    return dirNameEntities
}
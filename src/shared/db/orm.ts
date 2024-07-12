import { MikroORM } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'], //le dice que las entidades son todos los archivos que tengan .entity 
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'cine_UTN',
  type: 'mysql',
  clientUrl: 'mysql://root:root@localhost:3306/cine_UTN',
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    //never in production
    disableForeignKeys: true, //desactiva las FK al momento de crear la base para que no haya problemas
    createForeignKeyConstraints: true, //crea las FK que se salteo en el comando anterior.
    ignoreSchema: [],
  },
})

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator()
  /*   
  await generator.dropSchema()
  await generator.createSchema()
  */
  await generator.updateSchema()
}

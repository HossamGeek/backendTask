export const config = {
  db: {
    type: 'mysql',
    host: 'localhost',
    database: 'article-app',
    port: 3306,
    username: 'root',
    password: '123456',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  },
};

# 前端
- [flutter](https://github.com/lazybo-code/micro_chat_flutter)

# nodjs - nestjs
接口地址: http://localhost:3000/api-doc

# 配置mysql
在根目录建立: ormconfig.json
```json
{
  "type": "mysql",
  "host": "地址",
  "port": 端口,
  "username": "账号",
  "password": "密码",
  "database": "数据库",
  "entities": ["dist/**/*.entity{.ts,.js}"],
  "synchronize": true
}
```

在根目录建立: .env
```
MONGODB=mongodb://host/name

REDIS_HOST=
REDIS_PORT=
REDIS_NAME=
```
# 安装依赖
```
 yarn install or npm install
```

# 运行
```
 yarn start
```

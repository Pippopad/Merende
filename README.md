# Merende
Web App che permette di ordinare la merende online

## Installazione
Usa lo script [sql](https://github.com/Pippopad/Merende/blob/master/merende.sql) per configurare il database.

Inizializza il package:
```shell
$ npm init
```

Installa i pacchetti usati dall'API con il seguente comando:
```shell
$ npm install crypto-js dotenv express jsonwebtoken mysql
```

Poi crea un file '.env' nella cartella principale:
```code
DB_HOST = <ip_del_database>
DB_USER = <nome_utente>
DB_PASSWORD = <password>
DB_NAME = <nome_del_database>

JWT_KEY = <chiave_per_criptare_i_token_di_accesso>
AUTH_KEY = <chiave_per_criptare_le_password_degli_utenti>
```

Imposta lo script di partenza nel file package.json
```json
"scripts": {
  "start": "nodemon index.js"
},
```

Fai partire il progetto:
```shell
$ npm start
```
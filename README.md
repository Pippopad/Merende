# Merende
Web App che permette di fare le ordinazioni delle merende online

## Installazione
Usa lo script [sql](https://github.com/Pippopad/Merende/blob/master/merende.sql) per configurare il database.  
Nel database sono già presenti degli utenti:
  - admin:Cartoni22
      - Amministratore
  - s23710:Cartoni22
      - 3 CI
  - s23552:password
      - 3 CI

*N.B: Per usare gli utenti predefiniti, bisogna lasciare la AUTH_KEY al valore predefinito*

Installa i pacchetti usati dall'API con il seguente comando:
```shell
$ npm install
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
*N.B: Il valore di default di AUTH_KEY è `g5Ru4eTv6pvI2t1YD43w2W4tvdDvo6R`*

Fai partire il progetto:
```shell
$ npm start
```
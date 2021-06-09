# Техническое задание | ERP.AERO | Node.js dev

## Развёртывание
```shell
# Инициализация сервера
npm install

# Восстановление базы данных
mysql -u [user] -p xim_test < xim_test_dump.sql
```
Для соединения с базой данных необходимо указать значения параметров DB_SERVER_ADDRESS, DB_USER_NAME, DB_PASSWORD в файле .env

***

## Задача:
Сделать сервис с REST API.
- Авторизация по bearer токену (/info, /latency, /logout, /file(все роуты) );
- Настроить CORS для доступа с любого домена;
- DB – Mysql;
- Токен создавать при каждой авторизации, действителен 10 минут. Продлевать по
  истечению, с помощью refresh токена;
- Реализовать на основе фреймворка express js;

***

## API:
### Users API
- [x] `/signin` [POST] - запрос bearer токена по id и паролю;
- [x] `/signin/new_token` [POST] - обновление bearer токена по refresh токену
- [x] `/signup` [POST] - регистрация нового пользователя;
- [x] `/info` [GET] - возвращает id пользователя;
- [x] `/logout` [GET] - выйти из системы;
  > - Поля id и password, id это номер телефона или email;
  > - При удачной регистрации вернуть пару bearer токен и refresh токен;
  > - После выхода необходимо получить новый токен;
  > - Старый должен перестать работать;
### Files API
- [x] `/file/upload` [POST] - добавление нового файла в систему и запись параметров файла в базу: название, расширение, MIME type, размер, дата загрузки;
- [x] `/file/list` [GET] выводит список файлов и их параметров из базы с использованием пагинации с размером страницы, указанного в передаваемом параметре list_size, по умолчанию 10 записей на страницу, если параметр пустой. Номер страницы указан в параметре page, по умолчанию 1, если не задан;
- [ ] `/file/delete/:id` [DELETE] - удаляет документ из базы и локального хранилища;
- [ ] `/file/:id` [GET] - вывод информации о выбранном файле;
- [ ] `/file/download/:id` [GET] - скачивание конкретного файла;
- [ ] `/file/update/:id` [PUT] - обновление текущего документа на новый в базе и локальном хранилище;
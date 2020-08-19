## Как подключиться к серверу?
1) в package.json (client) необходимо прописать "proxy": "https://damp-fjord-03984.herokuapp.com" (при разворачивании локально был бы localhost)
2) при успешной авторизации(/login) вам возвращается токен, по которому идентифицируется юзер, - токен необходимо сохранить в localstorage (client) и отправлять на сервер при каждом запросе (кроме регистрации и авторизации):
{ header = { Authorization : Bearer ${localStorage.getItem('token') || ''} };

if fail: 401 Unauthorized
 
## authorization
method: POST,
path: '/signup',
req => {    
    username: string,
    password: string
}
res => { 
    success: true,
    token: token
}

## create new user
method: POST,
path: '/login',
req => {
    username: string,
    email: string,
    password: string
}
res => { 
    success: true
}

## get all ToDos
method: GET,
path: '/todolist'

if fail: 401 Unauthorized

## create ToDO
method: POST,
path: '/todolist',
req => {
    title: string, 
    type: string, 
    description: string, 
    date: text, 
    completed: boolean
}
res => tasks: {
    id: string, 
    title: string, 
    type:string, 
    description: string, 
    date:text, 
    completed: boolean
}

if fail: 401 Unauthorized
 
## edit ToDO
method: PUT,
path: '/todolist/:id',
где id - id ToDO
req => {
    ключ_измененного_значения: измененное_значение
}
(при необходимости, ключей может быть несколько)

## delete ToDO
method: DELETE,
path: 'todolist/:id',
где id - id ToDO
req => {
    ключ_значения: значение
}

## logout
method: GET
path: '/logout'

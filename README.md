## Как подключиться к серверу?
1) в package.json (client) необходимо прописать "proxy": "https://damp-fjord-03984.herokuapp.com"
2) при успешной авторизации(/login) вам возвращается токен, по которому идентифицируется юзер, - токен необходимо сохранить в localstorage (client) и отправлять на сервер при каждом запросе (кроме регистрации и авторизации):
{ headers: { 'Authorization': `Bearer ${localStorage.token}` || '' }

if fail: 401 Unauthorized
 
## authorization
method: POST,
path: '/login',
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
path: '/signup',
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

## create ToDo
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
 
## edit ToDo
method: PUT,
path: '/todolist/:id',
где id - id ToDO
req => {
    ключ_измененного_значения: измененное_значение
}
(при необходимости, ключей может быть несколько)

## delete ToDo
method: DELETE,
path: '/todolist/:id',
где id - id ToDO
req => {
    ключ_значения: значение
}

## get all Types
method: GET,
path: '/types'

res: "types": [ {
            "id": string,
            "name": string,
            "colorId": string
             },...]
           
colorId будет возвращаться с пустой строкой, если это поле не используете для создания типа

if fail: 401 Unauthorized

## create Type
method: POST,
path: '/types',
req => {
   name: string, 
   colorId: string, 
}
res => {
           "id": string,
           "name": string,
           "colorId": string
       }
colorId необязательное поле
if fail: 401 Unauthorized
 
## edit Type
method: PUT,
path: '/types/:id',
где id - id Type
req => {
   name: string
}

## delete Type
method: DELETE,
path: '/types/:id',
где id - id Type

## logout
method: GET
path: '/logout'

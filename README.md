# Booksapi :books

![release](https://img.shields.io/github/v/release/shree-c/booksapi?include_prerelease)

A simple api to manage and publish books

## Features

- Create user accounts(publisher and user)
- Publishers can publish books
- Api to manage books
- Ability to upload photos for a book
- Authentication using jwt tokens or cookies
- Appropriate Security measures are taken

## Api Documentation :link

- [Postman Documentation](https://documenter.getpostman.com/view/23021392/VUxKSU25)

## Build instructions :hammer

Clone the repo or download zip file

```sh
git clone --depth 1 https://github.com/shree-c/booksapi
```

Install node modules

```sh
cd booksapi
npm install
```

### Set environment variables inside config/config.env

| variable | description |
|-----|------|
| MONGO_U | _url for your mongodb instance_ |
| PORT | _the port you want to run server on_ |
| NODE\_ENV | _development or production_ |
| JWT\_SECRET | _secret for jwt tokens_ |
| COOKIE\_EXPIRE\_TIME | _approprite value for cookie expire time_ |
| FILE\_UPLOAD\_PATH | _path from root of project to upload photos_ |

Start the server :fire:

```sh
npm run start
```

# daveconnector
This is a dummy developer social network, built as part of a training course in learning the MERN (Mongo Express React Node) stack.

# Setup
This repo contains an express application with a nested react application

1. In the root dir a node Express application exists
2. In the dir /client a react application exists
3. By default the Express app will start on localhost:5000 and the React app on localhost:3000

## DB Setup

### Create database
Prior to starting you will need to create a MongoDB called 'daveconnector'. This is easy with mlab https://mlab.com/

### Configure app to point to database
You will need to update the configuration in the file `<project-root>/config/keys_dev.js` to point to your databse.
The default value is:

```javascript
module.exports = {
    mongoURI: 'mongodb://<dbuser>:<dbpassword>@<mongohost>:<mongoport>/daveconnector',
    secretOrKey: 'secret',
};
```
Update it with the values of you database, e.g.
```javascript
module.exports = {
    mongoURI: 'mongodb://john:banana1@ds115857.mlab.com:15854/daveconnector',
    secretOrKey: 'secret',
};
```
*You don't want to check these changes in to git, you may want to add the file keys_dev.js to your .gitignore*

## Starting the app
Before statring ensure you have node and npm installed. 

To start the app 

```bash
$ git clone https://github.com/lawsondavid/daveconnector.git
$ cd daveconnector
$ # UPDATE THE FILE config/keys_dev.js (described in previous section)
$ npm install 
$ npm run dev
```

This will start the Rect app on 

* http://localhost:3000

This will use the backend Express app, which is started on 

* http://localhost:5000

## Starting the apps separately

If for some reason you wish to start the apps separately you can do so

### Express App

```bash
$ git clone https://github.com/lawsondavid/daveconnector.git
$ cd daveconnector
$ npm install 
$ npm run server
```
open http://localhost:5000

### React App

```bash
$ git clone https://github.com/lawsondavid/daveconnector.git
$ cd daveconnector/client
$ npm install 
$ npm start
```
open http://localhost:3000



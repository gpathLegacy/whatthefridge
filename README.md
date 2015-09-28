# whatthefridge

  > Simplifying the grocery shopping experience, whatthefridge tells shoppers how much their delicious dishes will cost and exactly which ingredients they will need from the store, eliminating the wasteful buying and throwing away of excess ingredients

## Table of Contents

1. [What is WhatTheFridge?](#what-is-whatthefridge)
1. [Team](#team)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Viewing the project](#viewing-the-project)
    1. [Running tests](#running-tests)
1. [Roadmap](#roadmap)
1. [Known Bugs](#known-bugs)
1. [Avenues to explore](#avenues-to-explore)
1. [Contributing](#contributing)


## What is WhatTheFridge?
WhatTheFridge is an app that makes grocery shopping easy. Users log-in and see all of their recipes on the dashboard with an estimate of how much that meal will cost. After a user chooses which dishes they will be cooking that week, whatthefridge looks inside that user's "fridge" and generates a customized list of exactly which ingredients they'll need to buy on their next shopping trip and in what quantity. 

More information can be found [here](https://github.com/gigapath/whatthefridge/blob/master/_PRESS-RELEASE.md)

## Team

  - __Product Owner__: josh-stevens
  - __Scrum Master__: sdxl
  - __Development Team Members__: Jbays, mishasaggi, JeffUberman 
  
## Requirements
- PostgreSQL
- Angular 
- Node
- Express

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Viewing the project
```sh
The first time: 

Database: 
Run Postgres server
- $ postgres -D /usr/local/pgsql/data

Create the project database
- from the psql command line, type:
  CREATE DATABASE gigapath;

Setup database schema
- From within the /server/database/migrations, type:
  knex migrate:latest
   
Start the server:
from the root directory, type:
nodemon
then, in a browser, go to:
>http://localhost:1337/
```

### Running tests


## Roadmap

View the project roadmap [here](https://github.com/gigapath/whatthefridge/issues)

## Known Bugs

## Avenues to explore


## Contributing

See [CONTRIBUTING.md](https://github.com/gigapath/whatthefridge/blob/master/_CONTRIBUTING.md) for contribution guidelines.

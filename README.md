# Application Architecture
The codebase follows monorepo architecture and uses *pnpm workspaces* that significantly save more memory on disk and installs packages faster than *npm*. The reason I chose this architecture to have a great developer experience as I don't need wait for *npm* to finish installing duplicate node_modules. *pnpm* checks if the module exists or not if it exists it simply links the module to the package you are trying to install it to. For more information [visit pnpm](https://pnpm.io/).
Though it's monorepo the packages(i.e. backend/frontend) can be deployed to separate containers. And I included this approach when deploying it using docker. Every package is a independent unit of it's own.

# Live Demo Links (In Progress)
  - [Frontend](https://ec2-3-94-251-68.compute-1.amazonaws.com:3000)
  - [Backend API Docs](https://ec2-3-94-251-68.compute-1.amazonaws.com:8080/docs)

# Installation Using Docker
```
docker compose up --build
```

# Local Installation
 - MongoDB should be installed or you can spin up a MongoDB Container & change the **MONGO_URI** defined in *backend/.env.local*. Also, you can use only the *mongodb* service defined in *docker-compose.yaml* and comment out the other services. This way you don't need to change the **MONGO_URI** defined in the *backend/.env.local* file.
 - Run from the root directory ```npm i -g pnpm```
 - Then run ```pnpm install```
 - After that you can run ```pnpm -r start:dev```. It will start both the frontend and backend simultaneously and you should be able to read the logs for both applications.
 - There are also some custom commands you can try out by looking inside the root directory's ***package.json*** file

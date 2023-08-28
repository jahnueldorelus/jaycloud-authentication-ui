
# <img src="./src/assets/jaycloud-logo.svg" alt="JayCloud Logo" height="40" style="margin-right: 1rem;"/> JayCloud Authentication UI

The web application for managing authentication and naviating to JayCloud services. Runs in conjuction with the [JayCloud Authentication API](https://github.com/jahnueldorelus/jaycloud-authentication-api).


## Run Locally

Clone the project

```bash
  git clone git@github.com:jahnueldorelus/jaycloud-authentication-ui.git
```

Go to the project directory

```bash
  cd jaycloud-authentication-ui
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file. Any changes made to that file will require a restart of the web server. 

#### API Variables

- `VITE_ENVIRONMENT` - The environment of the server
- `VITE_API_PROD_URL` - The API production url address
- `VITE_API_DEV_URL` - The API development url address


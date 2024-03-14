## Setup instructions

- Clone and cd into repository
- copy and rename `.env.example` to `.env` and fill out env variables
- run `npm install`
- run `docker-compose up -d` to start db and elastic search containers
- run `npm run seed` to generate, seed and index data. Command might fail the first time it runs due to missing ES
  index. Apologies did not have time to investigate. Rerunning the command should fix the issue.
- run `npm run compile` or `npm run build`
- run `npm run dev`
- API should now be accessible through port assigned in `.env`


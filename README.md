# TBOT Discord Bot
## Price Alerts and Charts for Tbot

This is the monitor Discord Bot for the TBOT Army

> Node.js, Discord.js, Uniswap SDK, Ethers.js, Web3, Mongoose, Express.js, Puppeteer and Chart.js.

## Features

- Discord commands: !parity, !price and !ping
- Scraps and sends TBOT Parity from Uniswap's Liquidity Pool
- Scraps and saves TBOT Pricing from Uniswap
- Premade reply messages stored in the database for custom commands

## ToDo Features

- Pricing Charts
- more


## Installation

### Requires:
- [Node.js](https://nodejs.org/)
- [Mongo DB](https://www.mongodb.com/)

Install the dependencies and devDependencies and start the server in development monde.

```sh
cd tbot-discord-bot
npm i
node run dev
```

For production environments...

```sh
npm install --production
NODE_ENV=production node app
```

## Development

Want to contribute? Great! Just fork it and send a PR.

## License

MIT

**Free Software, Hell Yeah!**
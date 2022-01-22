# D2-Update-Parser
Destiny 2 releases regular updates.
This program gets the update, parses it, then formats it for mediawiki.

# Contributing
This program was made for [d2.destinygamewiki.com](d2.destinygamewiki.com).
If you use this tool, please consider contributing to the wiki.
We, the editors, greatly appreciate it.

If you want to modify this tool, open a pull request and I will review it.

# Prerequisites

You will need an [API Key](https://github.com/Bungie-net/api/wiki/Bungie.net-Application-Portal) from Bungie.
Also make sure to have [Node](https://nodejs.org/en/) installed.

# Installation
```
git clone https://github.com/oribix/D2-Update-Parser.git
cd D2-Update-Parser
npm i
tsc
```

Navigate to `config.json` and add your Bungie API Key.

# Running
The tool will pull the first 5 pages of Bungie News articles and look for patch notes.<br>
```
npm start
```

Alternatively, you can pull specific number of pages.<br>
```
node dist/index.js 10
```
The above command scrapes the first 10 pages for Destiny 2 patch notes.

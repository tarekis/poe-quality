# Poe Quality Combiner

This tool finds all quality items in a public stash tab and combines the items to get a combined quality of 40, which you can vendor for quality currencies.

## Preview

A stash with quality items:

<img src="https://raw.githubusercontent.com/tarekis/poe-quality/master/docs/stash.png" alt="Quality items in a public stash" width="500px"/>

Using the tool:

<img src="https://github.com/tarekis/poe-quality/blob/master/docs/preview.gif?raw=true" alt="Command" width="500px"/>

And vendoring found combinations:

<img src="https://raw.githubusercontent.com/tarekis/poe-quality/master/docs/vendor.png" alt="Vendoring the quality items" width="500px"/>


## Installtion

Install the latest [Node.js](https://nodejs.org/) version for your platform.
Then run the following command in a terminal.

```
npm install -g poe-quality
```

## Usage

Run this command to configure the stash tab, account name, league and session id to search with.
You will need to adjust those configurations at least once to ensure you are searching for the correct stash tab.

```
poe-quality config
```

How to get your session id needed to search for your stash:
1. Visit https://www.pathofexile.com/
2. Log in if you haven't already.
3. Press 12, you will enter the developer console and search for the website's cookies. Here's a [tutorial](https://developers.google.com/web/tools/chrome-devtools/manage-data/cookies) for chrome.
4. Find the cookie POESESSID, this is your session id you need to use.

Run this command to get all combinations for your configured stash.
```
poe-quality
```

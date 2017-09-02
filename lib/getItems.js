const request = require('request');
const fs = require('fs');
const path = require('path');

module.exports = (options = {}) => new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '..','config.json'), 'utf8', (error, data) => {
        if (error) {
            reject(error);
        }

        const JSONoptions = JSON.parse(data);
        const _options =  { 
            stashTabName: options.stashTabName || JSONoptions.stashTabName,
            sessionId: options.sessionId || JSONoptions.sessionId,
            accountName: options.accountName || JSONoptions.accountName,
            league: options.league || JSONoptions.league,
        };

        request({
            headers: {
                Referer: 'https://www.pathofexile.com',
                Cookie: `POESESSID=${_options.sessionId}`
            },
            url: `https://www.pathofexile.com/character-window/get-stash-items?accountName=${_options.accountName}&tabIndex=0&league=${_options.league}&tabs=1`,
        }, (error, response, body) => {
            if (error) {
                reject(error);
            }

            const tabs = JSON.parse(body).tabs;

            if (!tabs) {
                reject(new Error('Bad Session ID / Account Name'));
                return;
            }

            const targetTab = tabs.find(tab => tab.n === _options.stashTabName);
            if (!targetTab) {
                reject(new Error('Tab does not exist in league'));
                return;
            }
            const id = targetTab.i;
            
            request({
                headers: {
                    Referer: 'https://www.pathofexile.com',
                    Cookie: `POESESSID=${_options.sessionId}`
                },
                url: `https://www.pathofexile.com/character-window/get-stash-items?accountName=${_options.accountName}&tabIndex=${id}&league=${_options.league}&tabs=1`,
            }, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                resolve(JSON.parse(body).items);
            }); 
        }); 
    })
})
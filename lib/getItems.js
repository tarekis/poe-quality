const request = require('request');
const fs = require('fs');
const path = require('path');

module.exports = (options = {}) => new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '..', 'config', 'config.json'), 'utf8', (error, data) => {
        if (error) {
            reject(error);
        }

        const JSONoptions = JSON.parse(data);
        options = Object.assign(JSONoptions, options);

        request({
            headers: {
                Referer: 'https://www.pathofexile.com',
                Cookie: `POESESSID=${options.sessionId}`
            },
            url: `https://www.pathofexile.com/character-window/get-stash-items?accountName=${options.accountName}&tabIndex=0&league=${options.league}&tabs=1`,
        }, (error, response, body) => {
            if (error) {
                reject(error);
            }

            let json, tabs;
            try {
                json = JSON.parse(body);
                tabs = json.tabs;
            } catch (error) {}

            if (json) {
                if (json.error && json.error.code === 1) {
                    reject(new Error('League does not exist'));
                }
            }

            if (!tabs) {
                reject(new Error('Bad Session ID/Account name combination'));
                return;
            }

            const targetTab = tabs.find(tab => tab.n.toLowerCase() === options.stashTabName.toLowerCase());
            if (!targetTab) {
                reject(new Error(`Tab '${options.stashTabName}' does not exist in league '${options.league}'`));
                return;
            }
            const id = targetTab.i;
            
            request({
                headers: {
                    Referer: 'https://www.pathofexile.com',
                    Cookie: `POESESSID=${options.sessionId}`
                },
                url: `https://www.pathofexile.com/character-window/get-stash-items?accountName=${options.accountName}&tabIndex=${id}&league=${options.league}&tabs=1`,
            }, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                resolve(JSON.parse(body).items);
            }); 
        }); 
    })
})

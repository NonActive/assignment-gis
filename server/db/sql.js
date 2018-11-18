const path = require('path');
const fs = require('fs');

const queryFolder = path.join(__dirname, 'queries');

function initQuery(queryName, optional = {}) {
    if (!queryName) {
        throw Error('Initializing query: The name of the query is required');
    }

    let file = path.join(queryFolder, queryName + '.sql');

    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) { 
                reject(err) 
            } else { 
                resolve(data) 
            };
        });
    }).then((query) => {
        //console.log(`QUERY - ${queryName} has been loaded!`);

        for (let param in optional) {
            let regex = new RegExp(`%${param}%`, 'g');
            let value = optional[param];

            if (!Array.isArray(value)) {
                value = [value];
            }

            query = query.replace(regex, value);
        }

        return query;
    }).catch((err) => {
        console.log('Init query: ' + err );
        return err;
    });
};

module.exports = {
    initQuery
}
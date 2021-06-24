const router = require('express').Router();
const got = require('got');
const { pipeline } = require('stream');

const dataStream = got.stream({
    url: 'http://www.giantbomb.com/api/search',
    qs: {
      api_key: '123456',
      query: 'World of Warcraft: Legion'
    }
});
pipeline(dataStream, res1, (err) => {
    if (err) {
        console.log("ERROR:ERROR:ERROR:ERROR:",err);
        res1.sendStatus(500);
    }
    else{console.log(res1); res1.message="******** ERROR"}
});


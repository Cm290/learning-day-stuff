const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('hello world');
});

app.get('/hello', (req, res) => {
    res.send('I\'m another request response');
});

app.listen(3000, () => {
    console.log('I\'m listening');
})

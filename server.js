require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const movies = require('./movies.json');
const cors = require('cors');
const helmet = require('helmet');

const PORT = 8000;

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    console.log('validate bearer token middleware')
    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized: Must provide valid token'})
    }
    next()
})
function handleGetMovies(req, res) {
    const { genre, country, avg_vote } = req.query
    let results = []
    if(genre) {
        let lcGenre = genre.toLowerCase();
        for (let i = 0; i < movies.length; i++) {
            if (movies[i].genre.toLowerCase() === lcGenre){
                results.push(movies[i])
            }
        }
    }

    if(country) {
        let lcCountry = country.toLowerCase();
        for (let i = 0; i < movies.length; i++) {
            if (movies[i].country.toLowerCase() === lcCountry) {
                results.push(movies[i])
            }
        }
    }
    
    if(avg_vote) {
        let vote = parseFloat(avg_vote);
        for (let i = 0; i < movies.length; i++) {
            if (vote <= movies[i].avg_vote) {
                results.push(movies[i])
            }
        }
    }
    if(!avg_vote && !country && !genre) {
        results = movies
    }
    res.json(results);
    
}

app.get('/movies', handleGetMovies)
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
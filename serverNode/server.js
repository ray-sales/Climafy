const express = require("express");
const cors = require("cors");
const request = require('request');
const axios = require("axios");
const app = express();
app.use(express.json());
app.use(cors());


const CLIENT_ID_SPOTIFY = "659c1e0f4f924cf8bc4b5659c1da81f5"
const CLIENT_SECRET_SPOTIFY = "98103acd85e24069b0fe569b87f8a19b"
const REDIRECT_URI_SPOTIFY = "http://localhost:8888/callback";
let access_token_spotify = "";

app.post("/temperature", async(req, res) => {
    let city = req.body.city.replace(/\%s/g, "%20");
    let state = req.body.state;
    let country = req.body.country
    let key = '1219c224afd0c7b6dc88b9bc702be0d2';
    let units = 'metric'
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&appid=${key}&units=${units}`
    let temperature = "";
    await axios.get(url).then((response) => {
        temperature = response.data.main.temp
        res.json({ city, temperature })
        res.end(JSON.stringify(temperature));
    });
})

app.get('/callback', function(req, res) {
    let code = req.query.code;

    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: REDIRECT_URI_SPOTIFY,
            grant_type: 'authorization_code',
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Basic ' + (Buffer.from(
                CLIENT_ID_SPOTIFY + ':' + CLIENT_SECRET_SPOTIFY
            ).toString('base64'))
        },
        json: true
    }
    request.post(authOptions, function(error, response, body) {
        access_token_spotify = body.access_token
    })
})

app.get("/recommendation", (req, res) => {
    let celsius = req.query.celsius
    let genre = "";
    if (celsius > 32) {
        genre = "party"
    } else if (celsius > 22 && celsius <= 32) {
        genre = "pop"
    } else if (celsius > 10 && celsius <= 22) {
        genre = "rock"
    } else {
        genre = "classical"
    }
    const options = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/recommendations',
        params: {
            limit: '10',
            seed_artists: '',
            seed_genres: genre,
            seed_tracks: '',
            '': ''
        },
        headers: {
            Authorization: 'Bearer ' + access_token_spotify
        }
    };

    axios.request(options).then(function(response) {
        response = response.data.tracks;
        let arrayReturn = [];
        for (let i = 0; i < response.length; i++) {
            arrayReturn.push({
                id: response[i].id,
                name: response[i].name,
                link: response[i].external_urls.spotify,
                image: response[i].album.images[0].url,
                artist: response[i].artists[0].name,
                preview_url: response[i].preview_url
            })
        }


        res.json(arrayReturn)
    }).catch(function(error) {
        console.error(error);
    });
})


app.listen(8888, () => {
    console.log("Server is on ready!")
})
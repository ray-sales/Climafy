const app = Vue.createApp({
    data() {
        return {
            city: "itupeva",
            state: "sp",
            country: "br",
            tracks: [],
            address: "",
            isToken: false,
            temperature: "",
            client_id: "659c1e0f4f924cf8bc4b5659c1da81f5",
            redirect_uri: "http%3A%2F%2Flocalhost%3A8888%2Fcallback"
        }
    },

    methods: {
        getTemperature() {
            [this.city, this.state, this.country] = this.address.split(",");
            let data = {
                city: this.city,
                state: this.state,
                country: this.country
            }
            fetch("http://localhost:8888/temperature", {
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "body": JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    this.temperature = data.temperature
                    this.getTracks(this.temperature);
                })
                .catch(err => {
                    console.error(err);
                });
        },

        getTracks(temperature) {
            let client_id = this.client_id;
            let redirect_uri = this.redirect_uri;
            if (!this.isToken) {
                fetch("http://localhost:8888/music-style").then(response => {
                    let url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=user-read-private%20user-read-email&redirect_uri=${redirect_uri}`
                    window.open(url);
                    this.isToken = true
                })
            }
            fetch("http://localhost:8888/recommendation?celsius=" + temperature).then(response => response.json()).then(data => {
                this.tracks = data;
            })
        },
    },

})
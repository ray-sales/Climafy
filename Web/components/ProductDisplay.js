app.component("product-display", {
    props: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        link: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        artist: {
            type: String,
            required: true
        },
        preview_url: {
            type: String,
            required: false
        }
    },
    template:
    /*html*/
        `
        <div class="product-display">
        <div class="product-details">
            <div class="music-image">
                <img :src="image" alt="Capa do album">
            </div>
            <div class="music-details">
                <h2>{{name}}</h2>
                <h4>{{artist}}</h4>
            </div>
        </div>
            <div class="music-link">
                <button class="button"><a :href="link" target="_blank"><img :src = "spotifyIcon"/></a></button>

            </div>
        </div>
    `,
    data() {
        return {
            spotifyIcon: "./assets/icons/spotify.svg",
        }
    },

})
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = new Schema(
  {
    title: {
      type: String, //insert ref to user
      required: true,
    },
    description: {
      type: String, //insert ref to user
    },
    cover: {
      type: String, //insert ref to user
    },
    releaseDate: {
      type: Date,
    },
    songs: [
      {
        songTitle: {
          type: String,
          required: "Please enter song title",
        },
        number: {
          type: Number,
          min: [1],
        },
        duration: {
          type: Number,
        },
        price: {
          type: Number,
        },
        audioFile: {
          type: String,
        },
      },
    ],
    tags: [{ type: String }],

    artistId: {
      type: String, //referred to user._id && user.role==="artist"
    },
  },
  { timestamps: true }
);

module.exports = AlbumSchema;

//test

/* {
    "title": "Levitation Sessions",
    "description": "Since 1995, the visionary Japanese collective have been exploring the outer rings of psych and space rock. Their legendary live show has taken them to all corners of the earth, and perhaps beyond, and we’re stoked to have them touch down for an episode of Levitation Sessions. If the band’s name doesn’t already give you idea of their sound, look no further than the album titles in their rich discography: Hypnotic Liquid Machine from the Golden Utopia, Troubadours from Another Heavenly World, Chant from the Cosmic Inferno, Have You Seen the Other Side of the Sky - this is deeply psychedelic stuff, like… musicians trying to reach the other side of the galaxy stuff. They’ve gathered up a batch of their most acclaimed jammers here + a brand new one for this absolutely ripping Session + vinyl release.",
    "albumCover": "https://f4.bcbits.com/img/a0983484698_16.jpg",
    "releaseDate": "",
    "albumSongs": []
} 

{
    "email":"amt@amt.com",
    "password":"amt",
    "artistName":"Acid Mothers Temple",
    "role":"artist",
    "albums":["606378115cccba4c8276bf1b"]
}

{
            "albumSongs": [
                {"songName": "Dark Star Blues",
    "number": "1",
    "duration": "458",
    "price": "1",
    "songFeatured": "true",
    "audioFile": ""},
    {"songName": "Santa Maria",
    "number": "2",
    "duration": "304",
    "price": "1",
    "songFeatured": "false",
    "audioFile": ""},
    {"songName": "Disco Pink Lady Lemonade",
    "number": "3",
    "duration": "866",
    "price": "1",
    "songFeatured": "false",
    "audioFile": ""},
    {"songName": "Black Summer Song",
    "number": "4",
    "duration": "494",
    "price": "1",
    "songFeatured": "false",
    "audioFile": ""},
    {"songName": "Pink Lady Lemonade Cosa",
    "number": "5",
    "duration": "615",
    "price": "1",
    "songFeatured": "false",
    "audioFile": ""},
    {"songName": "Cometary Orbital Drive",
    "number": "6",
    "duration": "870",
    "price": "1",
    "songFeatured": "false",
    "audioFile": ""}

            ],
            "tags": ["Austin", "psych", "rock"],
            "_id": "606378115cccba4c8276bf1b",
            "title": "Levitation Sessions",
            "description": "Since 1995, the visionary Japanese collective have been exploring the outer rings of psych and space rock. Their legendary live show has taken them to all corners of the earth, and perhaps beyond, and we’re stoked to have them touch down for an episode of Levitation Sessions. If the band’s name doesn’t already give you idea of their sound, look no further than the album titles in their rich discography: Hypnotic Liquid Machine from the Golden Utopia, Troubadours from Another Heavenly World, Chant from the Cosmic Inferno, Have You Seen the Other Side of the Sky - this is deeply psychedelic stuff, like… musicians trying to reach the other side of the galaxy stuff. They’ve gathered up a batch of their most acclaimed jammers here + a brand new one for this absolutely ripping Session + vinyl release.",
            "albumCover": "https://f4.bcbits.com/img/a0983484698_16.jpg",
            "releaseDate": null
        }



*/

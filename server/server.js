const OpenAI = require("openai");
const express = require("express");
const app = express();
const key = "";
const openai = new OpenAI({ apiKey: key });
const port = 5000;

const cors = require("cors");
const bodyParser = require('body-parser');
const multer = require('multer')
const fs = require('fs');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/uploads')      //you tell where to upload the files,
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.mp3')
    }
})
var upload = multer({
    storage: storage,
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
async function main() {

    app.post('/', async (req, res) => {
        try {
            const searchInput = req.body.search;

            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: searchInput }],
                model: "gpt-3.5-turbo",
            });
            res.send(completion.choices[0]);
        }
        catch (err) {
            res.send(new Error(err));
        }
    })

    app.post('/transcribe', upload.single('audFile'), async (req, res) => {
        try {
            const formData = new FormData();
            formData.append("model", "whisper-1");
            const transcription = await openai.audio.transcriptions.create({
                file: fs.createReadStream(req.file.path),
                model: "whisper-1",
            });
            console.log(transcription.text);
            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: "Pretend you are an expert copywriter" }, {
                    role: "user", content: `
                    ${transcription.text}
                    Create a summary for this transcription, and recommend 3 books regarding the topic, as well as the author of the book.
                `}],
                model: "gpt-3.5-turbo",
                functions: [
                    {
                        name: 'ShowTranscriptionDetails',
                        description: 'This function shows the summary of the transcription as well as recommends 3 books regarding the topic.',
                        parameters: {
                            type: 'object',
                            properties: {
                                transcription_summary: {
                                    type: 'string',
                                    description: 'A basic summary title of the transcription.'
                                },
                                book_recommendations: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            book_title: {
                                                type: 'string',
                                                description: 'The title of the book recommended.',
                                            },
                                            book_summary: {
                                                type: 'string',
                                                description: 'A short summary of the book.',
                                            },
                                            book_author: {
                                                type: 'string',
                                                description: 'The author of the book.',
                                            },
                                        },
                                        // required: ['rolename', 'email', 'action'],
                                    },
                                }
                            },
                            // required: ['role_users'],
                        },
                    }
                ]
            });
            res.send({ transcription: transcription.text, summary: completion.choices[0] });

        } catch (e) {
            console.log("error", e);
            res.send(new Error(e));
        }
    })
    app.listen(port, () => {
        console.log("Server is listening on port..")
    })
}

main();
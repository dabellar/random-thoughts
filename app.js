"use strict";
/**
 * @author: Darleine Abellard
 * CS132 SP24
 * CP4: Node/Express API
 * 
 * The Node project for diary application
 * 
 * This API supports the following endpoints:
 * GET /thoughts
 * GET thoughts/:topic
 * 
 * POST /newThought
 */

const express = require("express");
const fs = require("fs/promises");
const multer = require("multer");

const CLIENT_ERR_CODE = 400;
const SERVER_ERR_CODE = 500;
const SERVER_ERROR = "Server error... Please try again later."
const DEBUG = true;
const BASE_DIR = "topics"
const ACCEPTED_TOPICS = [
    "positive", "negative", "writing", 
    "academics", "crochet", "miscellaneous"
]

const app = express();
app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(multer().none());
app.use(express.static("public"));


/******************************* GET ENDPOINTS ********************************/

/**
 * Returns a list of JSON object of all the posted thoughts
 * Sends a 500 error if an error occurs on the server
 */
app.get("/thoughts", async(req, res, next) => {
    try {
        let allThoughts = await getAllThoughts();
        res.json(allThoughts);
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

/**
 * Returns a list of JSON objects of all the posted thoughts 
 * within a certain category as JSON objects
 * Sends a 500 error if an error occurs on the server
 * Sends a 400 error if the client inputs the wrong category
 */
app.get("/thoughts/:topic", async(req, res, next) => {
    let topicParam = req.params.topic.toLowerCase();
    if (ACCEPTED_TOPICS.includes(topicParam)) {
        try {
            let topicThoughts = await getSpecificThoughts(topicParam);
            res.json(topicThoughts); 
        } catch (err) {
            res.status(SERVER_ERR_CODE);
            err.message = SERVER_ERROR;
            next(err);
        }
    } else {
        res.status(CLIENT_ERR_CODE);
        next(Error("Not a valid topic for /thoughts/:topic"));
    }
});


/****************************** POST ENDPOINTS ********************************/

/**
 * Posts a thought
 * Sends a 500 error if an error occurs on the server
 * Sends a 400 error if the wrong parameters are passed through
 */
app.post("/newThought", async(req, res, next) => {
    let topic = req.body.topics;
    let content = req.body.thought_content;
    if (!topic || !content) {
        res.status(CLIENT_ERR_CODE);
        next(Error("All fields (topic and content) are required for /newThought"));
    }
    try {
        await storeNewThought(topic, content);
        res.type("text");
        res.send("You successfully added a new thought!")
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

/****************************** HELPER FUNCTIONS ******************************/


/**
 * Reads through topics file directory and formats thought data
 * into a JSON object
 * 
 * @returns list of JSON objects of all thoughts
 */
async function getAllThoughts() {
    let result = [];
    let topics = await fs.readdir(BASE_DIR);
    for (let i = 0; i < topics.length; i++) {
        let thoughtDir = `${BASE_DIR}/${topics[i]}/content.txt`;
        let content = await fs.readFile(thoughtDir, "utf8");
        let lines = content.split("\n");
        for (let j = 0; j < lines.length; j++) {
            let l = lines[j];
            if (l != "") {
                let thoughtJSON = {
                    "topic" : topics[i],
                    "thought" : l
                };
                result.push(thoughtJSON);
            }
        }
    }
    return result;
}

/**
 * 
 * @param {String} topic topic name
 * @return list of JSON objects of specified thoughts within a topic
 */
async function getSpecificThoughts(topic) {
    let result = []; 
    let savedTopics = await fs.readdir(BASE_DIR);
    if (savedTopics.includes(topic)) {
        let thoughtDir = `${BASE_DIR}/${topic}/content.txt`;
        let content = await fs.readFile(thoughtDir, "utf8");
        let lines = content.split("\n");
        for (let j = 0; j < lines.length; j++) {
            let l = lines[j];
            if (l != "") {
                let thoughtJSON = {
                    "topic" : topic,
                    "thought" : l
                };
                result.push(thoughtJSON);
            }
        }
    }
    return result;
}

/**
 * Stores a thought in the correct directory and 
 * creates a new directory if it doesn't exist
 * 
 * @param {String} topic topic string (for directory)
 * @param {String} content string of thought content
 */
async function storeNewThought(topic, content) {
    let savedTopics = await fs.readdir(BASE_DIR);
    if (!savedTopics.includes(topic)) {
        fs.mkdir(`${BASE_DIR}/${topic}`);
    }
    let topicFilename = `${BASE_DIR}/${topic}/content.txt`;
    await fs.appendFile(topicFilename, `${content}\n`);
}

/** 
 * FROM CLASS:
 * Error handling middleware function
 */
function errorHandler(err, req, res, next) {
    if (DEBUG) {
        console.error(err);
    }
    res.type("text");
    res.send(err.message);
}

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("Listening on port " + PORT + "...");
    console.log(`URL: localhost:${PORT}/index.html`);
});
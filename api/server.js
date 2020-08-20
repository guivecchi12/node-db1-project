const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/", async (req, res) => {
    try{
        const accounts = await db.select("*").from("accounts");
        res.json(accounts);
    }
    catch (err){
        res.status(500).json({message: "error looking for accounts"})
    }
})

server.post("/", async (req, res) => {
    try{
        const account = await db.insert({
            name: req.body.name,
            budget: req.body.budget
        })
        .into("accounts");

        const message = await db("accounts")
            .where("id", account)
            .first();

        res.json(message);
    }
    catch (err){
        res.status(500).json({message: "error adding new accounts"})
    }
})
server.put("/:id", async (req, res) => {
    try{
        const account = await db("accounts")
            .update({
                name: req.body.name,
                budget: req.body.budget
            })
            .where("id", req.params.id);

        const updated = await db("accounts")
            .where("id", req.params.id)
            .first();

        res.json(updated);
    }

    catch (err){
        res.status(500).json({message: "error updating account"})
    }
})

server.delete("/:id", async (req, res) => {
    try{
       await db("accounts")
            .where("id", req.params.id)
            .del();

        res.status(200).json({message: "account deleted"});
    }
    catch (err){
        res.status(500).json({message: "error deleting account"})
    }
})

module.exports = server;

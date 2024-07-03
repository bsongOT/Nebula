import express from "express";

const app = express();

app.use("/public", express.static('./public/'));

app.get('', (req, res) => {
    res.sendFile(import.meta.url + "/public/index.html")
})

app.listen(8080, () => console.log("listening on 8080"));
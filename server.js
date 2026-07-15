const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const DB_PATH = path.join(__dirname, "db.json");

// Read database
function readDB() {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
}

// Home route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Server is running successfully 🚀"
    });
});

// Get complete database
app.get("/api/db", (req, res) => {
    res.json(readDB());
});

// Get users
app.get("/api/users", (req, res) => {
    const db = readDB();
    res.json(db.users);
});

// Get products
app.get("/api/products", (req, res) => {
    const db = readDB();
    res.json(db.products);
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
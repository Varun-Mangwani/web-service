const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// -----------------------------
// Manual CORS (No npm install)
// -----------------------------
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

app.use(express.json());

const DB_PATH = path.join(__dirname, "db.json");

// -----------------------------
// Read Database
// -----------------------------
function readDB() {
    if (!fs.existsSync(DB_PATH)) {
        const defaultDB = {
            users: [],
            products: []
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2));
        return defaultDB;
    }

    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

// -----------------------------
// Save Database
// -----------------------------
function saveDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// -----------------------------
// Home
// -----------------------------
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Server is running successfully 🚀"
    });
});

// -----------------------------
// Get Full Database
// -----------------------------
app.get("/api/db", (req, res) => {
    res.json(readDB());
});

// -----------------------------
// Get Users
// -----------------------------
app.get("/api/users", (req, res) => {
    const db = readDB();
    res.json(db.users);
});

// -----------------------------
// Get Products
// -----------------------------
app.get("/api/products", (req, res) => {
    const db = readDB();
    res.json(db.products);
});

// -----------------------------
// Add Product
// -----------------------------
app.post("/api/products", (req, res) => {
    try {
        const db = readDB();

        const product = {
            id: Date.now(),
            ...req.body
        };

        db.products.push(product);

        saveDB(db);

        res.status(201).json({
            success: true,
            product
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// -----------------------------
// Update Product
// -----------------------------
app.put("/api/products/:id", (req, res) => {
    try {

        const db = readDB();

        const id = Number(req.params.id);

        const index = db.products.findIndex(p => Number(p.id) === id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        db.products[index] = {
            ...db.products[index],
            ...req.body,
            id
        };

        saveDB(db);

        res.json({
            success: true,
            product: db.products[index]
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// -----------------------------
// Delete Product
// -----------------------------
app.delete("/api/products/:id", (req, res) => {
    try {

        const db = readDB();

        const id = Number(req.params.id);

        const index = db.products.findIndex(p => Number(p.id) === id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        db.products.splice(index, 1);

        saveDB(db);

        res.json({
            success: true,
            message: "Product deleted"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// -----------------------------
// Add User
// -----------------------------
app.post("/api/users", (req, res) => {
    try {

        const db = readDB();

        const user = {
            id: Date.now(),
            ...req.body
        };

        db.users.push(user);

        saveDB(db);

        res.status(201).json({
            success: true,
            user
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// -----------------------------
// 404
// -----------------------------
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// -----------------------------
// Start Server
// -----------------------------
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

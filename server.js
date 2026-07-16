const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "db.json");

// ===============================
// Read Database
// ===============================
function readDB() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(
            DB_PATH,
            JSON.stringify(
                {
                    users: [],
                    products: []
                },
                null,
                2
            )
        );
    }

    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

// ===============================
// Save Database
// ===============================
function saveDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ===============================
// Home
// ===============================
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Server is running successfully 🚀"
    });
});

// ===============================
// Complete Database
// ===============================
app.get("/api/db", (req, res) => {
    res.json(readDB());
});

// ===============================
// Users
// ===============================
app.get("/api/users", (req, res) => {
    const db = readDB();
    res.json(db.users);
});

// ===============================
// Products
// ===============================
app.get("/api/products", (req, res) => {
    const db = readDB();
    res.json(db.products);
});

// ===============================
// Add Product
// ===============================
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
            message: "Product added successfully",
            product
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// ===============================
// Update Product
// ===============================
app.put("/api/products/:id", (req, res) => {
    try {
        const db = readDB();

        const id = Number(req.params.id);

        const index = db.products.findIndex(
            (p) => Number(p.id) === id
        );

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
            message: "Product updated",
            product: db.products[index]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// ===============================
// Delete Product
// ===============================
app.delete("/api/products/:id", (req, res) => {
    try {
        const db = readDB();

        const id = Number(req.params.id);

        const index = db.products.findIndex(
            (p) => Number(p.id) === id
        );

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

// ===============================
// 404
// ===============================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// ===============================
// Start Server
// ===============================
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

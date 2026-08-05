const db = require("../../config/dbConfig");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");

const register = async (req, res) => {
    try {

        const {
            full_name,
            email,
            password,
            phone,
            role
        } = req.body;

        const [existingUser] = await db.query(
            `SELECT id
             FROM users
             WHERE email = ?`,
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered."
            });
        }

        const hashedPassword = await hashPassword(password);

        const [result] = await db.query(
            `INSERT INTO users
            (
                full_name,
                email,
                password,
                phone,
                role
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                full_name,
                email,
                hashedPassword,
                phone || null,
                role || "Admin"
            ]
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            userId: result.insertId
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const [rows] = await db.query(
            `SELECT *
             FROM users
             WHERE email = ?`,
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const user = rows[0];

        const isMatch = await comparePassword(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    register,
    login
};
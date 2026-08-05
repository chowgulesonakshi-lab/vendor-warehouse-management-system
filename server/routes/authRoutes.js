const express = require("express");
const { body } = require("express-validator");

const { register, login } = require("../controllers/authController");
const validate = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
    "/register",
    [
        body("full_name")
            .notEmpty()
            .withMessage("Full name is required"),

        body("email")
            .isEmail()
            .withMessage("Enter a valid email"),

        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),

        body("phone")
            .optional()
            .isLength({ min: 10, max: 15 })
            .withMessage("Enter a valid phone number"),

        body("role")
            .optional()
            .isIn(["Admin", "Manager", "Staff"])
            .withMessage("Invalid role")
    ],
    validate,
    register
);

router.post(
    "/login",
    [
        body("email")
            .isEmail()
            .withMessage("Enter a valid email"),

        body("password")
            .notEmpty()
            .withMessage("Password is required")
    ],
    validate,
    login
);

module.exports = router;
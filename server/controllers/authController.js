const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");

const users = [];

const register = async(req, res) => {
    try{
        const{name, email, password} = req.body;
        const existingUser = users.find(user=> user.email === email);
        if(existingUser){
            return res.status(409).json({
                success: false,
                message: "Email already registered."
            });
        }
        const hashedPassword = await hashPassword(password);
        const newUser = {
            id: users.length+1,
            name, email, password: hashedPassword,
            role: "ADMIN"
        };
        users.push(newUser);
        res.status(201).json({
            success: true,
            message: "User registered successfully."
        });
    } catch (error) {
              res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const login = async(req, res) => {
    try{
        const{email, password} = req.body;
        const user = users.find(user => user.email === email);
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
              return res.status(401).json({
                  success: false,
                  message: "Invalid email or password."
              });
        }
        const token = generateToken(user);
        res.status(200).json({
            success: true,
            token
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

module.exports = {
    register,
    login
};
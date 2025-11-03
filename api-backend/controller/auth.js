import bcrypt from 'bcrypt'
import {db} from '../connect.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {

    // Check User if Exists
    const {username, fname, lname, email, password} = req.body
    const fullname = fname + " " + lname

    const query1 = "SELECT * FROM users WHERE username = ?"
    db.query(query1, [username], (err, result) => {
        if (err) return res.status(500).json({msg: err.message})
        if (result.length > 0) {
            return res.status(400).json({msg: "User already exists"})
        } else{
            const query2 = "SELECT * FROM users WHERE email = ?"
            db.query(query2, [email], (err, result) => {
                if (err) return res.status(500).json({msg: err.message})
                if (result.length > 0) {
                    return res.status(400).json({msg: "Email already exists"})
                } else{
                     // Hash password
                    const salt = bcrypt.genSaltSync(10);
                    const hashedPassword = bcrypt.hashSync(password, salt)

                    // Create New User
                    const query3 = "INSERT INTO users (username, fullname, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?, ?)"
                    db.query(query3, [username, fullname, fname, lname, email, hashedPassword], (err, result) => {
                        if (err) return res.status(500).json({msg: err.message})
                        return res.status(200).json({msg: "User created successfully"})
                    })
                }   
            })
        }
    })   
}

export const login = async (req, res) => {
    const {username, password} = req.body

    const query = "SELECT * FROM users WHERE username = ?"
    db.query(query, [username], (err, result) => {
        if (err) return res.status(500).json({msg: err.message})
        if (result.length === 0) {
            return res.status(400).json(
                {msg: "User does not exist"}
            )
        }else{
            const isPasswordCorrect = bcrypt.compareSync(password, result[0].password)
            if (!isPasswordCorrect) {
                return res.status(400).json(
                    {msg: "Invalid password"}
                )
            } else{
                const token = jwt.sign({id: result[0].id}, "secretKey");
                const {password, ...others} = result[0];
                res.cookie("access_token", token, {
                    httpOnly: true
                })
                .status(200).json(others);
            }
        }
    })
}

export const logout = async (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out")
}

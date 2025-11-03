import {db} from '../connect.js'
import jwt from 'jsonwebtoken'
export const getUser = async (req, res) => {
    const query = `SELECT * FROM users Where id = ?`;
    db.query(query, [req.params.userId], (err, result) => {
        if(err) return res.status(500).json(err);
        const {password, ...info} = result[0]
        return res.status(200).json(info)
    }) 
}

export const updateUser = async (req, res) => {
    const { fname, lname, city, website, coverPic, profilePic } = req.body;
    const fullname = fname + " " + lname;
   const token = req.cookies.access_token;
    if(!token) return res.status(401).json("Not Authenticated!");
    jwt.verify(token, 'secretKey', (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!");
        const query = `UPDATE users SET firstname=?, lastname=?, fullname=?, city=?, website=?, coverPic=?, profilePic=? WHERE id=?`;
        const values = [fname, lname, fullname, city, website, coverPic, profilePic, userInfo.id];

        db.query(query, values, (err, result) => {
            if(err) return res.status(500).json(err);
            if(result.affctedRows > 0)
            return res.status(200).json('User data has been updated')
            else return res.status(403).json('You can only update your own account!')  
        })
    }) 
}
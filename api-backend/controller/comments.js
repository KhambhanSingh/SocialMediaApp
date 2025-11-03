import {db} from '../connect.js'
import moment from 'moment'
import jwt from 'jsonwebtoken'

export const getComments = (req, res) => {
    const query = `SELECT c.*, u.fullname as name, u.id as userId, u.profilePic FROM postcomments as c 
    JOIN users as u ON c.userId = u.id
    WHERE c.postId = ?
    ORDER BY c.createDate DESC`;

    db.query(query, [req.query.postId], (err, result) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json(result)
    })
}

export const addComment = (req, res) => {
    const token = req.cookies.access_token;
    if(!token) return res.status(401).json("Not Authenticated!");
    jwt.verify(token, 'secretKey', (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!");
        const query = `INSERT INTO postcomments (postId, userId, comment, createDate) VALUES (?)`;

        const values = [
            req.body.postId,
            userInfo.id,
            req.body.commentDesc,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        ]

        db.query(query, [values], (err, result) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json('Comment has been added!')
        })
    })
}
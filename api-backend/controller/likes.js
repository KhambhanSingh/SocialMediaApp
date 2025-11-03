import {db} from '../connect.js'
import jwt from 'jsonwebtoken'

export const getLikes = (req, res) => {
    const query = `SELECT userId FROM likes WHERE postId = ?`;

    db.query(query, [req.query.postId], (err, result) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json(result.map(like=>like.userId))
    })
}

export const addLike = (req, res) => {
    const token = req.cookies.access_token;
    if(!token) return res.status(401).json("Not Authenticated!");
    jwt.verify(token, 'secretKey', (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!");
        const query = `INSERT INTO likes (postId, userId) VALUES (?)`;
        const values = [
            req.body.postId,
            userInfo.id
        ]
        db.query(query, [values], (err, result) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json('Post has been liked!')
        })
    })
}

export const deleteLike = (req, res) => {
    const token = req.cookies.access_token;
    if(!token) return res.status(401).json("Not Authenticated!");
    jwt.verify(token, 'secretKey', (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!");
        const query = 'DELETE FROM likes WHERE userId=? AND postId=?'
        db.query(query, [userInfo.id, req.query.postId], (err, result) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json('Post has been disliked!')
        })
    })
}
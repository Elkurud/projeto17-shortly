import { db } from "../database/database.connection.js"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

export async function signUp(req, res) {

    const { name, email, password, confirmPassword } = req.body

    try {

        if( password !== confirmPassword ) return res.sendStatus(422)

        const isRegistered = await db.query(` 
            SELECT * FROM users WHERE users.email=$1;
        `, [email])

        if (isRegistered.rows.length > 0) return res.sendStatus(409)

        const hash = bcrypt.hashSync(password, 10)

        await db.query(`
            INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3);
        `, [name, email, hash])

        res.sendStatus(201)

    } catch (err) {
        res.status(500).send(err.message)
    }

}

export async function signIn(req, res) {
    const { email, password } = req.body

    try {
        const {rows: user} = await db.query(` 
        SELECT * FROM users WHERE users.email=$1;
    `, [email])
        if (!user[0]) return res.status(401).send("email nao cadastrado")

        const isPasswordCorrect = bcrypt.compareSync(password, user[0].password)
        if (!isPasswordCorrect) return res.status(401).send("senha incorreta")

        const token = uuid()
        await db.query(`
            INSERT INTO sessions (token, "userId") VALUES ($1, $2)
        `, [token, user[0].id])
        res.status(200).send({ token })
    } catch (err) {
        res.status(500).send(err.message)
    }

}

export async function signOut(req, res) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.senStatus(401)

    try {


    } catch (err) {
        res.status(500).send(err.message)
    }


}
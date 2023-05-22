import { db } from "../database/database.connection.js"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

export async function signUp(req, res) {

    const { name, email, password, image } = req.body

    try {
        const user = await db.collection("users").findOne({ email })
        if (user) return res.status(409).send("email ja cadastrado")

        const hash = bcrypt.hashSync(password, 10)

        await db.collection("users").insertOne({ name, email, password: hash, image })
        res.sendStatus(201)

    } catch (err) {
        res.status(500).send(err.message)
    }

}

export async function signIn(req, res) {
    const { email, password } = req.body

    try {
        const user = await db.collection("users").findOne({ email })
        if (!user) return res.status(401).send("email nao cadastrado")

        const isPasswordCorrect = bcrypt.compareSync(password, user.password)
        if (!isPasswordCorrect) return res.status(401).send("senha incorreta")

        const token = uuid()
        await db.collection("sessions").insertOne({ token, userId: user._id })
        res.send({ token, userName: user.name, image: user.image })
    } catch (err) {
        res.status(500).send(err.message)
    }

}

export async function signOut(req, res) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.senStatus(401)

    try {

        const sessions = await db.collection("sessions").findOne({ token })
        if (!sessions) return res.sendStatus(401)

        await db.collection("sessions").deleteOne({ token })
        res.sendStatus(200)

    } catch (err) {
        res.status(500).send(err.message)
    }


}
import { db } from "../database/database.connection.js"

export async function tokenValidate(req, res, next) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.sendStatus(401)

    
    try {
        
    const { rows: sessions } = await db.query(`
     SELECT * FROM sessions WHERE token = $1
    `, [token])

    if (!sessions[0]) return res.status(401).send("Sessao nao encontrada")

    const { rows: users } = await db.query(`
        SELECT * FROM users WHERE id=$1
    `, [sessions[0].userId])

    if(!users[0]) return res.status(401).send("Usuario nao encontrado")

    res.locals.user = users[0]
    
    next()
      
    } catch (err) {
        res.status(500).send(err.message)
    }
}
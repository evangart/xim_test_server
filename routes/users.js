const express = require("express")
const crypto = require("crypto")
const router = express.Router()
const validator = require("email-validator")

const DB = require("../services/db")
const Tokens = require("../services/tokens")
const db = new DB()
const tokens = new Tokens()

const accessCookieOpt = { maxAge: 10 * 60000, httpOnly: true, sameSite: true }
const refreshCookieOpt = { maxAge: 24 * 3600000, httpOnly: true, sameSite: true }

router.post("/signin", async (req, res) => {
  const cookies = req.cookies
  const { email, password } = req.body

  const hash = crypto.createHash("sha256")
  hash.update(password)

  try {
    const { refreshToken } = cookies

    if (refreshToken) {
      const { user } = await tokens.decryptRefresh(refreshToken)
      const activeToken = await db.tokens.get(user.id, refreshToken)
      if (activeToken) return res.json({ message: "User already signed in" })
    }
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: "Internal error" })
  }

  try {
    const user = await db.users.get(email)

    if (!user) return res.status(401).json({ error: "Invalid email" })

    if (user.password !== hash.digest("hex")) {
      res.status(401).json({ error: "Invalid password" })
      return
    }

    const accessToken = await tokens.genAccess(user.id, user.email)
    const refreshToken = await tokens.genRefresh(user.id, user.email)

    await db.tokens.add(user.id, refreshToken)

    res
      .status(201)
      .cookie("accessToken", accessToken, accessCookieOpt)
      .cookie("refreshToken", refreshToken, refreshCookieOpt)
      .json({ message: "Successfully sign in" })
      .end()
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: "Internal error" })
  }
})

router.post("/signin/new_token", async (req, res) => {
  const cookies = req.cookies
  const { refreshToken } = cookies

  if (!refreshToken) return res.status(403).json({ error: "Invalid token" })

  try {
    const { user } = await tokens.decryptRefresh(refreshToken)
    userId = user.id

    const session = await db.tokens.get(userId, refreshToken)
    if (!session) return res.status(401).json({ error: "Token expired" })

    const accessToken = await tokens.regenAccess(refreshToken)
    if (!accessToken) return res.status(403).json({ error: "Invalid token" })

    res
      .status(201)
      .cookie("accessToken", accessToken, accessCookieOpt)
      .cookie("refreshToken", refreshToken, refreshCookieOpt)
      .json({ message: "Token was refreshed successfully" })
      .end()
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: "Internal error" })
  }
})

router.post("/signup", async (req, res) => {
  const { email, password } = req.body

  if (!validator.validate(email)) {
    return res.status(400).json({ error: "Invalid email" })
  }

  if (!password) {
    return res.status(400).json({ error: "Invalid password" })
  }

  try {
    const user = await db.users.get(email)
    if (user) return res.status(400).json({ error: "User already exists" })

    const userId = await db.users.add(email, password)

    const accessToken = await tokens.genAccess(userId, email)
    const refreshToken = await tokens.genRefresh(userId, email)

    res
      .status(201)
      .cookie("accessToken", accessToken, accessCookieOpt)
      .cookie("refreshToken", refreshToken, refreshCookieOpt)
      .json({ message: "Successfully sign up" })
      .end()
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: "Adding user error" })
  }
})

router.get("/info", (req, res) => {
  const cookies = req.cookies
  const { accessToken, refreshToken } = cookies

  if (!accessToken || !refreshToken) {
    res.status(403).json({ error: "Invalid cookies" })
    return
  }

  tokens.decryptAccess(accessToken)
    .then(({ user }) => res.status(200).json({ id: user.id, email: user.email }))
})

router.get("/logout", (req, res) => {
  const cookies = req.cookies
  const { refreshToken } = cookies

  if (!refreshToken) return res.status(403).json({ error: "Invalid token" })

  tokens.decryptRefresh(refreshToken)
    .then(({ user }) => db.tokens.delete(user.id, refreshToken))
    .then(() => res.status(201).json({ message: "Successfully logout" }))
    .catch((err) => {
      console.error(err)
      res.status(400).json({ error: "Internal error" })
    })
})

module.exports = router
import express from "express"
import env from "./config/env.js"
import morgan from "morgan"

export default function createApp() {
  const app = express()

  if (env.NODE_ENV == "development")
    app.use(morgan("dev"))

  //----health route-->>
  app.get("/health", (req, res) => {
    res.json({
      message: "healthy",
    })
  })

  return app
}
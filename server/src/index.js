import morgan from 'morgan'
import express from 'express'
import router from './routes/main.js'
// import cors from 'cors'
import fs from 'fs'
import path from 'path'

const app = express()

app.use(morgan('dev'))
app.use(express.json())
// app.use(cors())

app.use('/static', express.static(path.join(process.cwd(), '..', 'client', 'src')))

app.use(router)

app.get('*', (req, res, next) => {
  if (req.path !== '/') {
    return res.redirect('/')
  }
  next()
})

app.get('/', (req, res) => {
  const htmlPath = path.join(process.cwd(), '..', 'client', 'src', 'index.html')
  fs.readFile(htmlPath, (err, data) => {
    if (err) {
      console.error('Error al leer index.html:', err)
      res.status(500).send('Error interno del servidor')
    } else {
      res.setHeader('Content-Type', 'text/html')
      res.send(data)
    }
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log('Server running on port 5000')
})

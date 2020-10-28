const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.static('build'))


const zahtjevInfo = (req, res, next) => {
    console.log('Metoda:', req.method)
    console.log('Putanja:', req.path)
    console.log('Tijelo:', req.body)
    console.log('---')
    next()
  }
  
  app.use(zahtjevInfo)

let adresar = [
    {
        id: 1,
        ImePrezime: 'Ante Antic',
        Email: 'aantic@pmfst.hr',
        vazno: true
    },
    {
        id: 2,
        ImePrezime: 'Marko Matic',
        Email: 'mmatic@pmfst.hr',
        vazno: true
      }
]

app.get('/', (req, res) => {
    res.send('<h1>Pozdrav od Express servera + nodemona</h1>')
})

app.get('/api/poruke', (req, res) => {
    res.json(adresar)
})

app.get('/api/poruke/:id', (req, res) => {
    const id = Number(req.params.id)
    const korisnik = adresar.find(p => p.id === id)

    if (korisnik) {
        res.json(korisnik)
    } else {
        res.status(404).end()
    }

})
/* app.delete('/api/poruke/:id', (req, res) => {
    const id = Number(req.params.id)
    adresar = adresar.filter(p => p.id !== id)
    res.status(204).end()

}) */

app.put('/api/poruke/:id', (req, res) => {
    const id = Number(req.params.id)
    const podatak = req.body
    adresar = adresar.map(p => p.id !== id ? p : podatak)
    res.json(podatak)

})

app.post('/api/poruke', (req, res) => {
    const maxId = adresar.length > 0
    ? Math.max(...adresar.map(p => p.id))
    : 0

    const podatak = req.body
    if(!podatak.ImePrezime || !podatak.Email){
        return res.status(400).json({
            error: 'Nedostaje sadržaj'
        })
    }
    const korisnik = {
        ImePrezime: podatak.ImePrezime,
        Email: podatak.Email,
        vazno: podatak.vazno || false,
        id: maxId + 1
    }

    adresar = adresar.concat(korisnik) 
    res.json(korisnik)
})

const nepoznataRuta = (req, res) => {
    res.status(404).send({ error: 'nepostojeca ruta' })
  }
  
  app.use(nepoznataRuta)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server sluša na portu ${PORT}`);
})
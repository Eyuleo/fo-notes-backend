require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Note = require('./models/note.js')
const app = express()

app.use(express.json())

app.use(cors())

app.use(express.static('dist'))

app.get('/api/notes', (req, res) => {
	Note.find({}).then((notes) => {
		res.json(notes)
	})
})

app.get('/api/notes/:id', (req, res) => {
	Note.findById(req.params.id).then((note) => {
		res.json(note)
	})
})

app.post('/api/notes', (req, res) => {
	const body = req.body

	if (!body.content) {
		return res.status(400).json({
			error: 'Content missing',
		})
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
	})
	note.save().then((savedNote) => {
		res.json(savedNote)
	})
})

app.delete('/api/notes/:id', (req, res) => {
	const id = +req.params.id
	notes = notes.filter((note) => note.id !== id)
	res.status(204).end()
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

require('dotenv').config()
const express = require('express')
const Note = require('./models/note.js')
const app = express()
const cors = require('cors')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

app.get('/api/notes', (req, res) => {
	Note.find({}).then((notes) => {
		res.json(notes)
	})
})

app.get('/api/notes/:id', (req, res, next) => {
	Note.findById(req.params.id)
		.then((note) => {
			if (note) {
				res.json(note)
			} else {
				res.status(404).end()
			}
		})
		.catch((error) => next(error))
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

app.put('/api/notes/:id', (req, res, next) => {
	const body = req.body

	const note = {
		content: body.content,
		important: body.important,
	}

	console.log(note)

	Note.findByIdAndUpdate(req.params.id, note, { new: true })
		.then((updatedNote) => {
			res.json(updatedNote)
		})
		.catch((error) => next(error))
})

app.delete('/api/notes/:id', (req, res, next) => {
	Note.findByIdAndDelete(req.params.id)
		.then(() => {
			res.status(204).end()
		})
		.catch((error) => next(error))
})

const errorHandler = (error, req, res, next) => {
	console.error(error.message)
	if (error.name === 'Cast error') {
		return res.status(400).send({ error: 'malformatted id' })
	}
	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

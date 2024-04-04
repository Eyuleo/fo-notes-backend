import express from 'express'
import cors from 'cors'

const app = express()

app.use(express.json())

app.use(cors())

let notes = [
	{
		id: 1,
		content: 'HTML is easy',
		important: true,
	},
	{
		id: 2,
		content: 'Browser can execute only JavaScript',
		important: false,
	},
	{
		id: 3,
		content: 'GET and POST are the most important methods of HTTP protocol',
		important: true,
	},
]

app.get('/', (req, res) => {
	res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
	res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
	const id = +req.params.id
	const note = notes.find((note) => note.id === id)
	if (note) {
		res.json(note)
	} else {
		res.status(404).send('<h1>Not found!</h1>').end()
	}
})

const generateId = () => {
	const maxId = notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0
	return maxId + 1
}

app.post('/api/notes', (req, res) => {
	const body = req.body

	if (!body.content) {
		return res.status(400).json({
			error: 'Content missing',
		})
	}

	const note = {
		content: body.content,
		important: Boolean(body.important) || false,
		id: generateId(),
	}
	notes = notes.concat(note)
	res.json(note)
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
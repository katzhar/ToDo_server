const {Router} = require('express');
const router = Router();
const authenticate = require('../authenticate');
const asyncHandler = require('express-async-handler');
const Users = require('../models/users');
const {v4: uuidv4} = require('uuid');

router.get('/', authenticate.verifyUser, asyncHandler(async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	const isTokenBlacklisted = await authenticate.isBlacklisted(token);
	if (isTokenBlacklisted)
		return res.status(401).send('Token is invalid');
	const todo = await Users.findOne({_id: req.user._id}, 'tasks');
	return res.status(200).send(todo || []);
}));

router.delete('/:id', authenticate.verifyUser, asyncHandler(async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	const isTokenBlacklisted = await authenticate.isBlacklisted(token);
	if (isTokenBlacklisted)
		return res.status(401).send('Token is invalid');
	else {
		let taskId = req.params["id"];
		let task = await Users.findOne({_id: req.user._id}, {'tasks': {$elemMatch: {'id': taskId}}});
		if (!task.tasks[0])
			return res.status(400).send('Id not found');
		else {
			await Users.updateOne({_id: req.user._id}, {$pull: {"tasks": {id: taskId}}},
				(err, result) => {
					if (err)
						res.status(500).send('Error');
					else
						res.status(200).send('Success');
				})
		}
	}
}));

router.post('/', authenticate.verifyUser, asyncHandler(async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	const isTokenBlacklisted = await authenticate.isBlacklisted(token);
	if (isTokenBlacklisted)
		return res.status(401).send('Token is invalid');
	if (typeof req.body.title !== "string" || typeof req.body.type !== "string" || typeof req.body.date !== "string")
		return res.status(400).send('Wrong typeof title/type/date');
	else {
		let data = {
			id: uuidv4(),
			title: req.body.title,
			type: req.body.type,
			date: req.body.date,
			description: req.body.description || '',
			completed: false
		}
		await Users.updateOne({_id: req.user._id},
			{$addToSet: {tasks: data}},
			(err, result) => {
				if (err)
					res.status(500).send('Error');
				else if (!result)
					res.status(400).send('Task not found');
				else
					res.status(200).send(data);
			})
	}
}));

router.put('/:id', authenticate.verifyUser, asyncHandler(async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	const isTokenBlacklisted = await authenticate.isBlacklisted(token);
	if (isTokenBlacklisted)
		return res.status(401).send('Token is invalid');
	else {
		let taskId = req.params["id"];
		let task = await Users.findOne({_id: req.user._id}, {'tasks': {$elemMatch: {'id': taskId}}});
		if (!task.tasks[0])
			return res.status(400).send('Id not found');
		else {
			let todo = task.tasks[0];
			let todoKeys = Object.keys(req.body);
			if (todoKeys.indexOf('title') !== -1)
				todo.title = req.body.title;
			if (todoKeys.indexOf('type') !== -1)
				todo.type = req.body.type;
			if (todoKeys.indexOf('date') !== -1)
				todo.date = req.body.date;
			if (todoKeys.indexOf('description') !== -1)
				todo.description = req.body.description;
			if (todoKeys.indexOf('completed') !== -1)
				todo.completed = req.body.completed;
			if(todoKeys.indexOf('title') === -1 && todoKeys.indexOf('type') === -1 && todoKeys.indexOf('date') === -1
				&& todoKeys.indexOf('completed') === -1 && todoKeys.indexOf('description') === -1)
				return res.status(400).send("Wrong param");
			await Users.updateOne({_id: req.user._id, "tasks.id": taskId}, {
					$set: {
						"tasks.$.title": todo.title,
						"tasks.$.description": todo.description,
						"tasks.$.type": todo.type,
						"tasks.$.date": todo.date,
						"tasks.$.completed": todo.completed
					}
				},
				(err, result) => {
					if (err)
						res.status(500).send('Error');
					else if (!result)
						res.status(400).send('Task not found');
					else
						res.status(200).send('Success');
				})
		}
	}
}));

module.exports = router;
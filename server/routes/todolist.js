const { Router } = require('express');
const router = Router();
const authenticate = require('../authenticate');
const asyncHandler = require('express-async-handler');
const Users = require('../models/users');

router.get('/', asyncHandler(async (req, res) => {
	const todo = await Users.findOne({ _id: req.user._id }, 'tasks')
	res.status(200).send(todo || []);
}));

router.post('/delete', authenticate.verifyUser, asyncHandler(async (req, res) => {
	await Users.updateOne({ _id: req.user._id }, { $pull: { "tasks": { id: req.body.id } } },
		(err, result) => {
			if (err)
				res.status(500).send('Error');
			else if (!result)
				res.status(400).send('Task not found');
		})
	res.status(200).send('success');
}));

router.put('/create', authenticate.verifyUser, asyncHandler(async (req, res) => {
	await Users.updateOne({ _id: req.user._id },
		{ $addToSet: { tasks: { ...req.body, completed: false } } },
		(err, result) => {
			if (err)
				res.status(500).send('Error');
			else if (!result)
				res.status(400).send('Task not found');
		})
	res.status(200).send('success');
}));

router.post('/complete', authenticate.verifyUser, asyncHandler(async (req, res) => {
	let task = await Users.findOne({ _id: req.user._id }, { 'tasks': { $elemMatch: { 'id': req.body.id } } });
	if (!task)
		res.status(400);
	let status = task.tasks[0].completed;
	await Users.updateOne({ _id: req.user._id, "tasks.id": req.body.id }, { $set: { "tasks.$.completed": !status } }),
		(err, result) => {
			if (err)
				res.status(500).send('Error');
			else if (!result)
				res.status(400).send('Task not found');
		}
	res.status(200).send('success');
}));

router.post('/change', authenticate.verifyUser, asyncHandler(async (req, res) => {
	await Users.updateOne({ _id: req.user._id, "tasks.id": req.body.id }, {
		$set: {
			"tasks.$.title": req.body.title,
			"tasks.$.description": req.body.description,
			"tasks.$.type": req.body.type,
			"tasks.$.date": req.body.date
		}
	}, (err, result) => {
		if (err)
			res.status(500).send('Error');
		else if (!result)
			res.status(400).send('Task not found');
	})
	res.status(200).send('success');
}));

module.exports = router;
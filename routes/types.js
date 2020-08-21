const { Router } = require('express');
const router = Router();
const authenticate = require('../authenticate');
const asyncHandler = require('express-async-handler');
const Users = require('../models/users');
const { v4: uuidv4 } = require('uuid');

router.get('/', authenticate.verifyUser, asyncHandler(async (req, res) => {
	const todo = await Users.findOne({ _id: req.user._id }, 'types');
	res.status(200).send(todo || []);
}));

router.delete('/:id', authenticate.verifyUser, asyncHandler(async (req, res) => {
	let typeId = req.params["id"];
	await Users.updateOne({ _id: req.user._id }, { $pull: { "types": { id: typeId } } },
		(err, result) => {
			if (err)
				res.status(500).send('Error');
			else if (!result)
				res.status(400).send('Type not found');
		})
	res.status(200).send('success');
}));

router.post('/', authenticate.verifyUser, asyncHandler(async (req, res) => {
	console.log(req.body);
	let data = {
		id: uuidv4(),
		name: req.body.name,
		colorId: req.body.colorId || '',
	}
	await Users.updateOne({ _id: req.user._id },
		{ $addToSet: { types: data } },
		(err, result) => {
			if (err)
				res.status(500).send('Error');
			else if (!result)
				res.status(400).send('Error');
		})
	res.status(201).send(data);
}));

router.put('/:id', authenticate.verifyUser, asyncHandler(async (req, res) => {
	let typeId = req.params["id"];
	let types = await Users.findOne({ _id: req.user._id }, { 'types': { $elemMatch: { 'id': typeId } } });
	if (!types)
		res.status(400).send('id not found');
	let type = types.types[0];
	let typeKeys = Object.keys(req.body);
	if (typeKeys.indexOf('name') !== -1)
		type.name = req.body.name;
	if (typeKeys.indexOf('colorId') !== -1)
		type.colorId = req.body.colorId;
	await Users.updateOne({ _id: req.user._id, "types.id": typeId }, {
		$set: {
			"types.$.colorId": type.colorId,
			"types.$.name": type.name,
		}
	},
		(err, result) => {
			if (err)
				res.status(500).send('Error');
			else if (!result)
				res.status(400).send('Type not found');
		})
	res.status(200).send('success');
})); 

module.exports = router;
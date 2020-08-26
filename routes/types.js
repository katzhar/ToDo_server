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
	const todo = await Users.findOne({_id: req.user._id}, 'types');
	return res.status(200).send(todo || []);
}));

router.delete('/:id', authenticate.verifyUser, asyncHandler(async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	const isTokenBlacklisted = await authenticate.isBlacklisted(token);
	if (isTokenBlacklisted)
		return res.status(401).send('Token is invalid');
	else {
		let typeId = req.params["id"];
		let type = await Users.findOne({_id: req.user._id}, {'types': {$elemMatch: {'id': typeId}}});
		if (!type.types[0])
			return res.status(400).send('Id not found');
		else {
			await Users.updateOne({_id: req.user._id}, {$pull: {"types": {id: typeId}}},
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
	if (typeof req.body.name !== "string")
		return res.status(400).send('Wrong typeof name');
	else {
		let data = {
			id: uuidv4(),
			name: req.body.name,
			colorId: req.body.colorId || '',
		}
		await Users.updateOne({_id: req.user._id},
			{$addToSet: {types: data}},
			(err, result) => {
				if (err)
					res.status(500).send('Error');
				else
					res.status(201).send(data);
			})
	}
}));

router.put('/:id', authenticate.verifyUser, asyncHandler(async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	const isTokenBlacklisted = await authenticate.isBlacklisted(token);
	if (isTokenBlacklisted)
		return res.status(401).send('Token is invalid');
	else {
		let typeId = req.params["id"];
		let types = await Users.findOne({_id: req.user._id}, {'types': {$elemMatch: {'id': typeId}}});
		if (!types.types[0])
			return res.status(400).send('id not found');
		else {
			let type = types.types[0];
			let typeKeys = Object.keys(req.body);
			if (typeKeys.indexOf('name') !== -1) {
				if (typeof req.body.name !== "string")
					return res.status(400).send('Wrong typeof name')
				else
					type.name = req.body.name;
			}
			if (typeKeys.indexOf('name') === -1)
				return res.status(400).send('Wrong param');
			await Users.updateOne({_id: req.user._id, "types.id": typeId}, {
					$set: {
						"types.$.colorId": type.colorId,
						"types.$.name": type.name,
					}
				},
				(err, result) => {
					if (err)
						res.status(500).send('Error');
					else
						res.status(200).send('Success');
				})
		}
	}
}));

module.exports = router;
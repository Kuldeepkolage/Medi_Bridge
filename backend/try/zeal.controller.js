import { Zeal } from "./Zeal.model.js";

export const createEvent = async (req, res) => {
	const { eventName, eventDate, eventTime, location } = req.body;

	const zeal = await Zeal.create({
		eventName,
		eventDate,
		eventTime,
		location,
	});

    res.status(201).json(zeal);

};

export const showEvents = async (req,res)=>{
    const zeal = await Zeal.find()
    res.status(200).json(zeal)
}

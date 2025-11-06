// routes/hotelRoutes.js
import { Router } from "express";
import { createEvent, showEvents } from "../controllers/zeal.controller.js";
const zealRouter = Router();

zealRouter.route("/addEvent")
.post(createEvent)

zealRouter.route("/getEvents").
get(showEvents)

// .get(getHotels);
// zealRouter
// 	.route("/:id")
// 	.get(getHotelById)
// 	.put(updateHotel)
// 	.delete(deleteHotel);
// //search by name
// zealRouter.route("/search/:name").get(getHotelByName);
export default zealRouter;

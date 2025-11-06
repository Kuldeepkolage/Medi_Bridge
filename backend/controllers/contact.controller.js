import Contact from "../models/Contact.model.js";

export async function createContact(req, res) {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ success: true, message: "Contact inquiry sent!", data: contact });
  } catch (err) {
    res.status(400).json({ success: false, message: "Error in inquiry", error: err.message });
  }
}

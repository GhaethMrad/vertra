import MessageModel from "../../models/Message.model.js"

export const message = async (req, res) => {
    try {
        const newMessage = new MessageModel({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        })
        await newMessage.save();
        res.status(201).json({message: "The operation was completed successfully"})
    } catch (error) {
        res.json({message: error.message})
    }
}

export const deleteOne = async (req, res) => {
    try {
        const message = await MessageModel.findById(req.params.id)
        await message.deleteOne();
        res.status(200).redirect("/message?done")
    } catch (error) {
        res.json({message: error.message})
    }
}

export const deleteAll = async (req, res) => {
    try {
        await MessageModel.deleteMany();
        res.status(200).redirect("/message?done")
    } catch (error) {
        res.json({message: error.message})
    }
}
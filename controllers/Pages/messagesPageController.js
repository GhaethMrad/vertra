import MessageModel from "../../models/Message.model.js"

export const allMessage = async (req, res) => {
    res.render("layout.ejs", {
        title: "Messages",
        page: "pages/messages/messages.ejs",
        pageName: "All Message",
        data: await MessageModel.find()
    })
}
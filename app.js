import express from "express";
import { connectDB } from "./config/db.js";
import fileUpload from "express-fileupload";
import session from "express-session";
import methodOverride from "method-override";
import expressLayouts from "express-ejs-layouts";
import MongoStore from "connect-mongo";
import pages from "./routes/pages.js";
import api from "./routes/api.js";
import cors from "cors";
import helmet from "helmet";
import csurf from "csurf";
import { createAdminIfNotExists } from "./config/createAdminIfNotExists.js";
import { createInformations } from "./config/createInformations.js";

const app = express();

app.use(helmet())
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css'
      ],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://cdn.jsdelivr.net/npm/sweetalert2@11',
        'https://cdn.tailwindcss.com',
      ],
    }
}));
app.use(fileUpload({
    limits: {
        fileSize: 3000000,
    },
}));
app.use(cors({
    origin: "http://localhost:3000/",
    credentials: true
}))
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: MongoStore.create({mongoUrl: process.env.DBURL}),
    cookie: { 
        secure: false,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 4,
    }
}));
app.use(csurf());
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken(); // حتى توصله بالـ EJS
  next();
});
app.use(pages)
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use("/api", api)
app.use(expressLayouts)

connectDB.then(async () => {
    console.log("Connected DB✅");
    await createAdminIfNotExists()
    await createInformations()
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server Started Follow Link✅`);
        console.log(`[http://localhost:${process.env.PORT || 3000}]`)
    })
}).catch((error) => {
    console.error(error.message);
})
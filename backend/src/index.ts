import "dotenv/config";
import app from "./app";
import connectDB from "./db";

const port = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on PORT ${port}`);
        })
    })
    .catch((err) => {
        console.error("MONGODB connection error: ", err);
        process.exit(1);
    });

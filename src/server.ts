import express from "express";
import axios, {AxiosResponse} from "axios";
import { config } from "dotenv"

config();
const API_KEY = <string>process.env.API_KEY;

const app = express();
const port = 8000;

export interface Welcome {
    rovers: Rover[];
}

export interface Rover {
    id:           number;
    name:         string;
    landing_date: Date;
    launch_date:  Date;
    status:       string;
    max_sol:      number;
    max_date:     Date;
    total_photos: number;
    cameras:      Camera[];
}

export interface Camera {
    name:      string;
    full_name: string;
}

app.use(express.json());
const router = express.Router();
router.get('/rovers', async (req, res) => {
    const response: AxiosResponse<Welcome, any> = await axios.get(
        `https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${API_KEY}`
    )

    res.json(response.data.rovers);
});
app.use('/', router);

app.listen(port, () => {
    console.log(`Test backend is running on port ${port}`);
});

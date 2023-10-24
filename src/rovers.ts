import {Router} from "express";
import axios from "axios";
import {Rovers} from "./server";
import { config } from "dotenv"
config();
const API_KEY = <string>process.env.API_KEY;

export function addRoverEndpoint(router: Router) {
    router.get('/rovers', async (req, res) => {
        const response = await axios.get<Rovers>(
            `https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${API_KEY}`
        )

        const data = response.data.rovers.map(rover => ({
            id: rover.id,
            name: rover.name
        }))

        res.json(data);
    });
}
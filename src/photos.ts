import {Router} from "express";
import axios, {AxiosResponse} from "axios";
import {Rovers} from "./server";
import { config } from "dotenv"
config();
const API_KEY = <string>process.env.API_KEY;

export function addRoverEndpoint(router: Router) {
    router.get('/rovers', async (req, res) => {
        const response: AxiosResponse<Rovers, any> = await axios.get(
            `https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${API_KEY}`
        )

        res.json(response.data.rovers);
    });
}
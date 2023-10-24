import {Router} from "express";
import axios, {AxiosError} from "axios";
import { config } from "dotenv"
import {Rover} from "./server";
config();
const API_KEY = <string>process.env.API_KEY;

export interface RoverResponse {
    rover: Rover;
}


export function addCamerasEndpoint(router: Router) {
    router.get('/rovers/:roverName/cameras', async (req, res, next) => {
        const { roverName } = req.params;
        const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}`

        try {
            const response = await axios.get<RoverResponse>(url, {
                params: {
                    api_key: API_KEY,
                }
            })

            const data = response.data.rover.cameras.map(camera => ({
                name: camera.name,
                fullName: camera.full_name
            }))

            res.send(data);
        } catch (e) {
            if (e instanceof AxiosError) {
                res.status(404);
                res.send("could not find this rover");
                return;
            }

            next(e);
        }
    });
}
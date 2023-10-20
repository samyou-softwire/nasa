import {Router} from "express";
import axios, {AxiosResponse} from "axios";
import {Rovers} from "./server";
import { config } from "dotenv"
config();
const API_KEY = <string>process.env.API_KEY;

export interface PhotosResponse {
    photos: Photo[];
}

export interface Photo {
    id:         number;
    sol:        number;
    camera:     PhotoCamera;
    img_src:    string;
    earth_date: Date;
    rover:      Rover;
}

export interface PhotoCamera {
    id:        number;
    name:      CameraName;
    rover_id:  number;
    full_name: FullName;
}

export type FullName = "Front Hazard Avoidance Camera" | "Rear Hazard Avoidance Camera" | "Mast Camera" | "Chemistry and Camera Complex" | "Navigation Camera" | "Mars Hand Lens Imager" | "Mars Descent Imager";

export type CameraName = "FHAZ" | "RHAZ" | "MAST" | "CHEMCAM" | "NAVCAM" | "MAHLI" | "MARDI";

export interface Rover {
    id:           number;
    name:         RoverName;
    landing_date: Date;
    launch_date:  Date;
    status:       Status;
    max_sol:      number;
    max_date:     Date;
    total_photos: number;
    cameras:      CameraElement[];
}

export interface CameraElement {
    name:      CameraName;
    full_name: FullName;
}

export type RoverName = "Curiosity";

export type Status = "active";


export function addPhotosEndpoint(router: Router) {
    router.get('/rovers/:roverName/photos/:camera', async (req, res) => {
        const { roverName, camera } = req.params;
        const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos`

        const response: AxiosResponse<PhotosResponse> = await axios.get(url, {
            params: {
                sol: 1000,
                camera: camera,
                api_key: API_KEY
            }
        });

        const src = response.data.photos[0].img_src;

        // quick html document
        const html = `<!doctype html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
             <meta http-equiv="X-UA-Compatible" content="ie=edge">
             <title>Your Image</title>
        </head>
        <body>
             <img src="${src}">
        </body>
        </html>`;

        res.send(html);
    });
}
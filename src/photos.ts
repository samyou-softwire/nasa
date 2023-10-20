import {Router} from "express";
import axios from "axios";
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

        const response: { data: PhotosResponse } = await axios.get(url, {
            params: {
                sol: 1000,
                camera: camera,
                api_key: API_KEY
            }
        }).catch(_ => {
            return {
                data: {
                    photos: []
                }
            }
        });

        if (response.data.photos.length === 0) {
            res.send("bad");
            return;
        }

        const data = response.data.photos.map(photo => ({
            src: photo.img_src,
            camera: photo.camera.name,
            rover: photo.rover.name,
            id: photo.id
        }));

        res.send(data);
    });
}
import express from "express";
import {addRoverEndpoint} from "./rovers";
import {addPhotosEndpoint} from "./photos";
import {addCamerasEndpoint} from "./cameras";

const app = express();
const port = 8000;

export interface Rovers {
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

addRoverEndpoint(router);
addPhotosEndpoint(router);
addCamerasEndpoint(router);

app.use('/', router);

app.listen(port, () => {
    console.log(`Test backend is running on port ${port}`);
});

require('dotenv').config();
const express = require('express');
const app = express();
const consign = require('consign');

consign()
    .include('libs/config.js')
    .include('libs/middlewares.js')
    .include('libs/routing.config.js')
    .include('libs/boot.js')
    .into(app, express);
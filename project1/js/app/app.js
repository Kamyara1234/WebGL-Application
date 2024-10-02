'use strict';

import Input from "../input/input.js";
import AppState from "./appstate.js";
import Shader from "../utils/shader.js";
import { hex2rgb } from "../utils/utils.js";
import { WebGlApp } from "../../assignment0.js";

class App {
    constructor() {
        console.log("Initializing App");
        this.impl = new WebGlApp();
        this.canvas = document.getElementById("canvas");
        this.canvas.addEventListener("contextmenu", event => event.preventDefault());
        this.gl = this.initGl();

        console.log("Loading Shaders");
        this.shader = new Shader(this.gl, "../../shaders/vertex.glsl", "../../shaders/fragment.glsl");

        this.resizeToDisplay();
        this.initial_width = this.canvas.width;
        this.initial_height = this.canvas.height;
        window.onresize = this.resizeToDisplay.bind(this);

        this.app_state = new AppState();
    }

    initGl() {
        return this.impl.initGl();
    }

    resizeToDisplay() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    start() {
        requestAnimationFrame(() => {
            this.update();
        });
    }

    update() {
        this.app_state.update();

        if (Input.isMouseClicked(0)) {
            let scalex = (this.initial_width / this.canvas.width);
            let scaley = (this.initial_height / this.canvas.height);
            let position = [Input.mousex * scalex, Input.mousey * scaley];

            let triangleSideLength = this.initial_width / 15 * Math.sqrt(2);
            this.impl.addTriangle(this.gl, this.shader, position, triangleSideLength);
        }

        if (this.app_state.getState('Canvas') === "Clear Canvas") {
            this.impl.clearShapes();
        }

        Input.update();
        this.render();
        requestAnimationFrame(() => {
            this.update();
        });
    }

    render() {
        this.shader.use();
        this.shader.setUniform2f("u_resolution", new Float32Array([this.initial_width, this.initial_height]));
        this.impl.render(this.gl, this.canvas.width, this.canvas.height);
    }
}


export default App;

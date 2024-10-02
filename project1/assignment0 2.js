import { hex2rgb, deg2rad } from './js/utils/utils.js';

/**
 * @Class
 * Base class for all drawable shapes
 */
class Shape {
    constructor(gl, shader, vertices, indices, color, drawMode, numElements) {
        this.shader = shader;

        this.vertices = vertices;
        this.vbo = null; 
        this.initVBO(gl);

        this.indices = indices;
        this.ibo = null;
        this.initIBO(gl);

        this.color = color;

        this.drawMode = drawMode;

        this.componentsPerVertex = 2;
        this.numElements = numElements;

        this.vao = null; 
        this.initVAO(gl, shader);
    }

    initVAO(gl, shader) {
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        const posAttribLoc = gl.getAttribLocation(shader.program, 'a_position');
        gl.vertexAttribPointer(posAttribLoc, this.componentsPerVertex, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posAttribLoc);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);

        gl.bindVertexArray(null);
    }

    initVBO(gl) {
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    }

    initIBO(gl) {
        this.ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

    render(gl) {
        gl.bindVertexArray(this.vao);
        this.shader.setUniform3f("u_color", new Float32Array(this.color)); 
        gl.drawElements(this.drawMode, this.indices.length, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }
}

/**
 * @Class
 * Triangle class extending Shape.
 */
class Triangle extends Shape {
    constructor(gl, shader, position, color, sideLength) {
        const cosAngle = Math.cos(deg2rad(30));
        const sinAngle = Math.sin(deg2rad(30));

        const vertices = [
            position[0], position[1] - sideLength / 1.5,  
            position[0] - sideLength * cosAngle, position[1] + sideLength * sinAngle,  
            position[0] + sideLength * cosAngle, position[1] + sideLength * sinAngle   
        ];

        const indices = [0, 1, 2];

        super(gl, shader, vertices, indices, color, gl.TRIANGLES, indices.length);
    }
}

/**
 * @Class
 * WebGL App that handles the rendering and drawing.
 */
class WebGlApp {
    constructor() {
        this.shapeList = [];  
    }

    initGl() {
        const canvas = document.getElementById('canvas');
        return canvas.getContext('webgl2');
    }

    setViewport(gl, width, height) {
        gl.viewport(0, 0, width, height);
    }

    clearCanvas(gl) {
        const backgroundColor = hex2rgb('#1E3D58');  
        gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    addTriangle(gl, shader, position, sideLength) {
        const triangleColor = hex2rgb('#FF5733');  
        const triangle = new Triangle(gl, shader, position, triangleColor, sideLength);
        this.shapeList.push(triangle);  
    }

    clearShapes() {
        this.shapeList = [];
    }

    render(gl, canvasWidth, canvasHeight) {
        this.setViewport(gl, canvasWidth, canvasHeight);
        this.clearCanvas(gl);

        for (const shape of this.shapeList) {
            shape.render(gl);
        }
    }
}

export {
    Triangle,
    WebGlApp
};

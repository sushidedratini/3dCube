var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

const Point2D = function(x, y) { this.x = x; this.y = y; }
const Point3D = function(x, y, z) { this.x = x; this.y = y; this.z = z; }

const Cube = function(x, y, z, size) {
    Point3D.call(this, x, y, z);
    size *= 0.5; // Represents width, depth and height of the cube
    this.vertices = [new Point3D(x - size, y - size, z - size),
                     new Point3D(x + size, y - size, z - size),
                     new Point3D(x + size, y + size, z - size),
                     new Point3D(x - size, y + size, z - size),
                     new Point3D(x - size, y - size, z + size),
                     new Point3D(x + size, y - size, z + size),
                     new Point3D(x + size, y + size, z + size),
                     new Point3D(x - size, y + size, z + size)];
    
    // Cube faces clock-wise
    this.faces = [[0, 1, 2, 3], [0, 4, 5, 1], [1, 5, 6, 2], 
                  [3, 2, 6, 7], [0, 3, 7, 4], [4, 7, 6, 5]];
}

Cube.prototype = {
    rotateX:function(radian) {
        var cosine = Math.cos(radian);
        var sine = Math.sin(radian);
        for (let index = this.vertices.length -1; index > -1; --index) {
            let p = this.vertices[index];
            let y = (p.y - this.y) * cosine - (p.z - this.z) * sine;
            let z = (p.y - this.y) * sine + (p.z - this.z) * cosine;

            p.y = y + this.y;
            p.z = z + this.z;
        }
    },
    rotateY:function(radian) {
        var cosine = Math.cos(radian);
        var sine = Math.sin(radian);
        for (let index = this.vertices.length -1; index > -1; --index) {
            let p = this.vertices[index];
            let x = (p.z - this.z) * sine + (p.x - this.x) * cosine;
            let z = (p.z - this.z) * cosine - (p.x - this.x) * sine;

            p.x = x + this.x;
            p.z = z + this.z;
        }
    }
};

var cube = new Cube(0, 0, 400, 200);

function project(points3d, width, height) {
    var points2d = new Array(points3d.length);
    var focalLenght = 200; // 3D distance from viewer to object

    for (let index = points3d.length -1; index > -1; --index) {
        let p = points3d[index];
        let x = p.x * (focalLenght / p.z) + width * 0.5;
        let y = p.y * (focalLenght / p.z) + height * 0.5;

        points2d[index] = new Point2D(x, y);
    }

    return points2d;
}
 
function loop() {
    window.requestAnimationFrame(loop);

    var height = document.documentElement.clientHeight;
    var width = document.documentElement.clientWidth;

    context.canvas.height = height;
    context.canvas.width = width;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = '#000000';

    cube.rotateX(0.02);
    cube.rotateY(-0.01);

    var vertices = project(cube.vertices, width, height);
    
    for (let index = cube.faces.length -1; index > -1; --index) {
        let face = cube.faces[index];
        context.beginPath();
        context.moveTo(vertices[face[0]].x, vertices[face[0]].y);
        context.lineTo(vertices[face[1]].x, vertices[face[1]].y);
        context.lineTo(vertices[face[2]].x, vertices[face[2]].y);
        context.lineTo(vertices[face[3]].x, vertices[face[3]].y);
        context.closePath();
        context.stroke();
    }

}

loop();
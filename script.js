const mazeElement = document.getElementById("maze");
const joystickElement = document.getElementById("joystick-head");
const noteElement = document.getElementById("note");
let hardMode = false;
let previousTimStamp;
let gameInProgress;
let mouseStartX;
let mouseStartY;
let accelerationX;
let accelerationY;
let frictionX;
let frictionY;
const pathW=25;
const wallW=10;
const ballSize=10;
const holeSize=20;
const debugMode=false;
let balls=[];
let ballElement=[];
let holeElement=[];
Math.minmax = function (value,limit) {
    return Math.max(Math.min(value,limit),-limit);
}
const distance2D=(p1,p2)=>Math.sqrt((p1.x-p2.x)**2+(p1.y-p2.y)**2);
const getAngle=(p1,p2)=>{
    Math.atan2(p2.y-p1.y,p2.x-p1.x)
    if(p2.x-p1.x<0){
        angle+=Math.PI;
    }
    return getAngle;
};
const closestItCanBe=(cap,ball)=>{
    let angle=getAngle(cap,ball);
    const deltaX= Math.cos(angle)*(wallW/2+ballSize/2);
    const deltaY= Math.sin(angle)*(wallW/2+ballSize/2);
    return {x:cap.x+deltaX,y:cap.y+deltaY};
}
const rollAroundCap=(cap,ball)=>{
    let impactAngle=getAngle(cap,ball);
    let heading=getAngle(
        {x:0,y:0},
        {x:ball.velocityX,y:ball.velocityY}
    )
    let impactHeadingAngle=impactAngle-heading;
    const velocityMagnitude=distance2D(
        {x:0,y:0},
        {x:ball.velocityX,y:ball.velocityY}
    );
    const velocityMagnitudeDiagonalToTheImpact=Math.sin(impactHeadingAngle)*velocityMagnitude;
    const closestDistance=wallW/2+ballSize/2;
    const rotationAngle=Math.atan(
        velocityMagnitudeDiagonalToTheImpact/closestDistance
    )
    const deltaFromCap={
        x: Math.cos(impactAngle+Math.PI-rotationAngle)*closestDistance,
        y: Math.sin(impactAngle+Math.PI-rotationAngle)*closestDistance
    }
    const x=ball.x
    const y=ball.y
    const velocityX=ball.x-(cap.x+deltaFromCap.x);
    const velocityY=ball.y-(cap.y+deltaFromCap.y);
    const nextX=x+velocityX;
    const nextY=y+velocityY;
    return {x,y,velocityX,velocityY,nextX,nextY};
};
const slow=(number,difference)=>{
    if(Math.abs(number)<difference){
        return 0;
    }
    if(number>difference){
        return number-difference;
    }
    return number+difference;
};
balls.forEach(({x,y})=>{
    const ball = document.createElement("div");
    ball.setAttribute("class","ball");
    ball.style.cssText = `
        left: ${x}px;
        top: ${y}px;
    `;
    mazeElement.appendChild(ball);
    ballElement.push(ball);
})
const walls=[
    {column:0,row:0,horizontal:true,length:10},
    {column:0,row:0,horizontal:false,length:9},
    {column:0,row:9,horizontal:true,length:10},
    {column:10,row:0,horizontal:false,length:9},
    // horizontal
    {column:0,row:6,horizontal:true,length:1},
    {column:0,row:8,horizontal:true,length:1},
    {column:1,row:1,horizontal:true,length:2},
    {column:1,row:7,horizontal:true,length:1},
    {column:2,row:2,horizontal:true,length:2},
    {column:2,row:4,horizontal:true,length:1},
    {column:2,row:5,horizontal:true,length:1},
    {column:2,row:6,horizontal:true,length:1},
    {column:3,row:3,horizontal:true,length:1},
    {column:3,row:8,horizontal:true,length:3},
    {column:4,row:6,horizontal:true,length:1},
    {column:5,row:2,horizontal:true,length:2},
    {column:5,row:5,horizontal:true,length:1},
    {column:6,row:1,horizontal:true,length:1},
    {column:6,row:6,horizontal:true,length:2},
    {column:7,row:3,horizontal:true,length:2},
    {column:7,row:7,horizontal:true,length:2},
    {column:8,row:1,horizontal:true,length:1},
    {column:8,row:2,horizontal:true,length:1},
    {column:8,row:3,horizontal:true,length:1},
    {column:8,row:4,horizontal:true,length:2},
    {column:8,row:8,horizontal:true,length:2},
    {column:1,row:1,horizontal:false,length:2},
    {column:1,row:4,horizontal:false,length:2},
    {column:2,row:2,horizontal:false,length:2},
    {column:2,row:5,horizontal:false,length:1},
    {column:2,row:7,horizontal:false,length:2},
    {column:3,row:0,horizontal:false,length:1},
    {column:3,row:4,horizontal:false,length:1},
    {column:3,row:6,horizontal:false,length:2},
    {column:4,row:1,horizontal:false,length:2},
    {column:4,row:6,horizontal:false,length:1},
    {column:5,row:0,horizontal:false,length:2},
    {column:5,row:6,horizontal:false,length:1},
    {column:5,row:8,horizontal:false,length:1},
    {column:6,row:4,horizontal:false,length:1},
    {column:6,row:7,horizontal:false,length:2},
    {column:7,row:0,horizontal:false,length:1},
    {column:7,row:2,horizontal:false,length:1},
    {column:7,row:4,horizontal:false,length:1},
    {column:7,row:6,horizontal:false,length:1},
    {column:8,row:0,horizontal:false,length:1},
    {column:8,row:2,horizontal:false,length:1},
    {column:9,row:41,horizontal:false,length:1},
    {column:9,row:42,horizontal:false,length:1},
].map((wall)=>({
    x:wall.column*(pathW+wallW),
    y:wall.row*(pathW+wallW),
    horizontal:wall.horizontal,
    length:wall.length,
}))
walls.forEach(({x,y,horizontal,length})=>{
    const wall = document.createElement("div");
    wall.setAttribute("class","wall");
    wall.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${horizontal?wallW:pathW*length}px;
        height: ${horizontal?pathW*length:wallW}px;
    `;
    mazeElement.appendChild(wall);
})
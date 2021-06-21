const canvas=document.getElementById("cvs");
const cxt=canvas.getContext('2d');

cxt.scale(20,20);
//drawiwng the shape on the screen

//creating a shape on the codinates..shapes are drawn where the numbers is one

//players properties


const player={
    pos : {x:0 , y:0},
    matrix:null,
    score:0 
}


function updateScore(){
    document.getElementById('score').innerText =player.score;
}

function arenaSweep(){
    let rowcount=1;
   outer: for(let y=arena.length - 1; y > 0;y--){
        for(let x=0; x< arena.length;x++ ){
            if(arena[y][x] === 0){
                continue outer;
            }    
        }
        const row =arena.splice(y,1)[0].fill(0);
        arena.unshift(row);
        y++;
        player.score += rowcount *10;
        rowcount *= 2;
    }
}


//create a tiles on the screen
function drawShapes(matrix, offset){
    matrix.forEach((row, y)=>{
        row.forEach((value, x)=>{
            if(value!==0){
                cxt.fillStyle=color[value];
                cxt.fillRect(x+offset.x,y+offset.y,1,1);
            }
        });
    });
}

/*mearge function
    this function is used for mergin the 
    position of matrix array onto the arena array

*/
function merge(arena,player){
    player.matrix.forEach((row,y)=>{
        row.forEach((value,x)=>{
            if(value!==0){
                arena[y+player.pos.y][x+player.pos.x]=value;

            }
        })
    })         
}

//this function is for deteating the colision
function collision(arena,player){
    const [m,o]=[player.matrix,player.pos]
    for(let y=0;y<m.length;y++){
        for(let x=0;x<m[y].length;x++){
            if(m[y][x] !==0 && 
               (arena[y+o.y]  && arena[y+o.y][x+o.x]) !==0){
                return true
            }    
        }
    }
    return false
}

//this function is used to rotate the tiles on the screen
function playerRotate(dir){
    const pos=player.pos.x;
    let offset=1;
    rotate(player.matrix,dir);
    while(collision(arena,player)){
        player.pos.x += offset;
        offset = -(offset +(offset > 0 ? 1 : -1));
        if(offset > player.matrix[0].length){
            rotate(player.matrix,-d);
            player.pos.x=pos;
            return
        }   
    }
}

function createTiles(type){
    if (type ==='T'){
        return[ 
            [0,0,0],
            [1,1,1],
            [0,1,0] 
        ]    
    }else if(type ==='O'){
        return[ 
            [2,2],
            [2,2]
        ]
    }else if(type ==='L'){
        return[ 
            [0,3,0],
            [0,3,0],
            [0,3,3]
        ]
    }else if(type ==='J'){
        return[ 
            [0,4,0],
            [0,4,0],
            [4,4,0]
        ]
    }else if(type ==='I'){
        return[ 
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0]
        ]
    }else if(type ==='Z'){
        return[ 
            [6,6,0],
            [0,6,6],
            [0,0,0]
        ]
    }else if(type ==='S'){
        return[ 
            [0,7,7],
            [7,7,0],
            [0,0,0]
        ]
    }
}

//this funcion is used for the rotation of matrix
function rotate(matrix,dir){
    for(let y=0;y<matrix.length;y++){
        for(let x=0;x<y;x++){
            [
                matrix[x][y],
                matrix[y][x]
            ]=[
                matrix[y][x],
                matrix[x][y]
            ]
        }
    }
    if(dir>0){
        matrix.forEach(row => row.reverse());
    }else{
        matrix.reverse();
    }
} 


//this function is to create a new matrix 
function createMatrix(w,h){
    const matrix=[];
    while(h--){
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}
//drawing the shapes on the screen 
function draw(){
    cxt.fillStyle="#000";
    cxt.fillRect(0,0,canvas.width,canvas.height);
    drawShapes(arena,{x:0,y:0});
    drawShapes(player.matrix,player.pos);
}

//droping the tiles on bottom
function tiledrop(){
    player.pos.y++;
    if(collision(arena,player)){
        player.pos.y--;
        merge(arena,player);
        playerReset();
        arenaSweep();
        updateScore();
    };
    dropCounter=0;
}

//this function is to movw the tiles to direction according to key pressed
function playerMove(dir){
    player.pos.x+=dir;
    if(collision(arena,player)){
        player.pos.x -= dir;
    }
}

//this fumction is to generate a random tiles 
function playerReset(){
    const pieces='ILJOSZT'
    player.matrix=createTiles(pieces[pieces.length * Math.random() | 0]);
    player.pos.y=0;
    player.pos.x=((arena[0].length /2 | 0) -
                  (player.matrix[0].length / 2 | 0)); 
                  
    if(collision(arena,player)){
        arena.forEach(row => row.fill(0));
        player.score=0;
        updateScore();
    }              
}

const color=[null,'#ff0D72','#0dc2ff','#0cff72','#f538ff','#ff8e0d','#ffe138','#3877ff']




//this variable is used for the mesauing the time ms
let lastTime=0;
//this variable counts the drop 
let dropCounter=0;
//time each shapes drops
let dropTime=1000;

function update(time=0){
    //getting the time diffrence
    let deltaTime=time-lastTime;
    lastTime=time;
    dropCounter+=deltaTime;
    if(dropCounter>dropTime){
        tiledrop();
    }
    draw();
    requestAnimationFrame(update);
}

const arena =createMatrix(12,20);

document.addEventListener('keydown',e=>{
    if(e.keyCode===37){
        playerMove(-1);
    }
    if(e.keyCode===39){
        playerMove(+1);
    }
    if(e.keyCode===40){
        tiledrop();
    }else if(e.keyCode===65){
        playerRotate(-1)
    }else if(e.keyCode===68){
        playerRotate(+1)
    }
});

playerReset();
update();
updateScore();



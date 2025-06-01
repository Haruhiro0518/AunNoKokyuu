// 2023/7/21
let minigame8 = function(game, status) {
    let scene = new Scene();
    game.fps = 60;
    let endtime = 100;
    status.score = 0;

    let bgm8 = game.assets["m8BGM"];
    bgm8.play();
    bgm8.volume = 0.6;
    
    // let status.score = 0;
    let cflag = 0;  //cloud flag
    let ctimem = 60;//cloudtimemax
    let ctime = ctimem;
    let fall = 0; //fall guys
    let clear = 0;//m8clear
    //sound
    let fall2 = game.assets['fall2'];
    let getwanko = game.assets['getwanko'];
    let jumpse = game.assets['jump'];
    let sechops = game.assets['sechops'];
    let m8clear = game.assets['m8clear'];
    
    game.keybind(32, 'SPC');
    game.keybind(65, "a");  
    game.keybind(68, "d");  
    game.keybind(82, "r");

    const ms = 50;  //default pixel
    const ppx = 32; //plyr pixel x
    const cpx = 75; //chop pixel x
    const cpy = 10; //chop pixel y
    const ofspc = 5;//coushion
    const g = 0.5; //gravity
    let wID = 0;
    let time = 20;  //time limit
    let timecount = 0;
    
    let map = [];
    let min = 0;
    let max = 1;
    let rand = Math.floor( Math.random() * (max + 1 - min) ) + min;
    console.log(rand);
    // window.innerWidth, window.innerHeight
    var bg = new Sprite(1980, 1080);
    bg.image = game.assets['yukanoma2'];
    scene.addChild(bg);

    if(rand == 0) {
        map = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,3,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,3,0,0,0,0,1,0,0,0,1,1,1,0,0,1,0,0,0,0,0,1,1,1,1,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1],
            [1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1],
        ]
    } else if(rand == 1) {
        map = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,2,0,0,0,3,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0],
            [1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ]
    }
    
    let blocks = [];
    let wankos = [];

    function start() {
        blocks = []; 
        for(let i = 0; i < map.length; i++) {
            for(let j = 0; j < map[0].length; j++) {
                let m = map[i][j];
                if(m == 1) blocks.push(new Block(j*ms, i*ms));
                if(m == 2) {
                    player = new Player(j*ms+3, i*ms+6);
                    scene.addChild(player);
                }
                if(m == 3) {
                    wankos.push(new Wankosoba(j*ms, i*ms, wID));
                    wID++;
                }
            }
        }
    }

    Block = enchant.Class.create(enchant.Sprite, {
        initialize: function(x, y) {
            enchant.Sprite.call(this, ms, ms);
            this.x = x;
            this.y = y;
            this.w = ms;
            this.h = ms;
            this.image = game.assets['tatami2'];
        },
        draw: function(block) {
            scene.addChild(block);
        },
        
    });
    Cloud = enchant.Class.create(enchant.Sprite, {
        initialize: function(x, y) {
            enchant.Sprite.call(this, cpx, cpy);
            this.x = x;
            this.y = y;
            this.w = cpx;
            this.h = cpy;
            this.image = game.assets['chops'];
        },
        draw: function(cloud) {
            scene.addChild(cloud);
        },
    });

    Wankosoba = enchant.Class.create(enchant.Sprite, {
        initialize: function(x, y, wID) {
            enchant.Sprite.call(this, ms, ms-5);
            this.x = x;
            this.y = y;
            this.w = ms;
            this.h = ms-5;
            this.image = game.assets['wankosoba'];
            this.wID = wID;
        },
        draw: function(wankosoba) {
            scene.addChild(wankosoba);
        },
    });

    Player = enchant.Class.create(enchant.Sprite, {
        initialize: function(x, y) {
            enchant.Sprite.call(this, ppx, ms);
            //Blockと同じ 
            this.sx = x;
            this.sy = y;
            this.x = x;
            this.y = y;
            this.w = ppx;
            this.h = ms;
            this.image = game.assets['player2'];
            //Player
            this.vx = 0;
            this.vy = 0;
            this.speed = 5.5;
            this.dir = 1;
            this.sjumpSpeed = -3.15;
            this.jumpSpeed = this.sjumpSpeed;
        },
        move: function() {
            if(time > 0) {
            if(game.input.a) this.dir = -1;
            if(game.input.d) this.dir = 1;
            if(game.input.a || game.input.d) this.vx = this.speed*this.dir;
            else this.vx = 0;
            } else this.vx = 0;
            this.vy += g;
            
            if(game.input.SPC) {
                if(this.jumpSpeed == this.sjumpSpeed) jumpse.play();
                if(this.jumpSpeed < 0) {        
                    this.vy += this.jumpSpeed;  
                }
                this.jumpSpeed += g;            
            } else {
                this.jumpSpeed = 0;     
            }

            bfColl(this, blocks);
            bfCollw(this, wankos);

            this.x += this.vx;
            this.y += this.vy;

            if(this.dir == 1) this.image = game.assets['player2'];
            else if(this.dir == -1) this.image = game.assets['player2R'];
        },
        onenterframe: function() {
            this.move();
            /*out of display*/
            if(this.x < -ms || this.x > 1980 || this.y > 1080) {
                
                fall++;
                if(fall == 1) {
                    fall2.play();
                }
                if(fall > 100) {
                    this.x = this.sx;
                    this.y = this.sy;
                    fall = 0;
                }
            }
        }
    });

    function bfColl(ob, blocks) {  //obは一つのオブジェクト、blocksはblocks配列のようなもの
        blocks.forEach(b => {   
            if((ob.y+ob.h+ob.vy) > b.y && (ob.y+ob.vy + ofspc) < (b.y+b.h)
            && (ob.x+ob.w - ofspc) > b.x && ob.x + ofspc < (b.x+b.w)) {
                if(ob.vy > 0) {
                    ob.y = b.y -ob.h;
                    ob.vy = 0;
                    if(!game.input.SPC) {
                        ob.jumpSpeed = ob.sjumpSpeed;
                    }
                } else if(ob.vy < 0) {
                    ob.y = b.y + b.h - ofspc;
                    ob.vy = 0;
                    ob.jumpSpeed = 0;
                }
            } 

            if((ob.x+ob.w+ob.vx - ofspc) > b.x && (ob.x+ob.vx + ofspc) < (b.x+b.w)
            && (ob.y+ob.h) > b.y && ob.y + ofspc < (b.y+b.h)) {
                if(ob.vx > 0) {
                    ob.x = b.x - ob.w + ofspc;
                    ob.vx = 0;
                } else if(ob.vx < 0) {
                    ob.x = b.x + b.w - ofspc;
                    ob.vx = 0;
                }
            }
        })
    }

    function bfCollw(ob, blocks) {  //collision for wankosoba
        blocks.forEach(b => {   
            if((ob.y+ob.h+ob.vy) > b.y && (ob.y+ob.vy + ofspc) < (b.y+b.h)
            && (ob.x+ob.w - ofspc) > b.x && ob.x + ofspc < (b.x+b.w)) {
                if(ob.vy > 0) {
                    ob.y = b.y -ob.h;
                    vanishw(b);
                    if(!game.input.SPC) {
                        ob.jumpSpeed = ob.sjumpSpeed;
                    }
                } else if(ob.vy < 0) {
                    ob.y = b.y + b.h;
                    vanishw(b);
                }
            } 

            if((ob.x+ob.w+ob.vx - ofspc) > b.x && (ob.x+ob.vx + ofspc) < (b.x+b.w)
            && (ob.y+ob.h) > b.y && ob.y + ofspc < (b.y+b.h)) {
                if(ob.vx > 0) {
                    ob.x = b.x - ob.w;
                    vanishw(b);
                } else if(ob.vx < 0) {
                    ob.x = b.x + b.w;
                    vanishw(b);
                }
            }
        })
    }
    function vanishw(b) {   // wankosoba vanish
        getwanko.play();
        status.score += 10;
        let id = b.wID;
        scene.removeChild(b);
        wankos.splice(b.wID, 1);
        for(; id <= wankos.length - 1; id++) {
            wankos[id].wID--;
        }
    }
    
    //score label
    var scored = new Label();
        scored.x = window.innerWidth - 550;
        scored.y = 80;
        scored.color = "black";
        scored.font = "55px HGP行書体";
        scene.addChild(scored);
    
    //count down
    var countdown = new Label();
        countdown.x = 250;
        countdown.y = 80;
        countdown.color = "black";
        countdown.font = "60px HGP行書体";
        scene.addChild(countdown);    

    /*game start*/
    start();
    scene.addEventListener('enterframe', function() {
        /*draw*/
        blocks.forEach(block => block.draw(block));
        wankos.forEach(wankos => wankos.draw(wankos));
        // if(game.input.r) start();
        if(cflag == 1) {
            if(ctime == ctimem) sechops.play();
            ctime--;
            if(ctime == 0) {
                scene.removeChild(blocks[blocks.length - 1]);
                blocks.pop();
                ctime = ctimem;
                cflag = 0;
            }
        }
        //timecount
        if(time > 0) timecount++;
        if(timecount == 60) {
            time--;
            timecount = 0;
        }
        //label
        scored.text = (status.score/10) + "[わんこ]";
        countdown.text = "時間：" + (time);
        //congratulations
        if(status.score == 100 & clear == 0) {
            m8clear.play();
            clear = 1;
        }
        /*game end*/
        if(time == 0) {
            countdown.text = "時間：終了";
            bgm8.volume = 0.3;
            time = 0;
            endtime--;
            if(endtime == 0) {
                game.fps = 30;
                bgm8.stop();
                
                if(status.type == 1) game.replaceScene(attack1p(game, status));
                else if(status.type == 2) game.replaceScene(attack2p(game, status));
                else if(status.type == 3) game.replaceScene(attack3p(game, status));
                return scene;
            }
            
        }
        
    });
    /*cloud generate*/
    scene.addEventListener('touchstart', function(e) {
        if(cflag == 0) {
            blocks.push(new Cloud(e.x - cpx/2, e.y - cpy/2));
            cflag = 1;
        };
    });


    //UI image label
    let guideKeyA = new Sprite(200,200);
    guideKeyA.image = game.assets['imgKeyA'];
    guideKeyA.scaleX /= 2;
    guideKeyA.scaleY /= 2;
    guideKeyA.x = 50;
    guideKeyA.y = window.innerHeight - 170;
    scene.addChild(guideKeyA);

    let guideKeyD = new Sprite(200,200);
    guideKeyD.image = game.assets['imgKeyD'];
    guideKeyD.scaleX /= 2;
    guideKeyD.scaleY /= 2;
    guideKeyD.x = 200;
    guideKeyD.y = window.innerHeight - 170;
    scene.addChild(guideKeyD);

    let guideMouseL = new Sprite(200,200);
    guideMouseL.image = game.assets['imgMouseL'];
    guideMouseL.scaleX /= 2;
    guideMouseL.scaleY /= 2;
    guideMouseL.x = window.innerWidth - 480;
    guideMouseL.y = window.innerHeight - 170;
    scene.addChild(guideMouseL);

    //Jump ui    
    var Jumpl = new Label();
        Jumpl.x = 400;
        Jumpl.y = window.innerHeight - 70;
        Jumpl.color = "black";
        Jumpl.font = "40px HGP行書体";
        scene.addChild(Jumpl);
    //chopstick 
    var chopstickl = new Label();
        chopstickl.x = window.innerWidth - 330;
        chopstickl.y = window.innerHeight - 70;
        chopstickl.color = "black";
        chopstickl.font = "40px HGP行書体";
        scene.addChild(chopstickl);
        Jumpl.text = "Space:とぶ";
        chopstickl.text = ":はし";


    return scene;
};
let command = function(game, status)
{
    const minigameList = getMinigameList(8, 4);
    console.log(minigameList);
    let scene = new Scene();

    let background = new Sprite(500, 281);
    background.scaleX = innerWidth / 500;
    background.scaleY = innerHeight / 280;  
    background.image = game.assets["background_command"];
    background.x = (innerWidth - 500) / 2;
    background.y = (innerHeight - 280) / 2;
    scene.addChild(background);

    let bgm = game.assets["bgm_command"];
    bgm.volume = 0.5
    bgm.currentTime = status.pause;
    bgm.play();

    let komainu01 = new Sprite(300, 300);
    komainu01.image = game.assets["komainu01_command"];
    komainu01.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu01.x = 100;
    komainu01.y = ((innerHeight - 300) / 2) - 100;
    scene.addChild(komainu01);

    let komainu02 = new Sprite(300, 300);
    komainu02.image = game.assets["komainu02_command"];
    komainu02.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu02.x = 0;
    komainu02.y = ((innerHeight - 300) / 2);
    scene.addChild(komainu02);

    let nekomata01 = new Sprite(300, 300);
    if(status.ehp > status.border)
    {
        nekomata01.image = game.assets["nekomata01_command"];
    }
    else
    {
        nekomata01.image = game.assets["nekomata02_command"];
    }
    nekomata01.frame = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3];
    nekomata01.x = innerWidth - 350;
    nekomata01.y = ((innerHeight - 300) / 2) - 50;
    scene.addChild(nekomata01);

    let textbox = new Sprite(400, 100);
    textbox.image = game.assets["textbox_command"];
    textbox.scaleX = window.innerWidth / 400;
    textbox.scaleY = 1.6;
    textbox.x = (window.innerWidth - 400) / 2;
    textbox.y = innerHeight - 160;
    scene.addChild(textbox);

    let message = new Label("ミニゲームを選ぶべし！");
    message.color = "black";
    message.font = "100px HGP行書体";
    message.width = 1280;
    message.x = 100;
    message.y = innerHeight - 160;
    scene.addChild(message);

    let button01 = new Sprite(400, 100);
    button01.image = game.assets["button_command"];
    button01.frame = [0];
    button01.x = (window.innerWidth - 400) / 2;
    button01.y = 100;
    scene.addChild(button01);
    button01.on(Event.TOUCH_START, function(e)
    {
        bgm.stop();
        goMinigame(game, minigameList[0], status);
    });

    let text01 = new Label(getMinigameName(minigameList[0]));
    text01.color = "white"
    text01.font = "60px HGP行書体";
    text01.width = 600;
    text01.x = (window.innerWidth - 300) / 2;
    text01.y = 120;
    scene.addChild(text01);
    text01.on(Event.TOUCH_START, function(e)
    {
        bgm.stop();
        goMinigame(game, minigameList[0], status)
    });

    let button02 = new Sprite(400, 100);
    button02.image = game.assets["button_command"];
    button02.frame = [0];
    button02.x = (window.innerWidth - 400) / 2;
    button02.y = 240;
    scene.addChild(button02);
    button02.on(Event.TOUCH_START, function(e)
    {
        bgm.stop();
        goMinigame(game, minigameList[1], status);
    });

    let text02 = new Label(getMinigameName(minigameList[1]));
    text02.color = "white"
    text02.font = "60px HGP行書体";
    text02.width = 600;
    text02.x = (window.innerWidth - 300) / 2;
    text02.y = 260;
    scene.addChild(text02);
    text02.on(Event.TOUCH_START, function(e)
    {
        bgm.stop();
        goMinigame(game, minigameList[1], status);
    });

    let button03 = new Sprite(400, 100);
    button03.image = game.assets["button_command"];
    button03.frame = [0];
    button03.x = (window.innerWidth - 400) / 2;
    button03.y = 380;
    scene.addChild(button03);
    button03.on(Event.TOUCH_START, function(e)
    {
        bgm.stop();
        goMinigame(game, minigameList[2], status);
    });

    let text03 = new Label(getMinigameName(minigameList[2]));
    text03.color = "white"
    text03.font = "60px HGP行書体";
    text03.width = 600;
    text03.x = (window.innerWidth - 300) / 2;
    text03.y = 400;
    scene.addChild(text03);
    text03.on(Event.TOUCH_START, function(e)
    {
        bgm.stop();
        goMinigame(game, minigameList[2], status);
    });

    let button04 = new Sprite(400, 100);
    button04.image = game.assets["button_mode"];
    button04.frame = [0];
    button04.x = (window.innerWidth - 400) / 2;
    button04.y = 520;
    scene.addChild(button04);
    button04.on(Event.TOUCH_START, function(e)
    {
        bgm.stop();
        goMinigame(game, minigameList[3], status);
    });

    let text04 = new Label(getMinigameName(minigameList[3]));
    text04.color = "white"
    text04.font = "60px HGP行書体";
    text04.width = 600;
    text04.x = (window.innerWidth - 300) / 2;
    text04.y = 540;
    scene.addChild(text04);
    text04.on(Event.TOUCH_START, function(e)
    {
        bgm.stop();
        goMinigame(game, minigameList[3], status);
    });
    
    let hpbox01 = new Sprite(400, 100);
    hpbox01.image = game.assets["button_command"];
    hpbox01.frame = [1];
    hpbox01.x = 0;
    hpbox01.y = 0;
    scene.addChild(hpbox01);
    
    let hp01 = new Label("HP:" + status.php);
    hp01.color = "white"
    hp01.font = "100px HGP行書体";
    hp01.width = 400;
    hp01.x = 0;
    hp01.y = 0;
    scene.addChild(hp01);
    
    let hpbox02 = new Sprite(400, 100);
    hpbox02.image = game.assets["button_command"];
    hpbox02.frame = [1];
    hpbox02.x = innerWidth - 400;
    hpbox02.y = 0;
    scene.addChild(hpbox02);

    let hp02 = new Label("HP:" + status.ehp);
    hp02.color = "white"
    hp02.font = "100px HGP行書体";
    hp02.width = 400;
    hp02.x = innerWidth - 400;
    hp02.y = 0;
    scene.addChild(hp02);

    /*
    let type = new Label(status.type);
    type.color = "black"
    type.font = "100px HGP行書体";
    type.x = 600;
    type.y = 0;
    scene.addChild(type);
    */

    return scene;
};

function goMinigame(game, minigameNumber, status){
    switch(minigameNumber){
        case 1:
            game.replaceScene(minigame1(game, status));
            break;
        case 2:
            game.replaceScene(minigame2(game, status));
            break;
        case 3:
            game.replaceScene(minigame3(game, status));
            break;
        case 4:
            game.replaceScene(minigame4(game, status));
            break;
        case 5:
            game.replaceScene(minigame5(game, status));
            break;
        case 6:
            game.replaceScene(minigame6(game, status));
            break;
        case 7:
            game.replaceScene(minigame7(game, status));
            break;
        case 8:
            game.replaceScene(minigame8(game, status));
            break;
    }
}

function getMinigameName(minigameNumber){
    switch(minigameNumber){
        case 1:
            return "りずむ";
            break;
        case 2:
            return "わんこそば";
            break;
        case 3:
            return "こけし";
            break;
        case 4:
            return "さぼてん";
            break;
        case 5:
            return "たまご";
            break;
        case 6:
            return "きこる";
            break;
        case 7:
            return "しゃてき";
            break;
        case 8:
            return "まりお";
            break;
    }
}

// nom: number of minigame 7, noc: number of command 4
function getMinigameList(nom, noc, except){
    let randoms = [];    
    
    for(let i = 1; i <= noc; i++){
        while(true){
            let tmp = Math.floor( Math.random() * nom ) + 1;
            if(!randoms.includes(tmp)){
                randoms.push(tmp);
                break;
            }
        }
    }

    return randoms;
}
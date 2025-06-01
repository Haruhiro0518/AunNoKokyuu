let mode = function(game, status)
{
    let scene = new Scene();

    let background = new Sprite(500, 280);
    background.scaleX = innerWidth / 500;
    background.scaleY = innerHeight / 280;  
    background.image = game.assets["background_mode"];
    background.x = (innerWidth - 500) / 2;
    background.y = (innerHeight - 280) / 2;
    scene.addChild(background);

    let bgm = game.assets["bgm_mode"];
    bgm.volume = 0.5
    bgm.currentTime = status.pause;
    bgm.play();

    let komainu01 = new Sprite(300, 300);
    komainu01.image = game.assets["komainu01_mode"];
    komainu01.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu01.x = 100;
    komainu01.y = ((innerHeight - 300) / 2) - 100;
    scene.addChild(komainu01);

    let komainu02 = new Sprite(300, 300);
    komainu02.image = game.assets["komainu02_mode"];
    komainu02.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu02.x = 0;
    komainu02.y = ((innerHeight - 300) / 2);
    scene.addChild(komainu02);

    let nekomata01 = new Sprite(300, 300);
    if(status.ehp > status.border)
    {
        nekomata01.image = game.assets["nekomata01_mode"];
    }
    else
    {
        nekomata01.image = game.assets["nekomata02_mode"];
    }
    nekomata01.frame = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3];
    nekomata01.x = innerWidth - 350;
    nekomata01.y = ((innerHeight - 300) / 2) - 50;
    scene.addChild(nekomata01);

    let textbox = new Sprite(400, 100);
    textbox.image = game.assets["textbox_mode"];
    textbox.scaleX = window.innerWidth / 400;
    textbox.scaleY = 1.6;
    textbox.x = (window.innerWidth - 400) / 2;
    textbox.y = innerHeight - 160;
    scene.addChild(textbox);

    let message = new Label("業を選ぶべし！");
    message.color = "black";
    message.font = "100px HGP行書体";
    message.width = 1280;
    message.x = 100;
    message.y = innerHeight - 160;
    scene.addChild(message);

    let button01 = new Sprite(400, 100);
    button01.image = game.assets["button_mode"];
    button01.frame = [0];
    button01.x = (window.innerWidth - 400) / 2;
    button01.y = 100;
    scene.addChild(button01);
    button01.on(Event.TOUCH_START, function(e)
    {
        status.type = 1;
        status.pause = bgm.currentTime;
        bgm.stop();
        game.replaceScene(command(game, status));
    });

    let text01 = new Label("軽業");
    text01.color = "white"
    text01.font = "100px HGP行書体";
    text01.x = (window.innerWidth - 200) / 2;
    text01.y = 100;
    scene.addChild(text01);
    text01.on(Event.TOUCH_START, function(e)
    {
        status.type = 1;
        status.pause = bgm.currentTime;
        bgm.stop();
        game.replaceScene(command(game, status));
    });

    let button02 = new Sprite(400, 100);
    button02.image = game.assets["button_mode"];
    button02.frame = [0];
    button02.x = (window.innerWidth - 400) / 2;
    button02.y = 240;
    scene.addChild(button02);
    button02.on(Event.TOUCH_START, function(e)
    {
        status.type = 2;
        status.pause = bgm.currentTime;
        bgm.stop();
        game.replaceScene(command(game, status));
    });

    let text02 = new Label("荒業");
    text02.color = "white"
    text02.font = "100px HGP行書体";
    text02.x = (window.innerWidth - 200) / 2;
    text02.y = 240;
    scene.addChild(text02);
    text02.on(Event.TOUCH_START, function(e)
    {
        status.type = 2;
        status.pause = bgm.currentTime;
        bgm.stop();
        game.replaceScene(command(game, status));
    });

    let button03 = new Sprite(400, 100);
    button03.image = game.assets["button_mode"];
    button03.frame = [0];
    button03.x = (window.innerWidth - 400) / 2;
    button03.y = 380;
    scene.addChild(button03);
    button03.on(Event.TOUCH_START, function(e)
    {
        status.type = 3;
        status.pause = bgm.currentTime;
        bgm.stop();
        game.replaceScene(command(game, status));
    });

    let text03 = new Label("溜業");
    text03.color = "white"
    text03.font = "100px HGP行書体";
    text03.x = (window.innerWidth - 200) / 2;
    text03.y = 380;
    scene.addChild(text03);
    text03.on(Event.TOUCH_START, function(e)
    {
        status.type = 3;
        status.pause = bgm.currentTime;
        bgm.stop();
        game.replaceScene(command(game, status));
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

    let button04 = new Sprite(400, 100);
    button04.image = game.assets["button_mode"];
    button04.frame = [0];
    button04.x = (window.innerWidth - 400) / 2;
    button04.y = 520;
    scene.addChild(button04);
    button04.on(Event.TOUCH_START, function(e)
    {
        game.pushScene(help(game, status));
    });

    let text04 = new Label("心得");
    text04.color = "white"
    text04.font = "100px HGP行書体";
    text04.x = (window.innerWidth - 200) / 2;
    text04.y = 520;
    scene.addChild(text04);
    text04.on(Event.TOUCH_START, function(e)
    {
        game.pushScene(help(game, status));
    });

    return scene;
};

let help = function(game, status)
{
    let scene = new Scene();

    let background = new Sprite(500, 280);
    background.scaleX = innerWidth / 500;
    background.scaleY = innerHeight / 280;  
    background.image = game.assets["background_mode"];
    background.x = (innerWidth - 500) / 2;
    background.y = (innerHeight - 280) / 2;
    scene.addChild(background);

    let guide = new Sprite(1300, 580);
    guide.image = game.assets["guide_mode"];
    guide.x = (innerWidth - 1280) / 2;
    guide.y = 40;
    scene.addChild(guide);

    let button = new Sprite(400, 100);
    button.image = game.assets["button_mode"];
    button.frame = [0];
    button.x = (window.innerWidth - 400) / 2;
    button.y = innerHeight - 160;
    scene.addChild(button);
    button.on(Event.TOUCH_START, function(e)
    {
        game.popScene();
    });

    let text = new Label("戻る");
    text.color = "white"
    text.font = "100px HGP行書体";
    text.x = (window.innerWidth - 180) / 2;
    text.y = innerHeight - 160;
    scene.addChild(text);
    text.on(Event.TOUCH_START, function(e)
    {
        game.popScene();
    });

    return scene;
};
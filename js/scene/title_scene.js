let title = function(game, status)
{
    let scene = new Scene();

    let background = new Sprite(500, 280);
    background.scaleX = innerWidth / 500;
    background.scaleY = innerHeight / 280;  
    background.image = game.assets["background_title"];
    background.x = (innerWidth - 500) / 2;
    background.y = (innerHeight - 280) / 2;
    scene.addChild(background);

    let bgm = game.assets["bgm_title"];
    bgm.volume = 0.5;
    bgm.play();

    let komainu01 = new Sprite(500, 500);
    komainu01.image = game.assets["komainu01_title"];
    komainu01.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu01.x = 0;
    komainu01.y = innerHeight - 500;
    scene.addChild(komainu01);

    let komainu02 = new Sprite(500, 500);
    komainu02.image = game.assets["komainu02_title"];
    komainu02.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu02.x = innerWidth - 500;
    komainu02.y = innerHeight - 500;
    scene.addChild(komainu02);
    
    let logo = new Label("阿吽の呼吸");
    logo.color = "black"
    logo.font = "200px HGP行書体";
    logo.width = 1000;
    logo.heigth = 200;
    logo.x = (innerWidth - 1000) / 2;
    logo.y = 100;
    scene.addChild(logo);
    
    let button01 = new Sprite(400, 100);
    button01.image = game.assets["button_title"];
    button01.frame = [0];
    button01.x = (window.innerWidth - 400) / 2;
    button01.y = innerHeight - 320;
    scene.addChild(button01);
    button01.on(Event.TOUCH_START, function(e)
    {
        bgm.stop();
        game.replaceScene(opening(game, status));
    });

    let text01 = new Label("始める");
    text01.color = "white"
    text01.font = "100px HGP行書体";
    text01.x = (window.innerWidth - 280) / 2;
    text01.y = innerHeight - 320;
    scene.addChild(text01);
    text01.on(Event.TOUCH_START, function(e)
    {
        bgm.stop();
        game.replaceScene(opening(game, status));
    });

    let button02 = new Sprite(400, 100);
    button02.image = game.assets["button_title"];
    button02.frame = [0];
    button02.x = (window.innerWidth - 400) / 2;
    button02.y = innerHeight - 180;
    scene.addChild(button02);
    button02.on(Event.TOUCH_START, function(e)
    {
        game.pushScene(playguide(game, status));
    });

    let text02 = new Label("遊び方");
    text02.color = "white"
    text02.font = "100px HGP行書体";
    text02.x = (window.innerWidth - 280) / 2;
    text02.y = innerHeight - 180;
    scene.addChild(text02);
    text02.on(Event.TOUCH_START, function(e)
    {
        game.pushScene(playguide(game, status));
    });

    return scene;
};

let playguide = function(game, status)
{
    let scene = new Scene();

    let background = new Sprite(500, 280);
    background.scaleX = innerWidth / 500;
    background.scaleY = innerHeight / 280;  
    background.image = game.assets["background_title"];
    background.x = (innerWidth - 500) / 2;
    background.y = (innerHeight - 280) / 2;
    scene.addChild(background);

    let guide = new Sprite(1300, 700);
    guide.image = game.assets["guide_title"];
    guide.x = (innerWidth - 1300) / 2;
    guide.y = 40;
    scene.addChild(guide);

    let button = new Sprite(400, 100);
    button.image = game.assets["button_title"];
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
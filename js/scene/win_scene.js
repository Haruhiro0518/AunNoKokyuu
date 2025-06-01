let win = function(game, status)
{
    let scene = new Scene();

    let background = new Sprite(500, 280);
    background.scaleX = innerWidth / 500;
    background.scaleY = innerHeight / 280;  
    background.image = game.assets["background_win"];
    background.x = (innerWidth - 500) / 2;
    background.y = (innerHeight - 280) / 2;
    scene.addChild(background);

    let sound = game.assets["sound_win"];
    sound.volume = 0.75;
    sound.play();

    let komainu01 = new Sprite(300, 300);
    komainu01.image = game.assets["komainu01_win"];
    komainu01.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1];
    komainu01.x = 100;
    komainu01.y = ((innerHeight - 300) / 2) - 100;
    scene.addChild(komainu01);

    let komainu02 = new Sprite(300, 300);
    komainu02.image = game.assets["komainu02_win"];
    komainu02.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1];
    komainu02.x = 0;
    komainu02.y = ((innerHeight - 300) / 2);
    scene.addChild(komainu02);

    let nekomata01 = new Sprite(300, 300);
    nekomata01.image = game.assets["nekomata01_win"];
    nekomata01.x = innerWidth - 350;
    nekomata01.y = ((innerHeight - 300) / 2) - 50;
    scene.addChild(nekomata01);

    let logo = new Label("勝利");
    logo.color = "black"
    logo.font = "400px HGP行書体";
    logo.width = 800;
    logo.heigth = 400;
    logo.x = (innerWidth - 800) / 2;
    logo.y = (innerHeight - 400) / 2;
    scene.addChild(logo);
    
    let button = new Sprite(400, 100);
    button.image = game.assets["button_win"];
    button.frame = [0];
    button.x = (window.innerWidth - 400) / 2;
    button.y = innerHeight - 160;
    scene.addChild(button);
    button.on(Event.TOUCH_START, function(e)
    {
        game.replaceScene(ending(game, status));
    });

    let text = new Label("次へ");
    text.color = "white"
    text.font = "80px HGP行書体";
    text.x = (window.innerWidth - 180) / 2;
    text.y = innerHeight - 150;
    scene.addChild(text);
    text.on(Event.TOUCH_START, function(e)
    {
        game.replaceScene(ending(game, status));
    });

    return scene;
};
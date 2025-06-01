let opening = function(game, status)
{
    let scene = new Scene();

    game.keybind(87, "w");

    let background = new Sprite(500, 280);
    background.scaleX = innerWidth / 500;
    background.scaleY = innerHeight / 280;  
    background.image = game.assets["background_opening"];
    background.x = (innerWidth - 500) / 2;
    background.y = (innerHeight - 280) / 2;
    scene.addChild(background);

    let bgm = game.assets["bgm_opening"];
    bgm.volume = 0.5;
    bgm.play();

    let komainu01 = new Sprite(300, 300);
    komainu01.image = game.assets["komainu01_opening"];
    komainu01.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu01.x = 200;
    komainu01.y = innerHeight - 320;
    scene.addChild(komainu01);

    let komainu02 = new Sprite(300, 300);
    komainu02.image = game.assets["komainu02_opening"];
    komainu02.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu02.x = 50;
    komainu02.y = innerHeight - 320;
    scene.addChild(komainu02);

    let man = new Sprite(340, 400);
    man.image = game.assets["man_opening"];
    man.x = innerWidth - 540;
    man.y = innerHeight - 420;
    scene.addChild(man);

    let nekomata01 = new Sprite(300, 300);
    nekomata01.image = game.assets["nekomata01_opening"];
    nekomata01.frame = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3];
    nekomata01.x = innerWidth - 350;
    nekomata01.y = innerHeight - 320;
    scene.addChild(nekomata01);
    
    let textbox = new Sprite(400, 100);
    textbox.image = game.assets["textbox_opening"];
    textbox.scaleX = window.innerWidth / 400;
    textbox.scaleY = 3;
    textbox.x = (window.innerWidth - 400) / 2;
    textbox.y = 100;
    scene.addChild(textbox);

    let message01 = new Label("狛犬兄弟シシとコマと一緒に、");
    message01.color = "black";
    message01.font = "100px HGP行書体";
    message01.width = 1980;
    message01.x = 100;
    message01.y = 20;
    scene.addChild(message01);

    let message02 = new Label("猫又ミケを退治せよ！");
    message02.color = "black";
    message02.font = "100px HGP行書体";
    message02.width = 1980;
    message02.x = 100;
    message02.y = 140;
    scene.addChild(message02);

    var select = 0;

    scene.on(Event.ENTER_FRAME, function(e)
    {
        if(game.input.w)
        {
            select = 1;
            nekomata01.image = game.assets["nekomata02_opening"];
        }
    });
    
    let button = new Sprite(400, 100);
    button.image = game.assets["button_opening"];
    button.frame = [1];
    button.x = (innerWidth - 400) / 2;
    button.y = innerHeight - 160;
    scene.addChild(button);
    button.on(Event.TOUCH_START, function(e)
    {
        bgm.stop();
        if(select > 0)
        {
            status.border = 2000;
        }
        else
        {
            status.border = 500;
        }
        game.replaceScene(intro(game, status));
    });

    let text = new Label("勝負");
    text.color = "white"
    text.font = "100px HGP行書体";
    text.x = (innerWidth - 180) / 2;
    text.y = innerHeight - 160;
    scene.addChild(text);
    text.on(Event.TOUCH_START, function(e)
    {
        bgm.stop();
        if(select > 0)
        {
            status.border = 2000;
        }
        else
        {
            status.border = 500;
        }
        game.replaceScene(intro(game, status));
    });

    return scene;
};
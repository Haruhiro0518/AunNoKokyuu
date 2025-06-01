let ending = function(game, status)
{
    let scene = new Scene();

    let background = new Sprite(500, 280);
    background.scaleX = innerWidth / 500;
    background.scaleY = innerHeight / 280;  
    background.image = game.assets["background_ending"];
    background.x = (innerWidth - 500) / 2;
    background.y = (innerHeight - 280) / 2;
    scene.addChild(background);

    let bgm = game.assets["bgm_ending"];
    bgm.volume = 0.5;
    bgm.play();

    let komainu01 = new Sprite(300, 300);
    komainu01.image = game.assets["komainu01_ending"];
    komainu01.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu01.x = 200;
    komainu01.y = innerHeight - 320;

    let komainu02 = new Sprite(300, 300);
    komainu02.image = game.assets["komainu02_ending"];
    komainu02.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu02.x = 50;
    komainu02.y = innerHeight - 320;

    let komainu03 = new Sprite(300, 300);
    komainu03.image = game.assets["komainu01_win"];
    komainu03.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1];
    komainu03.x = 200;
    komainu03.y = innerHeight - 320;

    let komainu04 = new Sprite(300, 300);
    komainu04.image = game.assets["komainu02_win"];
    komainu04.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1];
    komainu04.x = 50;
    komainu04.y = innerHeight - 320;

    let man01 = new Sprite(340, 400);
    man01.image = game.assets["man01_ending"];
    man01.x = innerWidth - 540;
    man01.y = innerHeight - 420;
    
    let man02 = new Sprite(400, 400);
    man02.image = game.assets["man02_ending"];
    man02.x = innerWidth - 540;
    man02.y = innerHeight - 420;

    let nekomata01 = new Sprite(300, 300);
    nekomata01.image = game.assets["nekomata02_ending"];
    nekomata01.frame = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3];
    nekomata01.x = innerWidth - 350;
    nekomata01.y = innerHeight - 320;

    if(status.border < 2000)
    {
        scene.addChild(komainu01);
        scene.addChild(komainu02);
        scene.addChild(man01);
        scene.addChild(nekomata01);
    }
    else
    {
        scene.addChild(komainu03);
        scene.addChild(komainu04);
        scene.addChild(man02);
    }
    
    let textbox = new Sprite(400, 100);
    textbox.image = game.assets["textbox_ending"];
    textbox.scaleX = window.innerWidth / 400;
    textbox.scaleY = 3;
    textbox.x = (window.innerWidth - 400) / 2;
    textbox.y = 100;
    scene.addChild(textbox);

    let message01 = new Label("ハードモード解禁！");
    if(status.border < 2000)
    {
        message01.text = ("ハードモード解禁！");
    }
    else
    {
        message01.text = ("クリアおめでとう！");
    }
    message01.color = "black";
    message01.font = "100px HGP行書体";
    message01.width = 1980;
    message01.x = 100;
    message01.y = 20;
    scene.addChild(message01);

    let message02 = new Label("勝負の前にwキーを押すべし！");
    if(status.border < 2000)
    {
        message02.text = ("勝負の前にwキーを押すべし！");
    }
    else
    {
        message02.text = ("これぞまさしく阿吽の呼吸！");
    }
    message02.color = "black";
    message02.font = "100px HGP行書体";
    message02.width = 1980;
    message02.x = 100;
    message02.y = 140;
    scene.addChild(message02);
    
    let button = new Sprite(400, 100);
    button.image = game.assets["button_ending"];
    button.frame = [1];
    button.x = (innerWidth - 400) / 2;
    button.y = innerHeight - 160;
    scene.addChild(button);
    button.on(Event.TOUCH_START, function(e)
    {
        bgm.stop();
        game.replaceScene(title(game, status));
    });

    let text = new Label("タイトル");
    text.color = "white"
    text.font = "80px HGP行書体";
    text.width = 600;
    text.x = (window.innerWidth - 340) / 2;
    text.y = innerHeight - 150;
    scene.addChild(text);
    text.on(Event.TOUCH_START, function(e)
    {
        bgm.stop();
        game.replaceScene(title(game, status));
    });

    return scene;
};
let half = function(game, status)
{
    let scene = new Scene();

    let background = new Sprite(500, 280);
    background.scaleX = innerWidth / 500;
    background.scaleY = innerHeight / 280;  
    background.image = game.assets["background_half"];
    background.x = (innerWidth - 500) / 2;
    background.y = (innerHeight - 280) / 2;
    scene.addChild(background);

    let bgm = game.assets["bgm_half"];
    bgm.volume = 0.5;
    bgm.currentTime = status.pause;
    bgm.play();

    let komainu01 = new Sprite(300, 300);
    komainu01.image = game.assets["komainu01_half"];
    komainu01.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu01.x = 100;
    komainu01.y = ((innerHeight - 300) / 2) - 100;
    scene.addChild(komainu01);

    let komainu02 = new Sprite(300, 300);
    komainu02.image = game.assets["komainu02_half"];
    komainu02.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    komainu02.x = 0;
    komainu02.y = ((innerHeight - 300) / 2);
    scene.addChild(komainu02);

    let nekomata01 = new Sprite(300, 300);
    nekomata01.image = game.assets["nekomata02_half"];
    nekomata01.frame = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3];
    nekomata01.x = innerWidth - 350;
    nekomata01.y = ((innerHeight - 300) / 2) - 50;
    scene.addChild(nekomata01);

    let textbox = new Sprite(400, 100);
    textbox.image = game.assets["textbox_half"];
    textbox.scaleX = window.innerWidth / 400;
    textbox.scaleY = 1.6;
    textbox.x = (window.innerWidth - 400) / 2;
    textbox.y = innerHeight - 160;
    scene.addChild(textbox);

    let message = new Label("ミケは怒りで力がみなぎった！");
    message.color = "black";
    message.font = "100px HGP行書体";
    message.width = 1980;
    message.x = 100;
    message.y = innerHeight - 160;
    scene.addChild(message);

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

    let sound = game.assets["sound_half"];
    sound.volume = 0.75

    var loop = 1;
    var time = 1;

    status.check = 0;
    status.epow = 1.5;

    if(loop > 0)
    {
        sound.play();
        loop = 0;
    }

    timer();

    function timer()
    {
        scene.on(Event.ENTER_FRAME, function(e)
        {
            if(game.frame % game.fps == 0)
            {
                time += -1;
            }

            if(time < 0)
            {
                status.pause = bgm.currentTime;
                bgm.stop();
                status.count = 1;
                game.replaceScene(attack2e(game, status));
            }
        });
    }

    return scene;
};
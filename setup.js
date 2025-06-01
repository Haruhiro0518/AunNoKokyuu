enchant();

window.onload = function()
{
    let game = new Game(window.innerWidth, window.innerHeight);

    game.fps = 30;

    game.preload(image_title);
    game.preload(audio_title);

    game.preload(image_opening);
    game.preload(audio_opening);

    game.preload(image_ending);
    game.preload(audio_ending);

    game.preload(image_intro);
    game.preload(audio_intro);

    game.preload(image_outro);
    game.preload(audio_outro);

    game.preload(image_half);
    game.preload(audio_half);

    game.preload(image_mode);
    game.preload(audio_mode);

    game.preload(image_command);
    game.preload(audio_command);

    game.preload(image_minigame1);
    game.preload(audio_minigame1);

    game.preload(image_minigame2);
    game.preload(audio_minigame2);

    game.preload(image_minigame3);
    game.preload(audio_minigame3);

    game.preload(image_minigame4);
    game.preload(audio_minigame4);

    game.preload(image_minigame5);
    game.preload(audio_minigame5);

    game.preload(image_minigame6);
    game.preload(audio_minigame6);

    game.preload(image_minigame7);
    game.preload(audio_minigame7);

    game.preload(image_minigame8);
    game.preload(audio_minigame8);

    game.preload(image_attack1p);
    game.preload(audio_attack1p);

    game.preload(image_attack2p);
    game.preload(audio_attack2p);

    game.preload(image_attack3p);
    game.preload(audio_attack3p);

    game.preload(image_attack1e);
    game.preload(audio_attack1e);

    game.preload(image_attack2e);
    game.preload(audio_attack2e);

    game.preload(image_win);
    game.preload(audio_win);

    game.preload(image_lose);
    game.preload(audio_lose);

    var status = 
    {
        php: 1000,
        ehp: 1000,
        border: 500,
        ppow: 1.0,
        epow: 1.0,
        type: 0,
        score: 0,
        check: 1,
        count: 2,
        charge: 0,
        pause: 0,
    };

    game.onload = function()
    {
        game.replaceScene(title(game, status));
    };

    game.start();
}
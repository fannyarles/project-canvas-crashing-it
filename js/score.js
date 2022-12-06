const highScores = [];

const updateScore = () => {
    ctx.fillStyle = 'black';
    ctx.font = 'bold 40px Nunito';
    ctx.fillText(game.score, canvas.width - 70, 60)
    let text;
    game.score === 1 ? text = 'car' : text = 'cars';
    ctx.font = 'normal 14px Nunito';
    ctx.fillText(`${text} survived`, canvas.width - 100, 80)
}
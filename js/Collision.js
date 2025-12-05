export function aabbIntersect(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function resolvePlayerPlatforms(player, platforms) {
  player.onGround = false;

  for (const platform of platforms) {
    if (!aabbIntersect(player, platform)) continue;

    const prevBottom = player.prevY + player.height;
    const prevTop = player.prevY;
    const prevRight = player.prevX + player.width;
    const prevLeft = player.prevX;

    const platformTop = platform.y;
    const platformBottom = platform.y + platform.height;
    const platformLeft = platform.x;
    const platformRight = platform.x + platform.width;

    const currentBottom = player.y + player.height;
    const currentTop = player.y;
    const currentRight = player.x + player.width;
    const currentLeft = player.x;

    if (prevBottom <= platformTop && currentBottom > platformTop && player.vy >= 0) {
      player.y = platformTop - player.height;
      player.vy = 0;
      player.onGround = true;
    } else if (prevTop >= platformBottom && currentTop < platformBottom && player.vy <= 0) {
      player.y = platformBottom;
      player.vy = 0;
    } else if (prevRight <= platformLeft && currentRight > platformLeft) {
      player.x = platformLeft - player.width;
      player.vx = 0;
    } else if (prevLeft >= platformRight && currentLeft < platformRight) {
      player.x = platformRight;
      player.vx = 0;
    }
  }
}

export function handlePlayerCollectibles(game) {
  const player = game.player;

  for (const item of game.collectibles) {
    if (item.collected) continue;
    if (aabbIntersect(player, item)) {
      item.collected = true;
      const value = item.type === 'gold_fish' ? 10 : 1;
      game.addScore(value);
      game.playCollectSound();
    }
  }

  game.collectibles = game.collectibles.filter((c) => !c.collected);
}

export function handlePlayerEnemies(game) {
  const player = game.player;
  for (const enemy of game.enemies) {
    if (aabbIntersect(player, enemy)) {
      game.onPlayerDeath();
      return;
    }
  }
}

export function handlePlayerObstacles(game) {
  const player = game.player;
  for (const obstacle of game.obstacles) {
    if (obstacle.type === 'waterJet' && !obstacle.active) continue;
    if (aabbIntersect(player, obstacle)) {
      game.onPlayerDeath();
      return;
    }
  }
}

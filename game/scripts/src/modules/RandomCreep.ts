export class RandomCreep {
    public constructor() {
        // 定义一个标志变量，用来表示怪物是否已经升级
        let creepUpgraded = false;

        Timers.CreateTimer(1, () => {
            const gameTime = GameRules.GetGameTime();
            const playerCount = PlayerResource.GetPlayerCount();

            // 检查游戏时间是否达到了7分30秒（450秒），且怪物尚未升级
            if (gameTime >= 450 && !creepUpgraded) {
                // 更新标志变量，避免重复升级
                creepUpgraded = true;
                // 升级后，对每个玩家生成更高级的怪物
                for (let i = 0; i < playerCount; i++) {
                    this.SpawnCreepForPlayer(i, 'creep2');
                }
            } else if (!creepUpgraded) {
                // 如果未达到升级时间，继续生成初始级别的怪物
                for (let i = 0; i < playerCount; i++) {
                    this.SpawnCreepForPlayer(i, 'creep1');
                }
            }

            // 设定定时器循环时间
            return 8;
        });
    }

    private SpawnCreepForPlayer(playerId, creepName: string) {
        const player = PlayerResource.GetPlayer(playerId);
        if (!player) return;

        const hero = player.GetAssignedHero();
        if (!hero) return;

        // 计算一个随机的位置来生成小怪
        const spawnLocation = this.CalculateRandomPositionNearHero(hero);

        // 使用SpawnUnit方法生成小怪，此方法可能根据你的游戏环境有所不同
        const creep = CreateUnitByName(creepName, spawnLocation, true, null, null, 3);

        // 设置小怪的目标为当前玩家的英雄
        // creep.SetForceAttackTargetAlly(hero);
        creep.SetDayTimeVisionRange(10000);
        creep.SetNightTimeVisionRange(10000);
        creep.SetForceAttackTarget(hero);
        // creep.SetAttacking(hero);
    }

    private CalculateRandomPositionNearHero(hero) {
        // 获取英雄的当前位置
        const origin = hero.GetAbsOrigin();

        // 生成随机角度（0到360度，转换为弧度）
        const angle = Math.random() * 2 * Math.PI;

        // 定义一个距离，这里是2000码以外
        const distance = 2000 + Math.random() * 500; // 这会生成一个2000到2500码之间的随机距离

        // 计算新位置的X和Y坐标
        const newX = origin.x + distance * Math.cos(angle);
        const newY = origin.y + distance * Math.sin(angle);

        // 创建一个新的Vector来表示新位置
        const newPosition = Vector(newX, newY, origin.z); // 假设Z坐标保持不变

        // 检查新位置是否在地图范围内，如果需要的话，这里可以添加更多的逻辑
        // 注意：这个示例没有实现地图范围检查，你可能需要根据你的地图特定条件来实现这一点

        return newPosition;
    }
}

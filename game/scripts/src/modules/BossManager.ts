export class BossManager {
    private bossRefreshTimes: number[] = [1, 2, 3, 4, 5];
    private currentBossIndex: number = 0;
    private totalMinutes: number = 0;
    private lastCheckTime: number = 0;
    constructor() {
        this.startTimer();
        const lastCheckTime = null;
        Timers.CreateTimer(0, () => {
            const currentTime = GameRules.GetDOTATime(false, false);

            // 定义特定时间点，以秒为单位
            const spawnTimes = [60 * 20, 60 * 30, 60 * 40, 60 * 50, 60 * 60]; // 简化时间点为测试示例
            const lastCheckTime = this.lastCheckTime || 0; // 保存上一次检查的时间

            // 遍历所有设定的时间点
            spawnTimes.forEach((time, index) => {
                if (currentTime >= time && lastCheckTime < time) {
                    switch (index) {
                        case 0:
                            this.createBoss();
                            break;
                        case 1:
                            this.createBoss2();
                            break;
                        case 2:
                            this.createBoss3();
                            break;
                        case 3:
                            this.createBoss4();
                            break;
                        case 4:
                            this.createBoss5();
                            break;
                    }
                }
            });

            // 更新上一次检查的时间为当前时间
            this.lastCheckTime = currentTime;

            // 每秒检查一次时间
            return 1;
        });
    }

    private updateBossRefreshTimer(): void {
        // 计算距离下一个Boss刷新还有多少分钟
        const minutesUntilNextBoss = this.bossRefreshTimes[this.currentBossIndex] - this.totalMinutes;

        if (minutesUntilNextBoss <= 0) {
            // Boss即将刷新
            GameRules.SendCustomMessage(`Boss即将刷新！`, 0, 0);
            this.currentBossIndex += 1;

            if (this.currentBossIndex >= this.bossRefreshTimes.length) {
                // 如果所有Boss刷新时间都已经用完，可以选择重置索引或停止定时器
                this.currentBossIndex = 0;
                this.totalMinutes = 0; // 根据你的需要，这里可以进行调整
            }

            // this.createBoss();
        } else {
            // 发送距离下一个Boss刷新还有多少分钟的消息
            GameRules.SendCustomMessage(`下一个Boss将在 ${minutesUntilNextBoss} 分钟后刷新`, 0, 0);
            GameRules.SendCustomMessage(`下一个Boss将在 ${minutesUntilNextBoss} 分钟后刷新`, 0, 0);
            GameRules.SendCustomMessage(`下一个Boss将在 ${minutesUntilNextBoss} 分钟后刷新`, 0, 0);
        }

        this.totalMinutes += 1;
    }

    private startTimer(): void {
        // 每分钟更新一次Boss刷新计时器
        Timers.CreateTimer(0, () => {
            this.updateBossRefreshTimer();
            return 60; // 60秒后再次触发
        });
    }

    private createBoss() {
        const v = Vector(0, 0, 0);
        const boss = CreateUnitByName('npc_dota_hero_pugna', v, true, null, null, DotaTeam.BADGUYS);
        // boss.SetHealth(20000);
        const player = PlayerResource.GetPlayer(0);
        const hero = player.GetAssignedHero() as CDOTA_BaseNPC_Hero;
        const vector = hero.GetAbsOrigin();
        boss.SetForceAttackTarget(hero);
        boss.SetUnitCanRespawn(false);
    }

    private createBoss2() {
        const v = Vector(0, 0, 0);
        const boss = CreateUnitByName('npc_dota_hero_tidehunter', v, true, null, null, DotaTeam.BADGUYS);
        // boss.SetHealth(1800000);
        const player = PlayerResource.GetPlayer(0);
        const hero = player.GetAssignedHero() as CDOTA_BaseNPC_Hero;
        const vector = hero.GetAbsOrigin();
        boss.SetForceAttackTarget(hero);
        boss.SetUnitCanRespawn(false);
    }

    private createBoss3() {
        const v = Vector(0, 0, 0);
        const boss = CreateUnitByName('npc_dota_hero_queenofpain', v, true, null, null, DotaTeam.BADGUYS);
        // boss.SetHealth(2800000);
        const player = PlayerResource.GetPlayer(0);
        const hero = player.GetAssignedHero() as CDOTA_BaseNPC_Hero;
        const vector = hero.GetAbsOrigin();
        boss.SetForceAttackTarget(hero);
        boss.SetUnitCanRespawn(false);
    }

    private createBoss4() {
        const v = Vector(0, 0, 0);
        const boss = CreateUnitByName('npc_dota_hero_night_stalker', v, true, null, null, DotaTeam.BADGUYS);
        // boss.SetHealth(3800000);
        const player = PlayerResource.GetPlayer(0);
        const hero = player.GetAssignedHero() as CDOTA_BaseNPC_Hero;
        const vector = hero.GetAbsOrigin();
        boss.SetForceAttackTarget(hero);
        boss.SetUnitCanRespawn(false);
    }

    private createBoss5() {
        const v = Vector(0, 0, 0);
        const boss = CreateUnitByName('npc_dota_hero_lycan', v, true, null, null, DotaTeam.BADGUYS);
        // boss.SetHealth(4800000);
        const player = PlayerResource.GetPlayer(0);
        const hero = player.GetAssignedHero() as CDOTA_BaseNPC_Hero;
        const vector = hero.GetAbsOrigin();
        boss.SetForceAttackTarget(hero);
        boss.SetUnitCanRespawn(false);
    }
}

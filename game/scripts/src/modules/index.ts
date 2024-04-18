import { Debug } from './Debug';
import { GameConfig } from './GameConfig';
import { XNetTable } from './xnet-table';
import { BossManager } from './BossManager';
import { RandomCreep } from './RandomCreep';
import { Boss4 } from './Boss4';
import { Other } from './Other';
import { BoxTest } from './BoxTest';
import { SmallCreepOfMiddle } from './SmallCreepOfMiddle';
import { modifier_wearable } from "../modifier_wearable";
import { maxSpeed } from "../maxSpeed";

declare global {
    interface CDOTAGameRules {
        // 声明所有的GameRules模块，这个主要是为了方便其他地方的引用（保证单例模式）
        XNetTable: XNetTable;
    }
}

/**
 * 这个方法会在game_mode实体生成之后调用，且仅调用一次
 * 因此在这里作为单例模式使用
 **/
const initialPositions = [];
const creeps = [];

export function ActivateModules() {
    if (GameRules.XNetTable == null) {
        // 初始化所有的GameRules模块
        GameRules.XNetTable = new XNetTable();
        // 如果某个模块不需要在其他地方使用，那么直接在这里使用即可
        new GameConfig();
        // Timers.CreateTimer(function repeat() {
        //     createBox(); // 调用函数
        //     return 3.0; // 5秒后再次执行
        // });
        // 初始化测试模块xD
        new Debug();
    }

    ListenToGameEvent(
        'game_rules_state_change',
        () => {
            const state = GameRules.State_Get();
            if (state === GameState.GAME_IN_PROGRESS) {
                //创建泉水
                Timers.CreateTimer(1, () => {
                    //给每个玩家增加信使
                    for (let i = 0; i < 12; i++) {
                        const player = PlayerResource.GetPlayer(i as PlayerID);
                        if (player != null && player.GetAssignedHero() != null) {
                            const hero = player.GetAssignedHero() as CDOTA_BaseNPC_Hero;
                            const courier = CreateUnitByName('npc_dota_courier', hero.GetAbsOrigin(), true, player, player, DotaTeam.GOODGUYS);
                            courier.SetControllableByPlayer(player.GetPlayerID(), true);
                            courier.SetBaseMoveSpeed(100000);
                        }
                    }

                    const player = PlayerResource.GetPlayer(0);
                    const hero = player.GetAssignedHero() as CDOTA_BaseNPC_Hero;
                    const vector = Vector(0, -7000, 0);
                    CreateUnitByName('healing_fountain_aura_unit', vector, true, null, null, DotaTeam.GOODGUYS);
                    new maxSpeed();
                    //创建很快的移动速度
                    // hero.AddNewModifier(hero, null, 'maxSpeed', {});
                    // 定义一个生成小怪的半径
                    const radius = 300; // 这可以根据你的需要调整
                    const numberOfCreeps = 10;
                    const angleStep = 360 / numberOfCreeps; // 分割360度以均匀放置小怪

                    for (let i = 0; i < numberOfCreeps; i++) {
                        // 计算每个小怪的坐标
                        const angle = angleStep * i;
                        const radians = angle * (Math.PI / 180); // 将角度转换为弧度
                        const x = vector.x + radius * Math.cos(radians);
                        const y = vector.y + radius * Math.sin(radians);
                        const position = Vector(x, y, vector.z);

                        // 生成小怪
                        const creep = CreateUnitByName('healing_fountain_creep', position, true, null, null, DotaTeam.BADGUYS);
                        initialPositions.push(position); // 保存初始位置
                        creeps.push(creep); // 存储小怪对象以便后续使用
                    }
                    Timers.CreateTimer(0, () => {
                        creeps.forEach((creep, index) => {
                            // 定义搜索参数
                            const radius = 600;
                            const team = creep.GetTeam(); // 或者使用一个特定的队伍标识，如DotaTeam.BADGUYS
                            const teamFilter = UnitTargetTeam.BOTH; // 假设我们只对敌方英雄感兴趣
                            const typeFilter = UnitTargetType.HERO;
                            const flagsFilter = UnitTargetFlags.NONE;
                            // 在600码范围内搜索英雄
                            const heroes = FindUnitsInRadius(
                                team,
                                creep.GetAbsOrigin(),
                                null,
                                radius,
                                teamFilter,
                                typeFilter,
                                flagsFilter,
                                FindOrder.ANY,
                                false
                            );

                            // 如果范围内没有英雄，则让小怪返回初始位置
                            if (heroes.length === 0) {
                                creep.MoveToPosition(initialPositions[index]);
                            }
                        });
                        return 5; // 每5秒运行一次这个函数
                    });
                });

                //删除物品
                Timers.CreateTimer(5, () => {
                    const items = Entities.FindAllByClassname('dota_item_drop') as CDOTA_Item[];
                    for (let i = 0; i < items.length; i++) {
                        print(items[i].GetName());
                    }
                    return 5;
                });

                EmitGlobalSound('music_1');
                Timers.CreateTimer(1, () => {
                    const player = PlayerResource.GetPlayer(0);
                    const hero = player.GetAssignedHero() as CDOTA_BaseNPC_Hero;

                    hero.SetGold(10000, true);

                    // const modelList: any = [
                    //     'models/items/juggernaut/gifts_of_the_vanished_head/gifts_of_the_vanished_head.vmdl',
                    //     'models/items/juggernaut/gifts_of_the_vanished_weapon/gifts_of_the_vanished_weapon.vmdl',
                    //     'models/items/juggernaut/gifts_of_the_vanished_legs/gifts_of_the_vanished_legs.vmdl',
                    //     'models/items/juggernaut/gifts_of_the_vanished_arms/gifts_of_the_vanished_arms.vmdl',
                    //     'models/items/juggernaut/gifts_of_the_vanished_back/gifts_of_the_vanished_back.vmdl',
                    // ];
                    // new modifier_wearable();
                    // for (const key in modelList) {
                    //     const element = modelList[key];
                    //     const unit = CreateUnitByName('npc_dota_creature', Vector(0, 0, 0), false, hero, hero.GetOwner(), hero.GetTeamNumber());
                    //     unit.SetModel(element);
                    //     unit.SetOriginalModel(element);
                    //     unit.SetModelScale(hero.GetModelScale());
                    //     unit.AddNewModifier(unit, null, 'modifier_wearable', {});
                    //     unit.FollowEntity(hero, true);
                    //     // table.insert(hHero['modelList'], unit.entindex());
                    // }
                    // new Box();
                    new BoxTest();
                    new SmallCreepOfMiddle();
                    // new TestColor();
                });
                new BossManager();
                new RandomCreep();
                new Other();
                new Boss4();
            }
        },
        null
    );
}

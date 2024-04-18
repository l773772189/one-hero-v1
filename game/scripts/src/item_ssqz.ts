import { BaseAbility, BaseModifier, registerAbility, registerModifier } from './utils/dota_ts_adapter';

@registerAbility('item_ssqz')
class item_ssqz extends BaseAbility {
    private rangeParticle: ParticleID; // 在这里定义属性，指定类型为 ParticleID
    private rangeParticle2: ParticleID; // 在这里定义属性，指定类型为 ParticleID
    private shouldGenerateSnowflakes: boolean = true; // 新增标志控制是否继续生成雪块

    OnSpellStart() {
        this.rangeParticle = ParticleManager.CreateParticle(
            'particles/units/heroes/hero_crystalmaiden_persona/cm_persona_freezing_field_snow_dryice_floor.vpcf',
            ParticleAttachment.WORLDORIGIN,
            undefined
        );
        this.rangeParticle2 = ParticleManager.CreateParticle(
            'particles/units/heroes/hero_crystalmaiden_persona/cm_persona_freezing_field_snow_shard.vpcf',
            ParticleAttachment.WORLDORIGIN,
            undefined
        );
        ParticleManager.SetParticleControl(this.rangeParticle, 0, this.GetCursorPosition());
        ParticleManager.SetParticleControl(this.rangeParticle2, 0, this.GetCursorPosition());

        this.GetCaster().StartGesture(GameActivity.DOTA_GENERIC_CHANNEL_1);
        EmitSoundOn('Hero_Crystal.FreezingField.Arcana', this.GetCaster());
        this.shouldGenerateSnowflakes = true; // 开始施法时，设置为true
        const castLocation = this.GetCursorPosition();
        Timers.CreateTimer(0, () => {
            if (!this.shouldGenerateSnowflakes) {
                // 如果不应该生成雪块，则退出
                return;
            }

            // 创建粒子效果
            const particle = ParticleManager.CreateParticle(
                'particles/units/heroes/hero_crystalmaiden_persona/cm_persona_freezing_field_explosion.vpcf',
                ParticleAttachment.WORLDORIGIN,
                undefined
            );

            // 随机调整雪块的生成位置
            const randomOffset = RandomVector(RandomFloat(0, 500));
            const snowflakePosition = castLocation.__add(randomOffset);

            // 设置粒子效果的位置
            ParticleManager.SetParticleControl(particle, 0, snowflakePosition);

            // 移除粒子效果
            Timers.CreateTimer(1, () => {
                ParticleManager.DestroyParticle(particle, false);
                ParticleManager.ReleaseParticleIndex(particle);
            });
            return 0.05;
        });

        const damageInterval = Timers.CreateTimer(1, () => {
            if (!this.shouldGenerateSnowflakes) {
                // 如果不应该生成雪块，则退出
                return null; // 停止定时器
            }

            // 查找范围内的敌人单位
            const enemies = FindUnitsInRadius(
                this.GetCaster().GetTeamNumber(),
                castLocation,
                null,
                500,
                UnitTargetTeam.ENEMY,
                UnitTargetType.BASIC | UnitTargetType.HERO,
                UnitTargetFlags.NONE,
                FindOrder.ANY,
                false
            );

            // 对每个敌人造成伤害
            for (const enemy of enemies) {
                enemy.AddNewModifier(this.GetCaster(), this, 'modifier_slow_effect', { duration: 3 });
            }

            for (const enemy of enemies) {
                const damageTable = {
                    victim: enemy,
                    attacker: this.GetCaster(),
                    damage: 10,
                    damage_type: DamageTypes.MAGICAL,
                    ability: this,
                };
                ApplyDamage(damageTable);
            }

            return 0.2; // 每秒重复
        });
    }

    OnChannelFinish(bInterrupted: boolean) {
        print(bInterrupted);
        this.shouldGenerateSnowflakes = false; // 施法结束时，设置为false
        this.GetCaster().FadeGesture(GameActivity.DOTA_GENERIC_CHANNEL_1);
        ParticleManager.DestroyParticle(this.rangeParticle, false);
        ParticleManager.DestroyParticle(this.rangeParticle2, false);
        ParticleManager.ReleaseParticleIndex(this.rangeParticle);
        ParticleManager.ReleaseParticleIndex(this.rangeParticle2);
        StopSoundOn('Hero_Crystal.FreezingField.Arcana', this.GetCaster());
    }

    GetAOERadius() {
        return 500;
    }

    GetChannelTime() {
        return 5;
    }
}

@registerModifier('modifier_custom_slow')
class modifier_custom_slow extends BaseModifier {
    particle: ParticleID;

    OnCreated(params: any): void {
        print('创建减速特效');

        const target = this.GetParent();

        // 创建粒子效果并附加到目标单位上
        this.particle = ParticleManager.CreateParticle(
            'particles/units/heroes/hero_crystal_maiden/maiden_frostbite_buff.vpcf',
            ParticleAttachment.ABSORIGIN_FOLLOW,
            target
        );

        // 设置粒子效果的控制点，例如，控制点0通常用于设置粒子效果的位置
        ParticleManager.SetParticleControl(this.particle, 0, target.GetAbsOrigin());
    }

    OnDestroy(): void {
        // 当modifier被销毁时，销毁粒子效果
        ParticleManager.DestroyParticle(this.particle, false);
        ParticleManager.ReleaseParticleIndex(this.particle);
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MOVESPEED_BONUS_PERCENTAGE];
    }

    GetModifierMoveSpeedBonus_Percentage(): number {
        return -100; // 举例：减速30%
    }
}

import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { render } from 'react-panorama-x';

const bossRefreshMinutes = [15, 25]; // 定义Boss刷新时间点（分钟）

// @ts-ignore
const getNextRefreshTimeInSeconds = currentSeconds => {
    const currentMinutes = Math.round(currentSeconds / 60);
    for (const refreshMinute of bossRefreshMinutes) {
        if (refreshMinute > currentMinutes) {
            return refreshMinute * 60; // 返回下一个刷新时间点（秒）
        }
    }
    return null; // 如果所有Boss已刷新，则返回null
};

const Test: FC = () => {
    const [nextRefreshTime, setNextRefreshTime] = useState<number | null>(null);
    const [timerText, setTimerText] = useState('等待下一个BOSS刷新...');

    useEffect(() => {
        const updateTimer = () => {
            // 四舍五入获取当前游戏时间（秒）
            const currentTime = Math.round(Game.GetGameTime());
            const nextRefresh = getNextRefreshTimeInSeconds(currentTime);
            setNextRefreshTime(nextRefresh);

            if (nextRefreshTime !== null) {
                const timeLeft = Math.round(nextRefreshTime) - currentTime; // 四舍五入以避免小数秒数
                if (timeLeft > 0) {
                    const minutes = Math.floor(timeLeft / 60);
                    const seconds = timeLeft % 60;
                    // 使秒数始终显示为两位数
                    setTimerText(`距离下一个BOSS刷新还有: ${minutes}分${seconds < 10 ? '0' + seconds : seconds}秒`);
                } else {
                    // 查找下一个刷新时间
                    const nextRefresh = getNextRefreshTimeInSeconds(currentTime);
                    setNextRefreshTime(nextRefresh);
                    if (nextRefresh === null) {
                        setTimerText('所有BOSS已刷新');
                    }
                }
            }
        };

        updateTimer(); // 立即更新一次计时器，然后每秒更新
        const intervalId = setInterval(updateTimer, 1000);

        // 清除定时器
        return () => clearInterval(intervalId);
    }, [nextRefreshTime]); // 依赖于 nextRefreshTime 来重新计算

    return (
        <Panel>
            <Panel id="BossTimerContainer">
                <Label id="BossTimerLabel" text={timerText} />
            </Panel>
        </Panel>
    );
};

render(<Test />, $.GetContextPanel());

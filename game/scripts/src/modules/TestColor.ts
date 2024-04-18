interface Color {
    red: number;
    green: number;
    blue: number;
}

export class TestColor {
    constructor() {
        const colorIncrement = 10; // 颜色增量
        const maxColorValue = 256; // 最大颜色值
        const numSteps = maxColorValue / colorIncrement; // 计算颜色变化步数
        const colors: Color[] = [];

        for (let i = 0; i < numSteps; i++) {
            for (let j = 0; j < numSteps; j++) {
                for (let k = 0; k < numSteps; k++) {
                    const red = (i * colorIncrement) % maxColorValue;
                    const green = (j * colorIncrement) % maxColorValue;
                    const blue = (k * colorIncrement) % maxColorValue;
                    colors.push({ red, green, blue });
                }
            }
        }

        this.createUnits(colors);
    }

    createUnits(colors: Color[]) {
        const baseVector = Vector(0, 0, 0); // 基础位置向量
        const ii = 60; // 控制单位间距
        const ii2 = 140; // 控制单位间距
        let index = 0; // 用于跟踪颜色数组的索引

        for (let i = 0; i < 25; i++) {
            for (let j = 0; j < 25; j++) {
                if (index < colors.length) {
                    const color = colors[index++];
                    const unitPosition = baseVector.__add(Vector(i * ii, j * ii2, 0));
                    const unit = CreateUnitByName('custom_unit_box2', unitPosition, true, null, null, DotaTeam.BADGUYS);
                    unit.SetRenderColor(color.red, color.green, color.blue);
                }
            }
        }
    }
}

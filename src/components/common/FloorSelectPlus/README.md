### FloorSelectPlus 使用说明

## type
| 类型 | 说明 | ts |
| --- | --- | --- |
| Extensions | 扩展 | { <br>  dot? : boolean; // 是否显示小圆点 <br> disabled? :boolean;  // 是否禁用  <br> disabledTip? :string// 禁用提示  <br> } |
| FloorObj | 建筑 | {<br> ... <br> id:string <br>} & Extensions|
| BuildingObj | 楼层 | {<br> ... <br>,floors:FloorObj[ ] ; <br> id:string <br>} & Extensions  |

## props

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| floorId（ 支持v-model:floorId ） | String | '' | 默认选中的楼层 |
| expandBuildingId（ 支持v-model:expandBuildingId ） | String | '' | 默认展开的建筑 |
| buildingFloors | BuildingObj[] | [] | 建筑楼层列表 |
| showProject | Boolean | true | 是否显示项目 |


## events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
|change| 选中楼层 | floorId(选中的楼层id)，floor（选中的楼层），building（选中楼层所在的建筑） |
|expandChange| 展开建筑 | expandBuildingId（展开的建筑id），building（展开的建筑） |
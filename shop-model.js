export const extraTools = [
  ['橡皮雞','🐔',700,13], ['仙人掌盆栽','🌵',820,14],
  ['生日蛋糕','🎂',950,15], ['網球拍','🎾',1100,16],
  ['冰凍魚','🐟',1280,17], ['魔法棒','🪄',1480,18],
  ['雷電槌','⚡',1700,20], ['旋風扇','🌀',1950,22],
  ['保齡球','🎳',2250,24], ['流星隕石','☄️',2600,27],
];
export const backgrounds = [
  {id:'office',name:'日常辦公室',cost:0,icon:'🏢',description:'熟悉的上班日常'},
  {id:'night',name:'城市夜景',cost:250,icon:'🌃',description:'霓虹天際線與深夜辦公室'},
  {id:'ocean',name:'海景辦公室',cost:400,icon:'🌊',description:'海風、陽光與遠方的小船'},
  {id:'sakura',name:'櫻花會議室',cost:550,icon:'🌸',description:'春日花景與木質和風空間'},
  {id:'space',name:'太空辦公艙',cost:800,icon:'🪐',description:'星球、環形舷窗與宇宙星海'},
  {id:'arcade',name:'電競工作室',cost:1000,icon:'🎮',description:'霓虹燈、音響與遊戲機台'},
  {id:'toilet',name:'廁所馬桶',cost:320,icon:'🚽',description:'磁磚、洗手台與專屬馬桶包廂'},
  {id:'tribe',name:'原始部落',cost:650,icon:'⛺',description:'茅草屋、木柵欄與營火的史前營地'},
  {id:'prison',name:'監獄',cost:900,icon:'🔒',description:'鐵欄、石牆與牢房裡的放風時間'},
];
export const colors = [
  ['炭黑','#252833'],['雪白','#ffffff'],['朱紅','#e5493b'],['蜜橘','#f18a35'],
  ['金黃','#f4c430'],['萊姆綠','#a6d64f'],['草綠','#39a65b'],['森林綠','#206b4c'],
  ['薄荷綠','#6bdbc3'],['湖水藍','#30bccb'],['天空藍','#5ca9ed'],['鈷藍','#345bd9'],
  ['午夜藍','#243a79'],['薰衣草','#aa92db'],['葡萄紫','#7946ad'],['桃紅','#dc4c9c'],
  ['櫻花粉','#f49eb5'],['可可棕','#865744'],['銀灰','#a6adb8'],['古銅金','#bc903e'],
].map(([name,hex],i)=>({id:`color-${i}`,name,hex,cost:40+i*10}));
export const stamps = [
  ['poop','大便',80], ['bump','腫包',100], ['kiss','唇印',120],
  ['panda','熊貓眼',140], ['bandage','OK 繃',160], ['angry','怒氣符號',180],
  ['sweat','冒汗',200], ['star','暈眩星星',230], ['pig','豬鼻子',260],
  ['mustache','八字鬍',300], ['fail','不及格',340], ['overtime','加班認證',380],
].map(([id,name,cost])=>({id,name,cost,src:`./assets/stamp-${id}.svg?v=5`}));
const validCoins=n=>Number.isSafeInteger(n)&&n>=0;
const cleanOwned=(items,valid,required=[])=>[...new Set([...required,...(Array.isArray(items)?items.filter(valid):[])])];
export function restoreState(raw){
  const s=raw&&typeof raw==='object'?raw:{};
  const backgroundIds=backgrounds.map(b=>b.id), colorIds=colors.map(c=>c.id);
  const result={coins:validCoins(s.coins)?s.coins:0,
    owned:cleanOwned(s.owned,n=>Number.isInteger(n)&&n>=0&&n<25,[0,1]),
    hits:validCoins(s.hits)?s.hits:0,best:validCoins(s.best)?s.best:0,
    ownedBackgrounds:cleanOwned(s.ownedBackgrounds,id=>backgroundIds.includes(id),['office']),
    ownedColors:cleanOwned(s.ownedColors,id=>colorIds.includes(id)),
    ownedStamps:cleanOwned(s.ownedStamps,id=>stamps.some(item=>item.id===id)),
    background:'office',color:null,stamp:null};
  if(result.ownedBackgrounds.includes(s.background))result.background=s.background;
  if(result.ownedColors.includes(s.color))result.color=s.color;
  if(result.ownedStamps.includes(s.stamp))result.stamp=s.stamp;
  return result;
}
export function purchase(state,kind,id,toolCatalog){
  const config=kind==='tool'?{list:toolCatalog,key:'owned',find:(_,i)=>i===id}:
    kind==='background'?{list:backgrounds,key:'ownedBackgrounds',find:item=>item.id===id}:
    kind==='color'?{list:colors,key:'ownedColors',find:item=>item.id===id}:
    kind==='stamp'?{list:stamps,key:'ownedStamps',find:item=>item.id===id}:null;
  if(!config)return {ok:false,reason:'invalid'};
  const item=config.list.find(config.find);if(!item)return {ok:false,reason:'invalid'};
  if(state[config.key].includes(id))return {ok:true,bought:false};
  const cost=kind==='tool'?item[2]:item.cost;
  if(state.coins<cost)return {ok:false,reason:'funds',missing:cost-state.coins};
  state.coins-=cost;state[config.key].push(id);
  return {ok:true,bought:true};
}

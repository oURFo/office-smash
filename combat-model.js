export const STAGES = [0, 18, 42, 72];
export function injuryStage(value) { return STAGES.filter(t => value >= t).length - 1; }
export function addInjury(value, power) { return Math.min(100, value + 7 + power * 1.3); }
export function recoverInjury(value, elapsedSeconds) { return Math.max(0, value - elapsedSeconds * 8); }
export const profiles = [
  ['slap','啪！','🖐️', 'side', '#e69069'],
  ['slipper','啪嘰！','〰', 'side', '#56a2a2'],
  ['folder','刷啦！','▱', 'side', '#809f72'],
  ['coffee','潑！','●', 'jolt', '#8c6040'],
  ['paper','唰！','▱', 'side', '#e9dfbe'],
  ['keyboard','喀啦！','▣', 'jolt', '#667f91'],
  ['lunch','噗！','●', 'squash', '#df9b54'],
  ['phone','叮鈴！','♪', 'jolt', '#7f9d8c'],
  ['briefcase','砰！','✦', 'squash', '#ac815f'],
  ['umbrella','咻！','💧', 'poke', '#719fc8'],
  ['pan','鏘——！','✧', 'jolt', '#e6c96b'],
  ['broom','沙沙！','〰', 'side', '#c6ad71'],
  ['glove','碰！','✦', 'punch', '#dc7863'],
  ['hammer','啵！','☆', 'squash', '#bd8bc5'],
  ['rocket','轟！','✦', 'launch', '#ed9850'],
  ['chicken','咕咕！','♪','side','#efbd55'],
  ['cactus','哎喲！','✧','jolt','#7ca66d'],
  ['cake','糊一臉！','●','squash','#edabc2'],
  ['tennis','ACE！','●','punch','#b8c95e'],
  ['fish','啪嗒！','❄','side','#85bdcf'],
  ['wand','變變變！','✦','launch','#c19ddc'],
  ['thunder','霹靂！','ϟ','jolt','#e3c751'],
  ['fan','呼呼呼！','〰','poke','#76b8bb'],
  ['bowling','全倒！','●','squash','#9990be'],
  ['meteor','轟隆隆！','✦','launch','#e19059'],
];

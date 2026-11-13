import {stamps} from './shop-model.js?v=5';
import {stampGeometry} from './stamp-preview-model.js?v=5';

export function createStampPreview({getState,painting,mask,controls}){
  let active=false,point={x:painting.width/2,y:painting.height/2};
  const panel=document.createElement('div');panel.className='stamp-live-preview';
  panel.innerHTML='<div class="stamp-preview-title"><b>即時預覽</b><output id="stamp-preview-readout" aria-live="polite">尚未選擇印章</output></div><div class="stamp-preview-stage"><img alt="目前印章大小與角度預覽" hidden><span>先選擇一種已解鎖印章</span></div><small>與角色上的印章相同大小；拖曳可對位，放開才蓋上。</small>';
  const hover=document.createElement('span');hover.id='stamp-hover';hover.hidden=true;hover.setAttribute('aria-hidden','true');
  hover.innerHTML='<span class="stamp-hover-frame"><img alt=""></span><small></small>';
  const mini=panel.querySelector('img'),placeholder=panel.querySelector('.stamp-preview-stage span');
  function update(){
    const state=getState(),stamp=stamps.find(item=>item.id===state.stamp&&state.ownedStamps.includes(item.id));
    const size=Number(controls.querySelector('#stamp-size').value),angle=Number(controls.querySelector('#stamp-angle').value);
    mini.hidden=!stamp;placeholder.hidden=Boolean(stamp);hover.hidden=!active||!stamp;
    panel.querySelector('output').textContent=stamp?`${stamp.name} · ${size} px · ${angle}°`:'尚未選擇印章';
    if(!stamp)return;
    for(const img of [mini,hover.querySelector('img')])if(img.getAttribute('src')!==stamp.src)img.src=stamp.src;
    mini.style.width=size+'px';mini.style.height=size+'px';mini.style.transform=`rotate(${angle}deg)`;
    const geometry=stampGeometry(size,angle,painting.width,painting.getBoundingClientRect().width);
    hover.style.left=point.x/painting.width*100+'%';hover.style.top=point.y/painting.height*100+'%';hover.style.width=geometry.size/painting.width*100+'%';hover.style.setProperty('--preview-angle',geometry.angle+'deg');
    const x=Math.max(0,Math.min(mask.width-1,Math.floor(point.x))),y=Math.max(0,Math.min(mask.height-1,Math.floor(point.y)));
    const valid=mask.getContext('2d').getImageData(x,y,1,1).data[3]>=40;
    hover.dataset.valid=String(valid);hover.querySelector('small').textContent=`${size}px · ${angle}°${valid?'':' · 移到人物上'}`;
  }
  function reset(){point={x:painting.width/2,y:painting.height/2};document.querySelector('#person').append(hover);update();}
  return {panel,update,reset,move:next=>{point=next;update();},setActive:value=>{active=value;update();}};
}

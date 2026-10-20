// 限制页面缩放；单指滚动、横向联系人列表和普通滚轮照常工作。
export function installZoomGuard(target=document){
 const block=event=>{if(event.cancelable)event.preventDefault();};
 const multiTouch=event=>{if(event.touches.length>1)block(event);};
 const pinchWheel=event=>{if(event.ctrlKey)block(event);};
 const options={passive:false};
 target.addEventListener('touchstart',multiTouch,options);
 target.addEventListener('touchmove',multiTouch,options);
 target.addEventListener('gesturestart',block,options);
 target.addEventListener('gesturechange',block,options);
 target.addEventListener('wheel',pinchWheel,options);
}

// Menú móvil
(function(){var t=document.querySelector('.menu-toggle'),n=document.querySelector('.nav');if(!t||!n)return;
t.addEventListener('click',function(){var o=n.classList.toggle('open');t.setAttribute('aria-expanded',String(o));t.setAttribute('aria-label',o?'Cerrar menú':'Abrir menú')});
n.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){n.classList.remove('open');t.setAttribute('aria-expanded','false')})})})();

// Horario en vivo (Madrid). 0 = domingo. Minutos desde las 0:00.
(function(){
  var H={0:null,1:null,2:[[600,840],[960,1230]],3:[[600,840],[960,1230]],4:[[600,840],[960,1230]],5:[[600,840],[960,1230]],6:[[600,900]]};
  var order=[1,2,3,4,5,6,0],names=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],low=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  function f(m){return Math.floor(m/60)+':'+String(m%60).padStart(2,'0')}
  function dur(m){var h=Math.floor(m/60),r=m%60;return h?(h+' h'+(r?' '+r+' min':'')):(r+' min')}
  function label(d){var h=H[d];return h?h.map(function(s){return f(s[0])+'–'+f(s[1])}).join(' · '):'Cerrado'}
  function now(){var p=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Madrid',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());function g(t){return p.filter(function(x){return x.type===t})[0].value}
    return{day:{Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[g('weekday')],min:(parseInt(g('hour'),10)%24)*60+parseInt(g('minute'),10)}}
  function state(){var n=now(),h=H[n.day],i,s;
    if(h)for(i=0;i<h.length;i++){s=h[i];if(n.min>=s[0]&&n.min<s[1])return{open:true,badge:'Abierto · hasta las '+f(s[1]),title:'Abierto ahora',sub:'Hasta las '+f(s[1]),extra:'Cierra en '+dur(s[1]-n.min)}}
    if(h)for(i=0;i<h.length;i++){if(n.min<h[i][0])return{open:false,badge:'Cerrado · abrimos a las '+f(h[i][0]),title:'Cerrado ahora',sub:'Abrimos hoy a las '+f(h[i][0]),extra:'Abre en '+dur(h[i][0]-n.min)}}
    for(i=1;i<=7;i++){var d=(n.day+i)%7;if(H[d]){var w=i===1?'mañana':'el '+low[d];return{open:false,badge:'Cerrado · abrimos '+w,title:'Cerrado ahora',sub:'Abrimos '+w+' a las '+f(H[d][0][0]),extra:''}}}
    return{open:false,badge:'Cerrado',title:'Cerrado',sub:'',extra:''}}
  function paint(){var n=now(),s=state();
    document.querySelectorAll('[data-open-badge]').forEach(function(b){b.textContent=s.badge;b.classList.toggle('is-open',s.open);b.classList.toggle('is-closed',!s.open)});
    document.querySelectorAll('[data-door]').forEach(function(d){d.classList.toggle('is-open',s.open);d.classList.toggle('is-closed',!s.open);
      d.querySelector('[data-door-title]').textContent=s.title;d.querySelector('[data-door-sub]').textContent=s.sub;d.querySelector('[data-door-extra]').textContent=s.extra});
    document.querySelectorAll('[data-today]').forEach(function(e){e.textContent=label(n.day)});
    document.querySelectorAll('[data-clock]').forEach(function(e){e.textContent=f(n.min).replace(/^(\d):/,'0$1:')});
    var tl=document.querySelector('[data-timeline]');
    if(tl){var first=!tl.children.length;
      tl.innerHTML=order.map(function(d){var h=H[d];
        var segs=h?h.map(function(x){return'<i class="tl-seg" style="left:'+(x[0]/14.4)+'%;width:'+((x[1]-x[0])/14.4)+'%"></i>'}).join(''):'';
        var mark=d===n.day?'<i class="tl-now" style="left:'+(n.min/14.4)+'%"></i>':'';
        return'<div class="tl-row'+(d===n.day?' is-today':'')+(h?'':' is-closed')+'"><span class="tl-day">'+names[d]+'</span><div class="tl-track">'+segs+mark+'</div><span class="tl-txt">'+label(d)+'</span></div>'}).join('');
      if(!first)tl.querySelectorAll('.tl-seg').forEach(function(e){e.style.animation='none'})}}
  paint();setInterval(paint,30000);
})();

// Efectos generales
(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  var items=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1});items.forEach(function(e){io.observe(e)})}
  else items.forEach(function(e){e.classList.add('in')});
  var bar=document.querySelector('.bar'),pg=document.querySelector('.progress');
  function sc(){var y=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight;if(bar)bar.classList.toggle('scrolled',y>10);if(pg)pg.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')'}
  window.addEventListener('scroll',sc,{passive:true});sc();
  // Parallax suave del perro del hero
  var par=document.querySelector('.par');
  if(par&&!reduce){window.addEventListener('pointermove',function(e){if(e.pointerType!=='mouse')return;var x=(e.clientX/window.innerWidth-.5)*2,y=(e.clientY/window.innerHeight-.5)*2;par.style.transform='translate('+(x*14)+'px,'+(y*10)+'px)'})}
  // Inclinación 3D en tarjetas
  if(!reduce)document.querySelectorAll('.tilt').forEach(function(el){
    el.addEventListener('pointermove',function(e){if(e.pointerType!=='mouse')return;var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform='perspective(700px) rotateX('+(-y*7)+'deg) rotateY('+(x*9)+'deg) translateY(-4px)'});
    el.addEventListener('pointerleave',function(){el.style.transform=''})});
})();

// Comparador antes / después
(function(){
  document.querySelectorAll('[data-ba]').forEach(function(box){
    var h=box.querySelector('.ba-handle'),drag=false;
    function set(p){p=Math.max(2,Math.min(98,p));box.style.setProperty('--pos',p+'%');h.setAttribute('aria-valuenow',Math.round(p))}
    function fromEvent(e){var r=box.getBoundingClientRect();set((e.clientX-r.left)/r.width*100)}
    box.addEventListener('pointerdown',function(e){drag=true;box.setPointerCapture(e.pointerId);fromEvent(e)});
    box.addEventListener('pointermove',function(e){if(drag)fromEvent(e)});
    box.addEventListener('pointerup',function(){drag=false});box.addEventListener('pointercancel',function(){drag=false});
    h.addEventListener('keydown',function(e){var v=parseFloat(h.getAttribute('aria-valuenow'))||50;if(e.key==='ArrowLeft')set(v-5);if(e.key==='ArrowRight')set(v+5)});
    // pequeña demo al aparecer
    if('IntersectionObserver' in window){var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){o.disconnect();var t=0,a=setInterval(function(){t+=.08;set(50+Math.sin(t*2)*18*(1-t/3.2));if(t>3.2){clearInterval(a);set(50)}},30)}},{threshold:.6});o.observe(box)}
  })})();

// Calculadora de cita
(function(){
  var c=document.querySelector('[data-calc]');if(!c)return;
  var P=[14,16,10,22,15,11],T=[30,35,25,55,30,25],SV=['Corte clásico','Fade y degradado','Barba y toalla caliente','Corte + barba','Afeitado a navaja','Corte junior'],EX={4:'cejas',8:'limpieza facial',5:'masaje capilar',3:'producto'},ET={4:5,8:15,5:10,3:0};
  var tot=c.querySelector('[data-total]'),sum=c.querySelector('[data-summary]'),tm=c.querySelector('[data-time]'),wa=c.querySelector('[data-wa]');
  function val(n){return c.querySelector('input[name='+n+']:checked').value}
  function calc(){var v=parseInt(val('svc'),10),b=val('bar'),ex=[].slice.call(c.querySelectorAll('input[name=ex]:checked')),t=P[v]+ex.reduce(function(a,e){return a+parseInt(e.value,10)},0),m=T[v]+ex.reduce(function(a,e){return a+ET[e.value]},0);
    tot.textContent=t;tot.parentNode.classList.remove('bump');void tot.offsetWidth;tot.parentNode.classList.add('bump');
    var txt=SV[v]+(ex.length?' + '+ex.map(function(e){return EX[e.value]}).join(', '):'')+(b!=='Cualquiera'?' con '+b:'');sum.textContent=txt;tm.textContent='Duración aprox. '+m+' min';
    wa.href='https://wa.me/34600000001?text='+encodeURIComponent('Hola, quiero reservar: '+txt+' (orientativo '+t+' €).')}
  c.addEventListener('change',calc);calc();
})();

// Galería: filtros y visor
(function(){
  var tiles=[].slice.call(document.querySelectorAll('.tile'));if(!tiles.length)return;
  var gal=document.querySelector('[data-gallery]'),empty=document.querySelector('[data-empty]');
  document.querySelectorAll('.fbtn').forEach(function(b){b.addEventListener('click',function(){
    document.querySelectorAll('.fbtn').forEach(function(x){x.classList.toggle('on',x===b)});var f=b.getAttribute('data-filter'),n=0;
    tiles.forEach(function(t){var ok=f==='todos'||t.getAttribute('data-f')===f;t.classList.toggle('hide',!ok);if(ok)n++});if(empty)empty.hidden=n>0})});
  var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-label','Foto ampliada');
  lb.innerHTML='<div class="lb-card"><button class="x" aria-label="Cerrar">✕</button><button class="pv" aria-label="Anterior">‹</button><button class="nx" aria-label="Siguiente">›</button><div class="lb-art"></div><p></p><small></small></div>';
  document.body.appendChild(lb);
  var art=lb.querySelector('.lb-art'),nm=lb.querySelector('p'),sv=lb.querySelector('small'),card=lb.querySelector('.lb-card'),cur=0;
  function vis(){return tiles.filter(function(t){return!t.classList.contains('hide')})}
  function show(t){var v=vis();cur=v.indexOf(t);art.innerHTML=t.querySelector('.ico').outerHTML;nm.textContent=t.querySelector('.cap b').textContent;sv.textContent=t.querySelector('.cap i').textContent;card.style.background=getComputedStyle(t).getPropertyValue('--bg');lb.classList.add('on')}
  function step(d){var v=vis();if(!v.length)return;show(v[(cur+d+v.length)%v.length])}
  tiles.forEach(function(t){t.addEventListener('click',function(){show(t)})});
  lb.querySelector('.x').addEventListener('click',function(){lb.classList.remove('on')});
  lb.querySelector('.pv').addEventListener('click',function(e){e.stopPropagation();step(-1)});lb.querySelector('.nx').addEventListener('click',function(e){e.stopPropagation();step(1)});
  lb.addEventListener('click',function(e){if(e.target===lb)lb.classList.remove('on')});
  document.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')lb.classList.remove('on');if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});
})();

// Formulario → WhatsApp
(function(){
  var f=document.querySelector('[data-form]');if(!f)return;var err=document.querySelector('[data-err]');
  f.addEventListener('submit',function(e){e.preventDefault();var d=new FormData(f),n=(d.get('nombre')||'').trim();
    if(!n){err.hidden=false;return}err.hidden=true;
    var dia=d.get('dia')?new Date(d.get('dia')+'T12:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}):'sin día fijo';
    var t='Hola, soy '+n+' y quiero reservar cita.\nServicio: '+d.get('serv')+'\nBarbero: '+d.get('barbero')+'\nDía: '+dia+' ('+d.get('franja')+')'+((d.get('msg')||'').trim()?'\nNotas: '+d.get('msg').trim():'');
    window.open('https://wa.me/34600000001?text='+encodeURIComponent(t),'_blank','noopener')})
})();

// Redes sociales de la demo (sin dirección real)
document.querySelectorAll('[data-social]').forEach(function(a){a.addEventListener('click',function(e){if(a.getAttribute('href')==='#')e.preventDefault()})});

/* ===== Extras: cabezas, tijeras, poste, transiciones ===== */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raf=function(f){return requestAnimationFrame(f)};

  /* 1 · Cabezas que siguen el puntero o el dedo */
  (function(){
    if(RM)return;
    var heads=[].slice.call(document.querySelectorAll('.man'));
    if(!heads.length)return;
    var px=null,py=null,pend=0,idle;
    function cl(v){return Math.max(-1,Math.min(1,v))}
    function paint(){
      pend=0;var vh=innerHeight,vw=innerWidth;
      heads.forEach(function(h){
        var r=h.getBoundingClientRect();
        if(r.bottom<0||r.top>vh||r.width<20)return;
        var lx=0,ly=0;
        if(px!==null){lx=cl((px-(r.left+r.width/2))/(vw*.35));ly=cl((py-(r.top+r.height*.5))/(vh*.35))}
        h.style.setProperty('--lx',lx.toFixed(3));h.style.setProperty('--ly',ly.toFixed(3));
      });
    }
    function move(x,y){
      px=x;py=y;if(!pend)pend=raf(paint);
      clearTimeout(idle);idle=setTimeout(function(){px=null;if(!pend)pend=raf(paint)},3200);
    }
    addEventListener('pointermove',function(e){move(e.clientX,e.clientY)},{passive:true});
    function tc(e){var t=e.touches[0];if(t)move(t.clientX,t.clientY)}
    addEventListener('touchstart',tc,{passive:true});
    addEventListener('touchmove',tc,{passive:true});
    addEventListener('scroll',function(){if(px!==null&&!pend)pend=raf(paint)},{passive:true});
    document.addEventListener('mouseleave',function(){px=null;if(!pend)pend=raf(paint)});
  })();

  /* 3 · Tijeras que cortan la cinta al hacer scroll */
  (function(){
    var c=document.querySelector('[data-cut]');
    if(!c||RM)return;
    var pend=0;
    function upd(){
      pend=0;
      var r=c.getBoundingClientRect(),vh=innerHeight;
      var p=Math.max(0,Math.min(1,(vh*.72-r.top)/(vh*.45)));
      var W=c.clientWidth;
      c.style.setProperty('--cx',(p*(W+12)).toFixed(1)+'px');
      c.style.setProperty('--p',p.toFixed(3));
      c.style.setProperty('--o',(p>0&&p<1?Math.pow(Math.abs(Math.sin(p*24)),.6):0).toFixed(3));
    }
    function q(){if(!pend)pend=raf(upd)}
    addEventListener('scroll',q,{passive:true});addEventListener('resize',q);upd();
  })();

  /* 7 · Poste interactivo: gira más rápido y marca la sección */
  (function(){
    function booster(el,hoverEl,scrollToo){
      var anims=el.getAnimations?el.getAnimations():[];
      if(RM||!anims.length)return;
      var a=anims[0],cur=1,tgt=1,run=false,hov=false,scr=false,tm;
      function set(){tgt=hov?7:(scr?4:1);if(!run){run=true;raf(step)}}
      function step(){
        cur+=(tgt-cur)*.1;
        if(Math.abs(tgt-cur)<.03){cur=tgt;run=false}
        a.updatePlaybackRate(cur);
        if(run)raf(step);
      }
      hoverEl.addEventListener('pointerenter',function(){hov=true;set()});
      hoverEl.addEventListener('pointerleave',function(){hov=false;set()});
      if(scrollToo)addEventListener('scroll',function(){scr=true;set();clearTimeout(tm);tm=setTimeout(function(){scr=false;set()},180)},{passive:true});
    }
    var hp=document.querySelector('.pole');
    if(hp)booster(hp.querySelector('i'),hp,false);

    var sp=document.querySelector('.sidepole');
    if(!sp)return;
    booster(sp.querySelector('.sp-bar i'),sp.querySelector('.sp-bar'),true);
    var secs=[].slice.call(document.querySelectorAll('main section:not(.trust)'));
    if(secs.length<2){sp.style.display='none';return}
    var box=sp.querySelector('.sp-ticks'),dot=sp.querySelector('.sp-dot'),ticks=[];
    secs.forEach(function(s,i){
      var b=document.createElement('button');b.type='button';b.className='sp-t';
      var e=s.querySelector('.eyebrow');
      var lab=s.classList.contains('hero')?'Inicio':(e?e.textContent:(s.classList.contains('status-sec')?'Abierto ahora':'Sección '+(i+1)));
      lab=lab.trim();b.dataset.l=lab;b.setAttribute('aria-label',lab);
      b.style.top=(i/(secs.length-1)*100)+'%';
      b.addEventListener('click',function(){s.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'})});
      box.appendChild(b);ticks.push(b);
    });
    var last=-1,pend=0;
    function mark(){
      pend=0;var y=innerHeight*.4,k=0;
      secs.forEach(function(s,i){if(s.getBoundingClientRect().top<=y)k=i});
      if(k===last)return;last=k;
      dot.style.top=(k/(secs.length-1)*100)+'%';
      ticks.forEach(function(t,i){t.classList.toggle('on',i===k)});
    }
    function q(){if(!pend)pend=raf(mark)}
    addEventListener('scroll',q,{passive:true});addEventListener('resize',q);mark();
  })();

  /* 10 · Transición entre páginas (cortinilla si el navegador no soporta View Transitions) */
  (function(){
    if(RM||window.CSSViewTransitionRule)return;
    var w=document.querySelector('.wipe');
    if(!w)return;
    try{sessionStorage.removeItem('nvgo')}catch(e){}
    setTimeout(function(){document.documentElement.classList.remove('arrive')},2000);
    raf(function(){raf(function(){document.documentElement.classList.remove('arrive');w.classList.remove('go');w.classList.add('leave')})});
    addEventListener('pageshow',function(e){if(e.persisted){w.classList.remove('go');w.classList.remove('leave')}});
    document.addEventListener('click',function(e){
      var a=e.target.closest&&e.target.closest('a[href]');
      if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      if(a.target&&a.target!=='_self')return;
      var u;try{u=new URL(a.href,location.href)}catch(x){return}
      if(u.origin!==location.origin||!/\.html$|\/$/.test(u.pathname)||(u.pathname===location.pathname&&u.hash))return;
      e.preventDefault();
      try{sessionStorage.setItem('nvgo','1')}catch(x){}
      w.classList.remove('leave');void w.offsetWidth;w.classList.add('go');
      setTimeout(function(){location.href=a.href},380);
    });
  })();
})();

/* Botón volver arriba */
(function(){
  var b=document.querySelector('.totop');if(!b)return;
  var on=false;
  function chk(){var v=scrollY>700;if(v!==on){on=v;b.classList.toggle('on',v)}}
  addEventListener('scroll',chk,{passive:true});chk();
  b.addEventListener('click',function(){scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});
})();

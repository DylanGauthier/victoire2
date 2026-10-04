/* V2 vivant : détails complémentaires. Lit la page telle qu'Elementor la produit, n'en change pas la structure.
   S'exécute après les scripts V2 existants (v2-wipe, v2-soldout, v2-in). */
(function(){
  var FX=['v2x-on-tl','v2x-on-eq','v2x-on-cd','v2x-on-ticket','v2x-on-stamp','v2x-anim-glitch','v2x-on-grid','v2x-bg-points','v2x-on-grain','v2x-on-read','v2x-on-ripple','v2x-on-soir','v2x-on-prog','v2x-on-arrive'];
  var HERO='.e-loop-item.elementor-10204', CARD='.e-loop-item.elementor-10327';
  var MOIS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];

  // Même tempo pour tous les concerts ; ateliers, réunions et sessions n'ont pas d'égaliseur.
  var TEMPO=118;
  function bpmFor(txt){
    return /atelier|réunion|reunion|session|moulage|conférence|rencontre pro/i.test(txt)?0:TEMPO;
  }
  function clean(el){return el?el.textContent.replace(/\s+/g,' ').trim():''}
  function eqEl(bpm,bars){var s=document.createElement('span');s.className='v2x-eq';s.setAttribute('aria-hidden','true');s.dataset.bpm=bpm;s.innerHTML=new Array(bars+1).join('<i></i>');return s}

  // Couche d'animation commune (affiches et photo du prochain concert)
  function addFx(host,img,bpm){
    if(!host||!img||img==='none')return;
    host.classList.add('v2x-host');if(bpm)host.style.setProperty('--v2x-beat',(60/bpm).toFixed(3)+'s');
    var g=document.createElement('div');g.className='v2x-fx';g.setAttribute('aria-hidden','true');g.style.setProperty('--v2x-img',img);g.innerHTML='<i></i><i></i>';
    host.insertBefore(g,host.firstChild);
  }

  function init(){
    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    var body=document.body, hero=document.querySelector(HERO), cards=[].slice.call(document.querySelectorAll(CARD));
    FX.forEach(function(c){body.classList.add(c)});

    /* -- Prochain concert : égaliseur, compte à rebours, animation de la photo -- */
    if(hero){
      var kicker=hero.querySelector('[data-id="78fbdafe"] .elementor-heading-title');
      var genre=hero.querySelector('[data-id="78976fbd"] .elementor-widget-container');
      var bpm=bpmFor(clean(hero));
      if(kicker&&bpm){kicker.appendChild(eqEl(bpm,6))}
      var himg=hero.querySelector('[data-id="43572f94"] img');
      if(himg){var hc=himg.closest('a')||himg.parentNode;hc.style.display='block';addFx(hc,'url("'+(himg.currentSrc||himg.src)+'")',bpm)}
      var m=clean(hero).toLowerCase().match(new RegExp('(\\d{1,2})\\s+('+MOIS.join('|')+')'));
      var gw=hero.querySelector('[data-id="78976fbd"]');
      if(m&&gw){
        var now=new Date(), mo=MOIS.indexOf(m[2]), y=now.getFullYear();
        var target=new Date(y,mo,+m[1],20,0,0); // ouverture des portes supposée à 20h
        if(target<now-864e5)target.setFullYear(y+1);
        var cd=document.createElement('div');cd.className='v2x-cd';cd.setAttribute('aria-hidden','true');
        cd.innerHTML='<div class="v2x-cd__units">'+['jours','heures','min','sec'].map(function(u){return '<div class="v2x-cd__u"><b>00</b><i>'+u+'</i></div>'}).join('')+'</div>'+
          '<div class="v2x-cd__badge v2x-cd__badge--soir"><b>Ce soir</b><span>Ouverture des portes 20h</span></div>'+
          '<div class="v2x-cd__badge v2x-cd__badge--live"><i></i><b>En ce moment</b><span>Sur scène</span></div>';
        gw.parentNode.insertBefore(cd,gw.nextSibling);
        window.v2xTarget=target.getTime(); // utilisé par le panneau de démo pour simuler l'heure
        var cells=[].slice.call(cd.querySelectorAll('b')).slice(0,4);
        var tick=function(){
          var now=Date.now()+(window.v2xSim||0), s=Math.max(0,Math.floor((target-now)/1000));
          var sameDay=new Date(now).toDateString()===target.toDateString();
          cd.classList.toggle('v2x-cd--live',now>=target&&now<target.getTime()+6*36e5);
          cd.classList.toggle('v2x-cd--soir',now<target&&sameDay);
          cd.classList.toggle('v2x-cd--past',now>=target.getTime()+6*36e5);
          [Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60].forEach(function(n,i){
            var v=(n<10?'0':'')+n;if(cells[i].textContent!==v){cells[i].textContent=v;var u=cells[i].parentNode;u.classList.remove('v2x-tickd');void u.offsetWidth;u.classList.add('v2x-tickd')}})};
        tick();setInterval(tick,1000);
      }
    }

    /* -- Cartes « À venir » : égaliseur au survol, glitch, ticket, tampon -- */
    var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){var s=e.target.querySelector('.v2x-stamp');if(s)s.classList.add('v2x-on');io.unobserve(e.target)}})},{threshold:.6}):null;
    var stamps=[]; // tampon à l'échelle de la carte : le mot occupe ~85 % de la largeur
    function sizeStamps(){stamps.forEach(function(x){x.st.style.setProperty('--v2x-sf',Math.round(x.sec.offsetWidth*.21)+'px')})}
    addEventListener('resize',sizeStamps);
    cards.forEach(function(card){
      var sec=card.querySelector(':scope > section');if(!sec)return;
      var fr=document.createElement('span');fr.className='v2x-frame';fr.setAttribute('aria-hidden','true');card.appendChild(fr);
      ['tl','tr','bl','br'].forEach(function(k){var mk=document.createElement('span');mk.className='v2x-mark v2x-mark--'+k;mk.setAttribute('aria-hidden','true');card.appendChild(mk)});
      var b=bpmFor(clean(card));
      if(b){var w=document.createElement('div');w.className='v2x-card-eq';w.appendChild(eqEl(b,5));sec.appendChild(w)}
      addFx(sec,getComputedStyle(sec).backgroundImage,b);
      if(card.querySelector('.v2-soldout')){var st=document.createElement('div');st.className='v2x-stamp';st.setAttribute('aria-hidden','true');st.textContent='COMPLET';sec.appendChild(st);stamps.push({st:st,sec:sec});if(io)io.observe(card);else st.classList.add('v2x-on')}
    });
    sizeStamps();
    [].slice.call(document.querySelectorAll(HERO+' .elementor-button.v2-wipe,'+CARD+' .elementor-button.v2-wipe')).forEach(function(a){
      if(a.querySelector('.v2x-tk__stub'))return;
      a.classList.add('v2x-tk');var s=document.createElement('span');s.className='v2x-tk__stub';s.setAttribute('aria-hidden','true');s.textContent='→';a.appendChild(s);
    });

    /* -- Frise : prochaines dates placées sur le calendrier réel -- */
    var grid=cards[0]&&cards[0].closest('.elementor-widget-loop-grid');
    var anchor=grid&&(grid.closest('.elementor-top-section')||grid.closest('.e-con'));
    var rx=/(\d{1,2})(?:\s*\+\s*\d{1,2})?\s+([a-zéû]+)/;
    var today=new Date();today.setHours(0,0,0,0);
    var evs=cards.map(function(c){
      var tag=clean(c.querySelector('[data-id="3bad4c73"]')).toLowerCase(), m=tag.match(rx);if(!m||MOIS.indexOf(m[2])<0)return null;
      var d=new Date(today.getFullYear(),MOIS.indexOf(m[2]),+m[1]);if(d<today-30*864e5)d.setFullYear(d.getFullYear()+1);
      return {d:d,card:c,title:clean(c.querySelector('.elementor-heading-title')),full:!!c.querySelector('.v2-soldout')};
    }).filter(Boolean).sort(function(a,b){return a.d-b.d});
    if(anchor&&evs.length>1){
      var t0=today.getTime(), t1=Math.max(evs[evs.length-1].d.getTime(),t0+14*864e5)+2*864e5, pos=function(d){return ((d-t0)/(t1-t0)*100).toFixed(2)+'%'};
      var tl=document.createElement('nav');tl.className='v2x-tl';tl.setAttribute('aria-label','Frise des prochaines dates');
      var h='<div class="v2x-tl__rail"><div class="v2x-tl__line"></div><div class="v2x-tl__now" style="left:0"><i>Aujourd’hui</i></div>';
      for(var md=new Date(today.getFullYear(),today.getMonth()+1,1);md<t1;md.setMonth(md.getMonth()+1))h+='<div class="v2x-tl__month" style="left:'+pos(md)+'">'+MOIS[md.getMonth()]+'</div>';
      h+='</div>';tl.innerHTML=h;
      var rail=tl.firstChild;
      evs.forEach(function(e,i){
        var a=document.createElement('a');a.className='v2x-tl__tick'+(e.full?' v2x-full':'');a.href='#';a.style.left=pos(e.d);a.style.transitionDelay=(.25+i*.06)+'s, 0s';
        a.innerHTML='<b>'+e.d.getDate()+'</b><span>'+e.title+(e.full?' · complet':'')+'</span>';
        a.setAttribute('aria-label',e.d.getDate()+' '+MOIS[e.d.getMonth()]+' : '+e.title);
        a.addEventListener('click',function(ev){ev.preventDefault();e.card.scrollIntoView({behavior:'smooth',block:'center'})});
        e.card.addEventListener('mouseenter',function(){a.classList.add('v2x-hot')});
        e.card.addEventListener('mouseleave',function(){a.classList.remove('v2x-hot')});
        rail.appendChild(a);
      });
      anchor.insertBefore(tl,anchor.firstChild); // en tête de la section « À venir » : profite de son fond
      if('IntersectionObserver' in window){var tio=new IntersectionObserver(function(es){if(es[0].isIntersecting){tl.classList.add('v2x-in');tio.disconnect()}},{threshold:.4});tio.observe(tl)}else tl.classList.add('v2x-in');

      /* Repère de lecture : un trait rouge avance sur la frise jusqu'à la date de l'affiche à l'écran */
      var read=document.createElement('div');read.className='v2x-tl__read';rail.insertBefore(read,rail.children[1]);
      var ticks=[].slice.call(rail.querySelectorAll('.v2x-tl__tick'));
      var readT=false;
      function onRead(){readT=false;
        var on=body.classList.contains('v2x-on-read'), ar=anchor.getBoundingClientRect();
        var best=null,bd=1e9,mid=innerHeight*.55;
        if(on&&ar.top<innerHeight*.6&&ar.bottom>innerHeight*.4)evs.forEach(function(e,i){var r=e.card.getBoundingClientRect(),d=Math.abs((r.top+r.bottom)/2-mid);if(d<bd){bd=d;best=i}});
        read.style.width=best===null?'0':pos(evs[best].d);
        ticks.forEach(function(a,i){a.classList.toggle('v2x-cur',i===best)});
      }
      addEventListener('scroll',function(){if(!readT){readT=true;requestAnimationFrame(onRead)}},{passive:true});
      addEventListener('resize',onRead);onRead();
    }

    /* -- Ambiance du fond : une couche derrière le contenu des deux sections noires -- */
    var bgs=[];
    [hero,cards[0]].forEach(function(el){
      var w=el&&el.closest('.elementor-widget-loop-grid'), sec=w&&w.closest('.elementor-top-section');
      if(!sec||sec.classList.contains('v2x-bgsec'))return;
      sec.classList.add('v2x-bgsec');
      var bg=document.createElement('div');bg.className='v2x-bg';bg.setAttribute('aria-hidden','true');
      bg.innerHTML='<canvas class="v2x-bg__cv"></canvas><span class="v2x-bg__trame"></span><span class="v2x-bg__f v2x-bg__f--a"></span><span class="v2x-bg__f v2x-bg__f--b"></span><span class="v2x-bg__f v2x-bg__f--c"></span><span class="v2x-bg__grain"></span>';
      sec.insertBefore(bg,sec.firstChild);bgs.push({sec:sec,cv:bg.firstChild,vis:false});
    });
    // trait de séparation du site juste sous la frise
    var tlNext=document.querySelector('.v2x-tl')&&document.querySelector('.v2x-tl').parentNode;
    if(tlNext){var sep=[].slice.call(tlNext.querySelectorAll('.elementor-inner-section')).filter(function(e){return parseFloat(getComputedStyle(e).borderTopWidth)>0})[0];if(sep)sep.classList.add('v2x-nosep')}

    // Fonds animés sur canvas : matrice de points, ondes, pulsation (30 i/s, seulement quand visible)
    var mouse={x:-1e4,y:-1e4};
    addEventListener('pointermove',function(e){mouse.x=e.clientX;mouse.y=e.clientY},{passive:true});
    if('IntersectionObserver' in window){var bio=new IntersectionObserver(function(es){es.forEach(function(e){bgs.forEach(function(b){if(b.sec===e.target)b.vis=e.isIntersecting})})});bgs.forEach(function(b){bio.observe(b.sec)})}else bgs.forEach(function(b){b.vis=true});
    var beatMs=6e4/TEMPO, last=0, ripples=[];
    // Onde au clic : un anneau rouge traverse les points
    addEventListener('pointerdown',function(e){
      if(!body.classList.contains('v2x-on-ripple')||reduce||body.classList.contains('v2x-calm'))return;
      bgs.forEach(function(b){var r=b.sec.getBoundingClientRect();if(e.clientY>=r.top&&e.clientY<=r.bottom)ripples.push({b:b,x:e.clientX-r.left,y:e.clientY-r.top+(-Math.min(0,r.top)<0?0:0),t0:performance.now(),top:r.top})});
    },{passive:true});
    function mode(){var m=(body.className.match(/v2x-bg-(points|ondes|pulse)/)||[])[1];return m}
    function drawBg(t){
      var m=mode(), still=reduce||body.classList.contains('v2x-calm');
      if(m&&(t-last>33||!last)){last=t;
        bgs.forEach(function(b){
          if(!b.vis)return;
          // le canvas fait la hauteur de l'écran et suit le scroll dans la section (coordonnées = celles de la section)
          var cv=b.cv,dpr=Math.min(1.5,devicePixelRatio||1),sr=b.sec.getBoundingClientRect(),W=sr.width,H=sr.height,VH=Math.min(innerHeight,H);if(!W||!H)return;
          if(cv.style.height!==VH+'px')cv.style.height=VH+'px'; // jamais étiré : 1 px CSS = 1 px dessiné
          var off=Math.max(0,Math.min(H-VH,-sr.top));cv.style.transform='translateY('+off+'px)';
          if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(VH*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(VH*dpr)}
          var c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,-off*dpr);c.clearRect(0,off,W,VH);
          var T=still?0:t, mx=mouse.x-sr.left, my=mouse.y-sr.top, y0=off, y1=off+VH;
          if(m==='points'){
            var g=24, rp=[], light=body.classList.contains('v2x-light');
            ripples=ripples.filter(function(r){return t-r.t0<1500});
            ripples.forEach(function(r){if(r.b===b)rp.push({x:r.x,y:r.y,R:(t-r.t0)*.75,k:1-(t-r.t0)/1500})});
            // grille calée sur la page : les points se prolongent d'une section à l'autre
            var pt=sr.top+scrollY, oy=((g/2-pt)%g+g)%g, ox=((g/2-sr.left)%g+g)%g;
            for(var y=oy+Math.floor((y0-oy)/g)*g;y<y1;y+=g)for(var x=ox;x<W;x+=g){
              var wave=.5+.5*Math.sin((x*.6+y+pt)*.012-T*.0011), d=Math.hypot(x-mx,y-my), near=Math.max(0,1-d/150);
              for(var q=0;q<rp.length;q++){var dd=Math.abs(Math.hypot(x-rp[q].x,y-rp[q].y)-rp[q].R);if(dd<34)near=Math.max(near,(1-dd/34)*rp[q].k*.9)}
              var al=.05+.09*wave*wave;
              if(near>0){c.fillStyle='rgba(224,4,4,'+(al+.6*near).toFixed(3)+')';c.beginPath();c.arc(x,y,1.1+1.3*near,0,6.283);c.fill()}
              else{c.fillStyle=(light?'rgba(17,17,17,':'rgba(255,255,255,')+(light?al*1.25:al).toFixed(3)+')';c.fillRect(x-1,y-1,2,2)}
            }
          }else if(m==='ondes'){
            var kick=Math.pow(1-((T%beatMs)/beatMs),3);
            for(var k=0;k<6;k++){
              var red=k===2, amp=(14+k*7)*(1+(red?.35*kick:.12*kick)), base=y0+VH*(.3+k*.09), ph=T*.0004*(k%2?1:-1)+k*1.7;
              c.beginPath();
              for(var x2=0;x2<=W;x2+=8){var yy=base+Math.sin(x2*.006+ph)*amp+Math.sin(x2*.017-ph*1.3)*amp*.35;x2?c.lineTo(x2,yy):c.moveTo(x2,yy)}
              c.strokeStyle=red?'rgba(224,4,4,.28)':'rgba(255,255,255,'+(.035+k*.008).toFixed(3)+')';c.lineWidth=red?1.5:1;c.stroke();
            }
          }else if(m==='pulse'){
            // anneaux concentriques qui partent au tempo depuis la gauche de la section, comme une membrane de haut-parleur
            var cx=W*.18, cy=y0+VH*.4, maxR=Math.hypot(W,H)*.8, period=beatMs*2;
            for(var i=0;i<6;i++){
              var age=((T+i*period)%(period*6))/(period*6), rr=age*maxR;
              c.beginPath();c.arc(cx,cy,rr,0,6.283);
              c.strokeStyle=(i%3===0?'rgba(224,4,4,':'rgba(255,255,255,')+((i%3===0?.3:.1)*(1-age)).toFixed(3)+')';c.lineWidth=i%3===0?1.5:1;c.stroke();
            }
          }
        });
      }
      requestAnimationFrame(drawBg);
    }
    requestAnimationFrame(drawBg);

    /* -- Version claire : on repère une fois les blancs, fonds noirs et liserés blancs des deux sections sombres
       (hors affiches, qui gardent leur rendu) ; les classes n'agissent que si <body> porte v2x-light. -- */
    (function(){
      var rgb=function(c){var m=c.match(/[\d.]+/g);return m?m.map(Number):[0,0,0,0]};
      var isRed=function(c){var v=rgb(c);return v[0]>180&&v[1]<60&&v[2]<60&&(v[3]===undefined||v[3]>0)};
      var roots=bgs.map(function(b){return b.sec});
      roots.forEach(function(root){
        [root].concat([].slice.call(root.querySelectorAll('*'))).forEach(function(el){
          if(el.closest(CARD)||el.closest('.v2x-tl')||el.closest('.v2x-bg')||el.closest('.v2x-cd'))return;
          var cs=getComputedStyle(el), btn=el.closest('.elementor-button');
          if(btn&&isRed(getComputedStyle(btn).backgroundColor))return; // boutons rouges : inchangés
          var c=rgb(cs.color), lo=Math.min(c[0],c[1],c[2]), sat=Math.max(c[0],c[1],c[2])-lo; if(sat<30){if(lo>200)el.classList.add('v2x-l-ink');else if(lo>120)el.classList.add('v2x-l-ink2')}
          var b=rgb(cs.backgroundColor); if(cs.backgroundColor!=='rgba(0, 0, 0, 0)'&&b[0]<45&&b[1]<45&&b[2]<45&&(b[3]===undefined||b[3]>0))el.classList.add(el===root?'v2x-l-page':'v2x-l-bg');
          var bc=rgb(cs.borderTopColor); if(parseFloat(cs.borderTopWidth)+parseFloat(cs.borderLeftWidth)+parseFloat(cs.borderBottomWidth)>0&&bc[0]>170&&bc[1]>170&&bc[2]>170)el.classList.add('v2x-l-bd');
        });
      });
    })();

    /* -- Barre de progression rouge en haut de page (même élément que sur les pages concert du site) -- */
    var pb=document.querySelector('.v2-progress');
    if(!pb){pb=document.createElement('div');pb.className='v2-progress v2x-prog';pb.setAttribute('aria-hidden','true');body.appendChild(pb)}
    var pbT=false;
    function onProg(){pbT=false;var h=document.documentElement.scrollHeight-innerHeight;pb.style.transform='scaleX('+(h>0?Math.min(1,scrollY/h):0)+')'}
    addEventListener('scroll',function(){if(!pbT){pbT=true;requestAnimationFrame(onProg)}},{passive:true});onProg();

    /* -- Arrivée des contenus : la page se construit en douceur (montée + fondu, en cascade de 0,1 s) --
       Les éléments visibles en même temps arrivent l'un après l'autre, dans l'ordre de lecture. */
    if(!reduce&&'IntersectionObserver' in window){
      var aio=new IntersectionObserver(function(es){
        var vis=es.filter(function(e){return e.isIntersecting}).map(function(e){return e.target});
        vis.sort(function(x,y){return x.compareDocumentPosition(y)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1});
        vis.forEach(function(el,i){el.style.setProperty('--v2x-d',Math.min(i*.08,1).toFixed(2)+'s');el.classList.add('v2x-a-in');aio.unobserve(el);
          setTimeout(function(){el.style.removeProperty('--v2x-d')},2500)}); // le délai ne doit pas ralentir les survols ensuite
      },{threshold:.02,rootMargin:'0px 0px -40px 0px'});
      var arrive=function(el,kind){if(!el||el.classList.contains('v2x-a')||el.classList.contains('v2x-ca'))return;el.classList.add(kind==='card'?'v2x-ca':'v2x-a');if(kind&&kind!=='card')el.classList.add('v2x-a--'+kind);aio.observe(el)};
      if(hero){
        arrive(hero.querySelector('[data-id="43572f94"]'),'img');
        var col=hero.querySelector('[data-id="78fbdafe"]');col=col&&col.parentNode;
        if(col)[].slice.call(col.children).forEach(function(el){if(el.offsetHeight)arrive(el)});
      }
      var nosep=document.querySelector('.v2x-nosep');
      if(nosep)[].slice.call(nosep.querySelectorAll('.elementor-widget')).forEach(function(el){arrive(el,'x')});
      // affiches : la grille et ses traits restent en place, seuls l'image et le texte de chaque case arrivent
      cards.forEach(function(c){arrive(c.querySelector(':scope > section'),'card')});
    }

    /* -- Un seul rAF pour tous les égaliseurs (attaque sur le temps, caisse claire au contretemps) -- */
    var eqs=[].slice.call(document.querySelectorAll('.v2x-eq')).map(function(el){return {el:el,bars:[].slice.call(el.children),bpm:+el.dataset.bpm,seed:Math.random()*1e3,lv:[]}});
    function frame(t){
      if(!reduce&&body.classList.contains('v2x-on-eq')&&!body.classList.contains('v2x-calm')){
        eqs.forEach(function(q){
          if(!q.el.offsetParent)return;
          var beat=6e4/q.bpm, ph=((t+q.seed)%beat)/beat, kick=Math.pow(1-ph,3), off=((t+q.seed+beat/2)%beat)/beat, sn=Math.pow(1-off,5)*.6;
          q.bars.forEach(function(bar,i){var f=i/(q.bars.length-1),g=.12+kick*(1-f)*.85+sn*f*.8+.16*Math.abs(Math.sin(t/(170+i*37)+q.seed+i)),v=q.lv[i]||.15;
            v+=(Math.min(1,g)-v)*(g>v?.55:.18);q.lv[i]=v;bar.style.transform='scaleY('+v.toFixed(3)+')'});
        });
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if(document.readyState==='complete')setTimeout(init,0);else addEventListener('load',function(){setTimeout(init,0)});
})();

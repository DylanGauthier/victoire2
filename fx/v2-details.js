/* V2 détails : logo qui se « recale » de temps en temps, décalage sérigraphie au survol des visuels, petit égaliseur.
   S'appuie sur la page telle qu'Elementor la produit, sans en changer la structure. */
(function(){
  var HERO='.e-loop-item.elementor-10204', CARD='.e-loop-item.elementor-10327', TEMPO=118;

  function init(){
    var body=document.body, reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    ['v2d-on-logo','v2d-on-seri','v2d-on-eq'].forEach(function(c){body.classList.add(c)});
    var calm=function(){return reduce||body.classList.contains('v2d-calm')};

    /* 1. Logo : un « tic » de temps en temps */
    var logos=[].slice.call(document.querySelectorAll('a.logo_is_img'));
    function tic(a){a.classList.remove('v2d-tic');void a.offsetWidth;a.classList.add('v2d-tic')}
    // pas de déclenchement au survol : le site a déjà son propre effet de logo au survol (contour qui se trace)
    (function loop(){setTimeout(function(){
      if(!calm()&&!document.hidden)logos.forEach(function(a){if(a.offsetParent)tic(a)});loop();
    },12000+Math.random()*8000)})();
    setTimeout(function(){if(!calm())logos.forEach(tic)},1200); // une première fois peu après l'arrivée

    /* 2. Décalage sérigraphie sur les affiches et la photo du prochain concert */
    function addSeri(host,img){
      if(!host||!img||img==='none')return;
      host.classList.add('v2d-host');
      var d=document.createElement('span');d.className='v2d-seri';d.setAttribute('aria-hidden','true');d.style.setProperty('--v2d-img',img);
      host.insertBefore(d,host.firstChild);
    }
    [].slice.call(document.querySelectorAll(CARD+' > section')).forEach(function(sec){addSeri(sec,getComputedStyle(sec).backgroundImage)});
    var hero=document.querySelector(HERO);
    if(hero){
      var himg=hero.querySelector('[data-id="43572f94"] img');
      if(himg){var hc=himg.closest('a')||himg.parentNode;hc.style.display='block';addSeri(hc,'url("'+(himg.currentSrc||himg.src)+'")')}
    }

    /* 3. Petit égaliseur (attaque sur le temps, caisse claire au contretemps) */
    var kicker=hero&&hero.querySelector('[data-id="78fbdafe"] .elementor-heading-title');
    if(kicker){
      var eq=document.createElement('span');eq.className='v2d-eq';eq.setAttribute('aria-hidden','true');eq.innerHTML=new Array(7).join('<i></i>');kicker.appendChild(eq);
      var bars=[].slice.call(eq.children), lv=[], beat=6e4/TEMPO;
      (function frame(t){
        if(!calm()&&body.classList.contains('v2d-on-eq')&&eq.offsetParent){
          var ph=(t%beat)/beat, kick=Math.pow(1-ph,3), sn=Math.pow(1-((t+beat/2)%beat)/beat,5)*.6;
          bars.forEach(function(b,i){var f=i/(bars.length-1),g=.12+kick*(1-f)*.85+sn*f*.8+.16*Math.abs(Math.sin(t/(170+i*37)+i)),v=lv[i]||.15;
            v+=(Math.min(1,g)-v)*(g>v?.55:.18);lv[i]=v;b.style.transform='scaleY('+v.toFixed(3)+')'});
        }
        requestAnimationFrame(frame);
      })(0);
    }
  }
  if(document.readyState==='complete')setTimeout(init,0);else addEventListener('load',function(){setTimeout(init,0)});
})();

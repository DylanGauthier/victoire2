/* Panneau de démonstration uniquement (ne fait pas partie des effets à intégrer). */
addEventListener('load',function(){setTimeout(function(){
  var B=document.body, sel='font:600 12px Montserrat,sans-serif;padding:4px;border:1.5px solid #111;width:100%';
  var THEMES=[['','Sombre (actuel)'],['v2x-mid','Béton (entre-deux)'],['v2x-light','Clair']];
  var BG=[['points','Matrice de points'],['ondes','Ondes en rythme']];
  var ANIM=[['serigraphie','Sérigraphie mal repérée'],['glitch','Glitch'],['','Aucune']];
  var p=document.createElement('div');
  p.style.cssText='position:fixed;left:16px;bottom:16px;z-index:2147483000;width:250px;background:#fff;color:#111;border:2px solid #111;box-shadow:5px 5px 0 #E00404;font:600 13px Montserrat,sans-serif';
  p.innerHTML='<div data-h style="background:#111;color:#fff;padding:8px 12px;font:800 14px \'Barlow Condensed\',sans-serif;letter-spacing:1.6px;text-transform:uppercase;cursor:pointer;display:flex;justify-content:space-between">Effets démo <span>—</span></div>'+
    '<div data-b style="padding:10px 12px;display:grid;gap:9px">'+
    '<label style="display:grid;gap:4px">Version<select data-theme style="'+sel+'">'+THEMES.map(function(a){return '<option value="'+a[0]+'">'+a[1]+'</option>'}).join('')+'</select></label>'+
    '<label style="display:grid;gap:4px">Animation des visuels au survol<select data-anim style="'+sel+'">'+ANIM.map(function(a){return '<option value="'+a[0]+'">'+a[1]+'</option>'}).join('')+'</select></label>'+
    '<label style="display:grid;gap:4px">Fond animé<select data-bg style="'+sel+'">'+BG.map(function(a){return '<option value="'+a[0]+'">'+a[1]+'</option>'}).join('')+'</select></label>'+
    '<label style="display:grid;gap:4px">Simuler l\'heure (compte à rebours)<select data-sim style="'+sel+'"><option value="">Temps réel</option><option value="-3">Jour J, 17h</option><option value="2">Pendant le concert, 22h</option></select></label>'+
    '<label style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" data-calm style="accent-color:#E00404">Réduire les animations</label>'+
    '</div>';
  document.body.appendChild(p);
  p.querySelector('[data-theme]').onchange=function(e){THEMES.forEach(function(a){if(a[0])B.classList.remove(a[0])});if(e.target.value)B.classList.add(e.target.value)};
  p.querySelector('[data-anim]').onchange=function(e){ANIM.forEach(function(a){if(a[0])B.classList.remove('v2x-anim-'+a[0])});if(e.target.value)B.classList.add('v2x-anim-'+e.target.value)};
  p.querySelector('[data-bg]').onchange=function(e){BG.forEach(function(a){B.classList.remove('v2x-bg-'+a[0])});B.classList.add('v2x-bg-'+e.target.value)};
  p.querySelector('[data-sim]').onchange=function(e){var v=e.target.value;window.v2xSim=(v===''||!window.v2xTarget)?0:window.v2xTarget+(+v)*36e5-Date.now()};
  p.querySelector('[data-calm]').onchange=function(e){B.classList.toggle('v2x-calm',e.target.checked)};
  var h=p.querySelector('[data-h]'),b=p.querySelector('[data-b]');
  function tog(){var m=b.style.display!=='none';b.style.display=m?'none':'grid';h.lastChild.textContent=m?'+':'—'}
  h.onclick=tog; if(innerWidth<900)tog();
},50)});

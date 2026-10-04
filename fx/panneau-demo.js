/* Panneau de démonstration uniquement (ne fait pas partie des détails à intégrer). */
addEventListener('load',function(){setTimeout(function(){
  var B=document.body;
  var L=[['v2d-on-logo','Logo qui se recale'],['v2d-on-seri','Décalage au survol des visuels'],['v2d-on-eq','Petit égaliseur']];
  var p=document.createElement('div');
  p.style.cssText='position:fixed;left:16px;bottom:16px;z-index:2147483000;width:240px;background:#fff;color:#111;border:2px solid #111;box-shadow:5px 5px 0 #E00404;font:600 13px Montserrat,sans-serif';
  p.innerHTML='<div data-h style="background:#111;color:#fff;padding:8px 12px;font:800 14px \'Barlow Condensed\',sans-serif;letter-spacing:1.6px;text-transform:uppercase;cursor:pointer;display:flex;justify-content:space-between">Détails démo <span>—</span></div>'+
    '<div data-b style="padding:10px 12px;display:grid;gap:8px">'+
    L.map(function(x){return '<label style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" data-c="'+x[0]+'" checked style="accent-color:#E00404">'+x[1]+'</label>'}).join('')+
    '<label style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" data-calm style="accent-color:#E00404">Réduire les animations</label>'+
    '<button data-tic style="font:800 11px Montserrat,sans-serif;letter-spacing:.06em;text-transform:uppercase;border:1.5px solid #111;background:#fff;padding:6px;cursor:pointer">Rejouer le logo</button>'+
    '</div>';
  document.body.appendChild(p);
  p.querySelectorAll('[data-c]').forEach(function(c){c.onchange=function(){B.classList.toggle(c.dataset.c,c.checked)}});
  p.querySelector('[data-calm]').onchange=function(e){B.classList.toggle('v2d-calm',e.target.checked)};
  p.querySelector('[data-tic]').onclick=function(){document.querySelectorAll('a.logo_is_img').forEach(function(a){a.classList.remove('v2d-tic');void a.offsetWidth;a.classList.add('v2d-tic')})};
  var h=p.querySelector('[data-h]'),b=p.querySelector('[data-b]');
  function tog(){var m=b.style.display!=='none';b.style.display=m?'none':'grid';h.lastChild.textContent=m?'+':'—'}
  h.onclick=tog; if(innerWidth<900)tog();
},50)});

/* Panneau de démonstration uniquement (ne fait pas partie des effets à intégrer). */
addEventListener('load',function(){setTimeout(function(){
  var L=[['v2x-on-tl','Frise des prochaines dates'],['v2x-on-eq','Petit égaliseur'],['v2x-on-grid','Grille : liseré rouge + repères'],['v2x-on-cd','Compte à rebours'],['v2x-on-ticket','Bouton ticket'],['v2x-on-stamp','Tampon COMPLET'],['v2x-on-read','Repère de lecture (frise collante)'],['v2x-on-ripple','Onde au clic sur le fond'],['v2x-on-prog','Barre de progression'],['v2x-on-arrive','Arrivée des contenus'],['v2x-on-soir','« Ce soir » / « En ce moment »']];
  var BG=[['points','Matrice de points (réagit à la souris)'],['ondes','Ondes en rythme'],['pulse','Pulsation haut-parleur'],['trame','Trame demi-teinte'],['faisceaux','Faisceaux de projecteurs'],['','Noir uni (actuel)']];
  var ANIM=[['glitch','Glitch'],['serigraphie','Sérigraphie mal repérée'],['trame','Trame de points'],['projecteur','Coup de projecteur'],['vhs','Balayage VHS'],['rideau','Rideau rouge'],['tempo','Battement en rythme'],['','Aucune']];
  var p=document.createElement('div');
  p.style.cssText='position:fixed;left:16px;bottom:16px;z-index:2147483000;width:260px;background:#fff;color:#111;border:2px solid #111;box-shadow:5px 5px 0 #E00404;font:600 13px Montserrat,sans-serif';
  p.innerHTML='<div data-h style="background:#111;color:#fff;padding:8px 12px;font:800 14px \'Barlow Condensed\',sans-serif;letter-spacing:1.6px;text-transform:uppercase;cursor:pointer;display:flex;justify-content:space-between">Effets démo <span>—</span></div><div data-b style="padding:10px 12px;display:grid;gap:7px">'+
    L.map(function(x){return '<label style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" data-c="'+x[0]+'" checked style="accent-color:#E00404">'+x[1]+'</label>'}).join('')+
    '<label style="display:grid;gap:4px">Animation des visuels au survol<select data-anim style="font:600 12px Montserrat,sans-serif;padding:4px;border:1.5px solid #111">'+ANIM.map(function(a){return '<option value="'+a[0]+'">'+a[1]+'</option>'}).join('')+'</select></label>'+
    '<label style="display:grid;gap:4px">Ambiance du fond<select data-bg style="font:600 12px Montserrat,sans-serif;padding:4px;border:1.5px solid #111">'+BG.map(function(a){return '<option value="'+a[0]+'">'+a[1]+'</option>'}).join('')+'</select></label>'+
    '<label style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" data-c="v2x-on-grain" checked style="accent-color:#E00404">Grain sur le fond</label>'+
    '<label style="display:grid;gap:4px">Simuler l\'heure (compte à rebours)<select data-sim style="font:600 12px Montserrat,sans-serif;padding:4px;border:1.5px solid #111"><option value="">Temps réel</option><option value="-3">Jour J, 17h</option><option value="2">Pendant le concert, 22h</option></select></label>'+
    '<label style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" data-calm style="accent-color:#E00404">Réduire les animations</label>'+
    '<div style="font:500 11px/1.4 Montserrat,sans-serif;color:#666;border-top:1px solid #ddd;padding-top:7px">Tout le reste est le site actuel, à l\'identique (duotone, grain, boutons, logo).</div></div>';
  document.body.appendChild(p);
  p.querySelectorAll('[data-c]').forEach(function(c){c.onchange=function(){document.body.classList.toggle(c.dataset.c,c.checked)}});
  p.querySelector('[data-anim]').onchange=function(e){ANIM.forEach(function(a){if(a[0])document.body.classList.remove('v2x-anim-'+a[0])});if(e.target.value)document.body.classList.add('v2x-anim-'+e.target.value)};
  p.querySelector('[data-bg]').onchange=function(e){BG.forEach(function(a){if(a[0])document.body.classList.remove('v2x-bg-'+a[0])});if(e.target.value)document.body.classList.add('v2x-bg-'+e.target.value)};
  p.querySelector('[data-sim]').onchange=function(e){var v=e.target.value;window.v2xSim=(v===''||!window.v2xTarget)?0:window.v2xTarget+(+v)*36e5-Date.now()};
  p.querySelector('[data-calm]').onchange=function(e){document.body.classList.toggle('v2x-calm',e.target.checked)};
  var h=p.querySelector('[data-h]'),b=p.querySelector('[data-b]');
  function tog(){var m=b.style.display!=='none';b.style.display=m?'none':'grid';h.lastChild.textContent=m?'+':'—'}
  h.onclick=tog; if(innerWidth<900)tog();
},50)});

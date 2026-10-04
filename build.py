"""Construit index.html : page d'accueil réelle de victoire2.com + couche d'effets fx/ (sans traceurs).
   python build.py          -> réutilise original.html
   python build.py --fetch  -> retélécharge la page avant ; --local -> polices servies par le serveur de dev"""
import re, sys, urllib.request
if '--fetch' in sys.argv:
    req=urllib.request.Request('https://www.victoire2.com/',headers={'User-Agent':'Mozilla/5.0'})
    open('original.html','wb').write(urllib.request.urlopen(req).read())
s=open('original.html',encoding='utf-8').read()
# Toutes les ressources relatives pointent vers le vrai site
s=re.sub(r'<head([^>]*)>',r'<head\1>\n<base href="https://www.victoire2.com/">\n<meta name="robots" content="noindex,nofollow">',s,count=1)
# Pas de mesure d'audience depuis la démo
s=re.sub(r'<script[^>]*googletagmanager[^>]*>\s*</script>','',s)
s=re.sub(r'<script id="google_gtagjs-js-after">.*?</script>','',s,flags=re.S)
s=re.sub(r'<link[^>]*googletagmanager[^>]*>','',s)
# Les polices d'icônes du thème refusent le cross-origin : on recopie leurs feuilles + fichiers
# de police dans assets/, servis depuis GitHub Pages (CORS ouvert) ou le serveur de dev (--local).
import os, urllib.parse
LOCAL='http://localhost:8643/' if '--local' in sys.argv else 'https://dylangauthier.github.io/victoire2/'
def get(url):
    req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
    return urllib.request.urlopen(req).read()
def mirror(url):
    path='assets/'+urllib.parse.urlparse(url).path.lstrip('/')
    if not os.path.exists(path):
        os.makedirs(os.path.dirname(path),exist_ok=True)
        try: open(path,'wb').write(get(url))
        except Exception as e: print('  échec',url,e); return None
    return path
for href in set(re.findall(r"href='(https://www\.victoire2\.com/[^']*(?:icons|font-awesome|eicons|useanyfont)[^']*\.css)(?:\?[^']*)?'",s)):
    css_path=mirror(href)
    if not css_path: continue
    css=open(css_path,encoding='utf-8',errors='ignore').read()
    for u in set(re.findall(r'''url\(["']?([^"')?#]+\.(?:woff2?|ttf|eot|svg))''',css)):
        mirror(urllib.parse.urljoin(href,u))
    # chemins absolus (« /wp-content/… » ou domaine du site) -> copie locale
    # rendus relatifs à la feuille, pour marcher en local comme sous /victoire2/ sur GitHub Pages
    def rel(m):
        path=m.group(2)
        if path.startswith('assets/'): path=path[len('assets/'):]
        return 'url('+m.group(1)+os.path.relpath('assets/'+path,os.path.dirname(css_path)).replace('\\','/')
    css=re.sub(r'''url\((["']?)(?:https://www\.victoire2\.com)?/(?!/)([^"')]+)''',rel,css)
    open(css_path,'w',encoding='utf-8').write(css)
    s=re.sub(re.escape(href)+r"(\?[^']*)?'",LOCAL+css_path+"'",s)
# Polices déclarées en ligne (@font-face) sur le domaine du site : même traitement
for u in set(re.findall(r"url\('(https://www\.victoire2\.com/[^']+\.(?:woff2?|ttf))'\)",s)):
    p=mirror(u)
    if p: s=s.replace(u,LOCAL+p)
css=open('fx/v2-vivant.css',encoding='utf-8').read()
js=open('fx/v2-vivant.js',encoding='utf-8').read()
panel=open('fx/panneau-demo.js',encoding='utf-8').read()
inj=f'\n<!-- V2 vivant (démo) -->\n<style id="v2-vivant-css">\n{css}\n</style>\n<script id="v2-vivant-js">\n{js}\n</script>\n<script>\n{panel}\n</script>\n'
i=s.rfind('</body>'); s=s[:i]+inj+s[i:]
open('index.html','w',encoding='utf-8').write(s)
print('index.html', len(s), 'octets ; gtag restants :', len(re.findall('gtag',s)))

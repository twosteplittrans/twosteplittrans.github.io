// Minimal Markdown renderer for headings, lists, code, bold/italic, inline code.
// Not exhaustive, but good enough for prompt docs.
(function(){
  function esc(s){
    return s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  }

  function render(md){
    md = md.replace(/\r\n?/g,'\n');
    const lines = md.split('\n');
    let out = [];
    let inCode = false; let codeLang = '';
    let inList = false; let listType = '';
    let para = [];
    function flushPara(){ if(para.length){ out.push('<p>'+inline(para.join(' '))+'</p>'); para=[]; } }
    function openList(type){ if(!inList){ inList=true; listType=type; out.push(`<${type}>`);} }
    function closeList(){ if(inList){ out.push(`</${listType}>`); inList=false; listType=''; } }
    function inline(s){
      s = esc(s);
      s = s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
      s = s.replace(/\*([^*]+)\*/g,'<em>$1</em>');
      s = s.replace(/`([^`]+)`/g,'<code>$1</code>');
      s = s.replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
      return s;
    }
    for(let i=0;i<lines.length;i++){
      const raw = lines[i];
      if(raw.startsWith('```')){
        if(inCode){
          out.push('</code></pre>'); inCode=false; codeLang='';
        } else {
          flushPara(); closeList(); inCode=true; codeLang=raw.slice(3).trim();
          const cls = codeLang? ` class="lang-${esc(codeLang)}"` : '';
          out.push(`<pre><code${cls}>`);
        }
        continue;
      }
      if(inCode){ out.push(esc(raw)+'\n'); continue; }
      const line = raw.trimEnd();
      if(!line){ flushPara(); closeList(); continue; }
      const mH = /^(#{1,6})\s+(.*)$/.exec(line);
      if(mH){ flushPara(); closeList(); const lvl=mH[1].length; out.push(`<h${lvl}>${inline(mH[2])}</h${lvl}>`); continue; }
      const mLi = /^[-*]\s+(.*)$/.exec(line);
      if(mLi){ flushPara(); openList('ul'); out.push('<li>'+inline(mLi[1])+'</li>'); continue; }
      const mOl = /^(\d+)\.\s+(.*)$/.exec(line);
      if(mOl){ flushPara(); openList('ol'); out.push('<li>'+inline(mOl[2])+'</li>'); continue; }
      if(/^---+$/.test(line)){ flushPara(); closeList(); out.push('<hr />'); continue; }
      // paragraph line
      para.push(line);
    }
    flushPara(); closeList(); if(inCode) out.push('</code></pre>');
    return out.join('\n');
  }

  window.SimpleMarkdown = { render };
})();


/* Administração Liberty Haul — cliente estático, autenticação e autorização verificadas pelo Supabase. */
(() => {
  'use strict';
  const BASE = 'https://xtlubocepsbqanrjabog.supabase.co';
  const KEY = 'sb_publishable_nCf37VOBL3JpxzL-SxNXxQ_VuxlKyAV';
  const BUCKET = 'liberty-product-images';
  const STORAGE_KEY = 'liberty-haul-admin-session';
  const $ = (id) => document.getElementById(id);
  let session = null;
  let products = [];
  let editing = null;
  let busy = false;
  const photoUrl = (name) => name && /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/.test(name)
    ? BASE + '/storage/v1/object/public/' + BUCKET + '/' + encodeURIComponent(name)
    : '';

  function notice(message, error) {
    const el = $('notice');
    el.textContent = message || '';
    el.hidden = !message;
    el.classList.toggle('error', Boolean(error));
  }
  function storeSession(value) {
    session = value;
    try {
      if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      else localStorage.removeItem(STORAGE_KEY);
    } catch (_) { /* Acesso temporário sem persistência. */ }
  }
  function readSession() {
    try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); return saved && saved.refresh_token ? saved : null; }
    catch (_) { return null; }
  }
  async function http(path, opts, authenticated) {
    const options = Object.assign({method:'GET'}, opts || {});
    const headers = Object.assign({apikey:KEY}, options.headers || {});
    if (authenticated) {
      await ensureSession();
      headers.Authorization = 'Bearer ' + session.access_token;
    }
    const response = await fetch(BASE + path, Object.assign({}, options, {headers}));
    if (!response.ok) {
      let detail = '';
      try { const body = await response.json(); detail = body.msg || body.error_description || body.message || body.error || ''; }
      catch (_) { /* HTTP sem JSON. */ }
      throw new Error(detail || 'Falha de comunicação (' + response.status + ')');
    }
    return response.status === 204 ? null : response.json();
  }
  async function ensureSession() {
    if (!session || !session.refresh_token) throw new Error('Sua sessão terminou. Entre novamente.');
    const now = Math.floor(Date.now()/1000);
    if (session.access_token && Number(session.expires_at) > now + 60) return;
    const next = await http('/auth/v1/token?grant_type=refresh_token', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({refresh_token:session.refresh_token})
    });
    storeSession(next);
  }
  function viewSignedIn(signedIn) {
    $('login-panel').hidden = signedIn;
    $('workspace').hidden = !signedIn;
    $('logout').hidden = !signedIn;
  }
  async function verifyAdmin() {
    if (!session || !session.user || !session.user.id) throw new Error('Conta inválida. Entre novamente.');
    const rows = await http('/rest/v1/liberty_admin_access?select=user_id&user_id=eq.' + encodeURIComponent(session.user.id), {}, true);
    if (!Array.isArray(rows) || rows.length !== 1) throw new Error('Esta conta não possui acesso à Administração da Liberty Haul.');
  }
  async function loadProducts() {
    const rows = await http('/rest/v1/liberty_products?select=*&order=created_at.desc', {}, true);
    products = Array.isArray(rows) ? rows : [];
    renderProducts();
  }
  // Publicar um link Liberty permite compartilhar sem enviar diretamente ao afiliado.
  async function copyProductLink(product) {
    if (!product.published || !product.id) {
      notice('Publique o produto antes de compartilhar o link.', true);
      return;
    }
    const url = new URL('../produto/?id=' + encodeURIComponent(product.id), window.location.href).href;
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Área de transferência indisponível');
      await navigator.clipboard.writeText(url);
      notice('Link da página Liberty copiado.');
    } catch (_) {
      // Permite cópia manual em navegadores sem acesso à área de transferência.
      window.prompt('Copie o link da página do produto:', url);
    }
  }

  function renderProducts() {
    $('total-products').textContent = String(products.length);
    const published = products.filter((p) => p.published).length;
    $('published-products').textContent = String(published);
    $('draft-products').textContent = String(products.length-published);
    const term = $('filter-products').value.trim().toLocaleLowerCase('pt-BR');
    const list = $('product-list');
    list.replaceChildren();
    let count = 0;
    for (const product of products) {
      if (term && !(product.title + ' ' + product.platform).toLocaleLowerCase('pt-BR').includes(term)) continue;
      count++;
      const row = document.createElement('article');
      row.className = 'product-row';
      const image = photoUrl(product.image_path);
      const thumb = image ? document.createElement('img') : document.createElement('span');
      thumb.className = image ? 'thumb' : 'thumb thumb-placeholder';
      if (image) { thumb.src = image; thumb.alt = ''; thumb.loading = 'lazy'; }
      else thumb.textContent = '✧';
      const info = document.createElement('div');
      info.className = 'product-info';
      const title = document.createElement('strong');
      title.textContent = product.title;
      const meta = document.createElement('small');
      meta.textContent = product.platform + ' · ' + (product.published ? 'Publicado' : 'Rascunho') + (product.live_featured ? ' · Live' : '');
      info.append(title,meta);
      const actions = document.createElement('div');
      actions.className = 'product-actions';
      const actionsList = [
        ['Editar', () => editProduct(product), false],
        [product.published ? 'Ocultar' : 'Publicar', () => togglePublished(product), false],
        ['Excluir', () => deleteProduct(product), true]
      ];
      if (product.published) actionsList.splice(1, 0, ['Copiar link', () => copyProductLink(product), false]);
      for (const [name, action, danger] of actionsList) {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = name;
        b.className = danger ? 'danger' : 'outline';
        b.addEventListener('click', action);
        actions.append(b);
      }
      row.append(thumb,info,actions);
      list.append(row);
    }
    $('product-empty').hidden = count !== 0;
  }
  function editProduct(product) {
    editing = product;
    $('editor-title').textContent = 'Editar produto';
    $('cancel-edit').hidden = false;
    $('title').value = product.title || '';
    $('description').value = product.description || '';
    $('category').value = product.category || 'casa';
    $('platform').value = product.platform || 'Shopee';
    $('affiliate-url').value = product.affiliate_url || '';
    $('published').checked = Boolean(product.published);
    $('live-featured').checked = Boolean(product.live_featured);
    $('photo').value = '';
    $('photo-current').textContent = product.image_path ? 'Imagem cadastrada: ' + product.image_path : '';
    $('title').focus();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function resetEditor() {
    editing = null;
    $('product-form').reset();
    $('editor-title').textContent = 'Novo produto';
    $('cancel-edit').hidden = true;
    $('photo-current').textContent = '';
  }
  async function uploadImage(file) {
    if (!file) return null;
    const formats = {'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
    const extension = formats[file.type];
    if (!extension) throw new Error('Use uma imagem JPEG, PNG ou WebP.');
    if (file.size > 5*1024*1024) throw new Error('A imagem deve ter no máximo 5 MB.');
    const fileName = crypto.randomUUID() + '.' + extension;
    await http('/storage/v1/object/' + BUCKET + '/' + fileName, {
      method:'POST',
      headers:{'Content-Type':file.type,'Cache-Control':'3600','x-upsert':'false'},
      body:file
    }, true);
    return fileName;
  }
  async function saveProduct(event) {
    event.preventDefault();
    if (busy) return;
    busy = true;
    $('save-product').disabled = true;
    notice('Salvando produto...');
    try {
      const url = new URL($('affiliate-url').value.trim());
      if (url.protocol !== 'https:') throw new Error('O link de afiliado precisa começar com https://.');
      const photo = $('photo').files[0];
      let imagePath = editing ? editing.image_path : null;
      if (photo) imagePath = await uploadImage(photo);
      const payload = {
        title:$('title').value.trim(),
        description:$('description').value.trim(),
        category:$('category').value,
        platform:$('platform').value,
        affiliate_url:url.toString(),
        image_path:imagePath || null,
        published:$('published').checked,
        live_featured:$('live-featured').checked,
        updated_at:new Date().toISOString()
      };
      const path = '/rest/v1/liberty_products' + (editing ? '?id=eq.' + encodeURIComponent(editing.id) : '');
      const result = await http(path, {
        method:editing ? 'PATCH' : 'POST',
        headers:{'Content-Type':'application/json',Prefer:'return=representation'},
        body:JSON.stringify(payload)
      }, true);
      if (!Array.isArray(result) || result.length !== 1) throw new Error('O banco não confirmou o salvamento do produto.');
      resetEditor();
      await loadProducts();
      notice('Produto salvo com sucesso.');
    } catch (error) { notice(error.message || 'Não foi possível salvar o produto.',true); }
    finally {busy=false;$('save-product').disabled=false;}
  }
  async function togglePublished(product) {
    if (busy) return;
    busy=true;
    notice('Atualizando...');
    try {
      const result = await http('/rest/v1/liberty_products?id=eq.'+encodeURIComponent(product.id), {
        method:'PATCH',
        headers:{'Content-Type':'application/json',Prefer:'return=representation'},
        body:JSON.stringify({published:!product.published,updated_at:new Date().toISOString()})
      }, true);
      if (!Array.isArray(result) || result.length !== 1) throw new Error('A alteração não foi confirmada.');
      await loadProducts();
      notice(product.published ? 'Produto ocultado.' : 'Produto publicado.');
    } catch (error) { notice(error.message,true); }
    finally {busy=false;}
  }
  async function deleteProduct(product) {
    if (busy || !window.confirm('Excluir definitivamente "' + product.title + '"?')) return;
    busy=true;
    notice('Excluindo produto...');
    try {
      const removed = await http('/rest/v1/liberty_products?id=eq.'+encodeURIComponent(product.id), {
        method:'DELETE', headers:{Prefer:'return=representation'}
      }, true);
      if (!Array.isArray(removed) || removed.length !== 1) throw new Error('A exclusão não foi confirmada.');
      if (editing && editing.id === product.id) resetEditor();
      await loadProducts();
      notice('Produto excluído. A imagem antiga permanece no armazenamento para revisão posterior.');
    } catch (error) { notice(error.message,true); }
    finally {busy=false;}
  }
  async function signOut() {
    try { if (session) await http('/auth/v1/logout',{method:'POST'},true); }
    catch (_) { /* Limpa acesso local mesmo se o servidor estiver indisponível. */ }
    storeSession(null);
    products=[];
    viewSignedIn(false);
    resetEditor();
    notice('Sessão encerrada.');
  }
  $('login-form').addEventListener('submit',async (event) => {
    event.preventDefault();
    $('login-button').disabled = true;
    notice('Autenticando...');
    try {
      const email = $('login-email').value.trim();
      const password = $('login-password').value;
      const result = await http('/auth/v1/token?grant_type=password',{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})
      });
      storeSession(result);
      await verifyAdmin();
      $('login-password').value = '';
      await loadProducts();
      viewSignedIn(true);
      notice('');
    } catch (error) {
      storeSession(null);
      viewSignedIn(false);
      notice(error.message || 'Falha ao entrar.',true);
    } finally { $('login-button').disabled = false; }
  });
  $('logout').addEventListener('click',signOut);
  $('cancel-edit').addEventListener('click',resetEditor);
  $('product-form').addEventListener('submit',saveProduct);
  $('reload-products').addEventListener('click',async()=>{try {await loadProducts();notice('Catálogo atualizado.');}catch(e){notice(e.message,true);}});
  $('filter-products').addEventListener('input',renderProducts);
  (async()=>{
    session=readSession();
    if (!session) return;
    try {await verifyAdmin();await loadProducts();viewSignedIn(true);}
    catch (_) {storeSession(null);viewSignedIn(false);}
  })();

  // Sugestões da ISA: nenhum conteúdo é publicado sem ação do administrador.
  let suggestions = [];
  let reviewing = false;
  function safeUrl(s) {
    try { const u = new URL(String(s || '')); return u.protocol === 'https:' ? u.href : null; }
    catch (_) { return null; }
  }
  function element(tag,text,klass) {
    const el = document.createElement(tag);
    if (text !== undefined && text !== null) el.textContent = String(text);
    if (klass) el.className = klass;
    return el;
  }
  function field(parent,caption,value,opts={}) {
    const wrapper = element('div',null,opts.full ? 'full' : '');
    const label = element('label',caption);
    const input = opts.multiline ? document.createElement('textarea') : document.createElement('input');
    if (!opts.multiline) input.type = opts.type || 'text';
    if (opts.max) input.maxLength = opts.max;
    input.value = value || '';
    label.append(input); wrapper.append(label); parent.append(wrapper);
    return input;
  }
  function categoryField(parent,value) {
    const wrapper = element('div'), label = element('label','Categoria'), select = element('select');
    for (const [code,name] of [['beleza','Beleza'],['casa','Casa'],['tech','Tecnologia'],['estilo','Estilo']]) {
      const option = element('option',name); option.value = code; select.append(option);
    }
    select.value = value;
    label.append(select); wrapper.append(label); parent.append(wrapper);
    return select;
  }
  function switchTab(name) {
    const showProducts = name !== 'suggestions';
    $('products-panel').hidden = !showProducts;
    $('suggestions-panel').hidden = showProducts;
    $('tab-products').classList.toggle('active',showProducts);
    $('tab-suggestions').classList.toggle('active',!showProducts);
    $('tab-products').setAttribute('aria-pressed',String(showProducts));
    $('tab-suggestions').setAttribute('aria-pressed',String(!showProducts));
  }
  async function loadSuggestions() {
    const rows = await http('/rest/v1/liberty_suggestions?select=*&order=created_at.desc&limit=500',{},true);
    suggestions = Array.isArray(rows) ? rows : [];
    renderSuggestions();
  }
  function renderSuggestions() {
    const pendingCount = suggestions.filter(s => s.status === 'pending').length;
    $('suggestion-count').textContent = pendingCount >= 500 ? '500+' : String(pendingCount);
    const filter = $('suggestion-status').value;
    const shown = suggestions.filter(s => filter === 'all' || s.status === filter);
    const list = $('suggestion-list'); list.replaceChildren();
    $('suggestion-empty').hidden = shown.length > 0;
    for (const s of shown) {
      const card = element('article',null,'suggestion-card');
      const head = element('div',null,'suggestion-head');
      const info = element('div');
      info.append(element('h3',s.title),element('p',s.platform+' · '+s.category));
      const statusText = {pending:'Aguardando aprovação',approved:'Aprovada',rejected:'Rejeitada'};
      head.append(info,element('span',statusText[s.status]||s.status,'suggestion-tag'));
      card.append(head);
      const preview = element('div',null,'suggestion-summary');
      const img = safeUrl(s.image_url);
      if (img) {
        const picture = element('img');
        picture.src=img;picture.alt='Imagem de referência do anúncio';picture.loading='lazy';
        picture.referrerPolicy='no-referrer';preview.append(picture);
      }
      const summary = element('div');
      if(s.reason) summary.append(element('p',s.reason));
      const price = s.reference_price === null ? 'Preço não informado' :
        new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(s.reference_price));
      const date = s.price_observed_at ? ' · verificado em '+new Date(s.price_observed_at).toLocaleDateString('pt-BR') : '';
      summary.append(element('p',price+date));
      const sourceUrl = safeUrl(s.source_url);
      if(sourceUrl) {
        const link=element('a','Abrir anúncio para conferir ↗');
        link.href=sourceUrl;link.target='_blank';link.rel='noopener noreferrer sponsored';
        link.referrerPolicy='no-referrer';summary.append(link);
      }
      if(s.discovery_source)summary.append(element('p','Fonte: '+s.discovery_source));
      preview.append(summary);card.append(preview);
      if(s.status === 'pending') {
        const fields=element('div',null,'suggestion-fields');
        const name=field(fields,'Título para publicação',s.title,{full:true,max:180});
        const description=field(fields,'Descrição',s.description,{full:true,max:1600,multiline:true});
        const category=categoryField(fields,s.category);
        const platform=field(fields,'Marketplace',s.platform,{max:100});
        const affiliate=field(fields,'Link de afiliado validado (HTTPS)',s.affiliate_url,{type:'url',max:2048,full:true});
        affiliate.placeholder='Cole o link gerado pela sua conta de afiliado';
        const liveWrapper=element('div',null,'full'),liveLabel=element('label',null,'check');
        const live=element('input');live.type='checkbox';
        liveLabel.append(live,element('span','Produto divulgado em live'));liveWrapper.append(liveLabel);fields.append(liveWrapper);
        card.append(fields);
        const warning=element('p','A imagem é apenas referência. A ISA não gera automaticamente links de comissão.','hint');
        card.append(warning);
        const actions=element('div',null,'suggestion-actions');
        const save=element('button','Salvar ajustes','outline');
        const approve=element('button','Aprovar e publicar');
        const reject=element('button','Rejeitar','reject');
        save.type=approve.type=reject.type='button';
        const values=()=>({
          title:name.value.trim(),description:description.value.trim(),
          category:category.value,platform:platform.value.trim(),
          affiliate_url:affiliate.value.trim()||null
        });
        save.addEventListener('click',async()=>{
          if(reviewing)return;
          reviewing=true;save.disabled=true;
          try{
            const v=values();
            if(v.title.length<2||v.platform.length<2)throw Error('Título e marketplace são obrigatórios.');
            if(v.affiliate_url&&!safeUrl(v.affiliate_url))throw Error('O link de afiliado precisa usar HTTPS.');
            const result=await http('/rest/v1/liberty_suggestions?id=eq.'+encodeURIComponent(s.id)+'&status=eq.pending',{
              method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=representation'},
              body:JSON.stringify({...v,updated_at:new Date().toISOString()})
            },true);
            if(!Array.isArray(result)||result.length!==1)throw Error('A sugestão não pôde ser atualizada.');
            await loadSuggestions();
            notice('Ajustes salvos. A sugestão continua pendente.');
          }catch(e){notice(e.message,true)}
          finally{reviewing=false;save.disabled=false}
        });
        approve.addEventListener('click',async()=>{
          if(reviewing)return;
          const v=values();
          if(v.title.length<2||v.platform.length<2||!safeUrl(v.affiliate_url)){
            notice('Informe título, marketplace e link de afiliado HTTPS antes de publicar.',true);return;
          }
          if(!window.confirm('CONFIRMAR PUBLICAÇÃO de "'+v.title+
            '"? Verifique o produto, o link de afiliado e a autorização comercial da imagem.'))return;
          reviewing=true;approve.disabled=true;
          try{
            const id=await http('/rest/v1/rpc/liberty_approve_suggestion',{
              method:'POST',headers:{'Content-Type':'application/json'},
              body:JSON.stringify({
                p_id:s.id,p_title:v.title,p_description:v.description,p_category:v.category,
                p_platform:v.platform,p_affiliate_url:v.affiliate_url,p_live_featured:live.checked
              })
            },true);
            if(typeof id!=='string'||!/^[0-9a-f-]{36}$/i.test(id))throw Error('A publicação não foi confirmada.');
            await Promise.all([loadSuggestions(),loadProducts()]);
            notice('Aprovado e publicado. Inclua uma foto autorizada na aba Produtos.');
          }catch(e){notice(e.message,true)}
          finally{reviewing=false;approve.disabled=false}
        });
        reject.addEventListener('click',async()=>{
          if(reviewing||!window.confirm('Rejeitar "'+s.title+'"? A decisão ficará registrada.'))return;
          reviewing=true;reject.disabled=true;
          try{
            const result=await http('/rest/v1/liberty_suggestions?id=eq.'+encodeURIComponent(s.id)+'&status=eq.pending',{
              method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=representation'},
              body:JSON.stringify({status:'rejected',reviewed_by:session.user.id,
                reviewed_at:new Date().toISOString(),updated_at:new Date().toISOString()})
            },true);
            if(!Array.isArray(result)||result.length!==1)throw Error('Rejeição não confirmada.');
            await loadSuggestions();notice('Sugestão rejeitada e registrada no histórico.');
          }catch(e){notice(e.message,true)}
          finally{reviewing=false;reject.disabled=false}
        });
        actions.append(save,approve,reject);card.append(actions);
      } else if(s.status==='approved'&&s.product_id) {
        card.append(element('p','Produto criado: '+s.product_id,'hint'));
      }
      list.append(card);
    }
  }
  $('tab-products').addEventListener('click',()=>switchTab('products'));
  $('tab-suggestions').addEventListener('click',async()=>{
    switchTab('suggestions');
    try{await loadSuggestions();notice('')}
    catch(e){notice('Falha ao carregar as sugestões: '+e.message,true)}
  });
  $('reload-suggestions').addEventListener('click',async()=>{
    try{await loadSuggestions();notice('Sugestões atualizadas.')}
    catch(e){notice('Falha ao atualizar: '+e.message,true)}
  });
  $('suggestion-status').addEventListener('change',renderSuggestions);

})();

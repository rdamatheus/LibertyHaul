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
      for (const [name, action, danger] of [['Editar',()=>editProduct(product),false],[product.published?'Ocultar':'Publicar',()=>togglePublished(product),false],['Excluir',()=>deleteProduct(product),true]]) {
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
})();

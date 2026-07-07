// shop-data.js — shared data & helpers
var products = [
  {id:0,cat:'furniture',name:'Oak Side Chair',desc:'Solid oak, hand-woven seat',price:420,seed:'chair',full:'Hand-carved solid oak frame with a traditional hand-woven papercord seat. Each chair takes three days to weave. Naturally durable and ages beautifully.',specs:'Solid European oak · Papercord seat · 46×43×82 cm · 5.2 kg'},
  {id:1,cat:'furniture',name:'Walnut Stool',desc:'Solid American walnut',price:180,seed:'stool',full:'Turned from a single block of American black walnut. Simple, sturdy, and surprisingly comfortable. Use as a seat, side table, or plant stand.',specs:'Solid black walnut · Oil finish · 35×35×45 cm · 3.8 kg'},
  {id:2,cat:'furniture',name:'Round Mirror',desc:'Oak frame, beveled edge',price:195,seed:'mirror',full:'Thick solid oak frame with a gently beveled mirror. Hand-finished with natural oil. Hung via a hidden brass bracket — appears to float on the wall.',specs:'European oak · Beveled glass · Ø 60 cm · 2.1 kg'},
  {id:3,cat:'furniture',name:'Modular Sofa',desc:'Beech frame, linen cover',price:2400,seed:'sofa',full:'FSC-certified beech frame with natural latex cushions. Removable linen cover. Designed for disassembly — every component can be replaced.',specs:'Beech frame · Latex & wool fill · 180×85×75 cm · 32 kg'},
  {id:4,cat:'lighting',name:'Brass Arc Lamp',desc:'Polished brass, linen shade',price:680,seed:'arc',full:'Solid brass arc with a hand-stitched linen shade. Adjustable height. The brass develops a warm patina over time — included in the design.',specs:'Solid brass · Linen shade · 180 cm reach · E27 socket'},
  {id:5,cat:'lighting',name:'Pendant Cone',desc:'Powder-coated aluminum',price:320,seed:'pendant',full:'Minimalist cone in powder-coated aluminum. Available in three colors. The internal baffle reduces glare while casting light downward.',specs:'Aluminum · Powder coat · Ø 28 cm · 200 cm cord'},
  {id:6,cat:'lighting',name:'Ceramic Table Lamp',desc:'Stoneware, pleated shade',price:260,seed:'lamp',full:'Hand-thrown stoneware base with a pleated cotton shade. Each lamp is slightly different — the irregular glaze is part of the character.',specs:'Stoneware · Cotton shade · 52 cm tall · E14 socket'},
  {id:7,cat:'lighting',name:'Globe Pendant',desc:'Hand-blown glass, brass',price:450,seed:'globe',full:'Mouth-blown glass globe with a solid brass cap. The glass is lightly tinted — warm and diffused light. Made by a family glassworks in Bohemia.',specs:'Hand-blown glass · Brass cap · Ø 30 cm · E27 socket'},
  {id:8,cat:'objects',name:'Stoneware Vase',desc:'Hand-thrown, matte glaze',price:145,seed:'vase',full:'Thrown on the wheel in small batches. Matte exterior, glazed interior so it can hold water. Each piece signed by the potter.',specs:'Stoneware · Matte glaze · 22×14 cm · Hand wash'},
  {id:9,cat:'objects',name:'Concrete Candle',desc:'Soy wax, essential oils',price:38,seed:'candle',full:'Poured into a hand-cast concrete vessel. Soy wax with essential oils — no synthetic fragrances. The vessel becomes a planter or pencil cup afterwards.',specs:'Soy wax · Essential oils · 60 hr burn · Concrete vessel'},
  {id:10,cat:'objects',name:'Riso Print No. 7',desc:'Two-color risograph, 50x70',price:75,seed:'print',full:'Hand-drawn illustration printed in two colors on 170gsm recycled stock. Each print is slightly different — that is the nature of risograph.',specs:'Risograph on recycled paper · 50×70 cm · Unframed'},
  {id:11,cat:'objects',name:'Storage Box',desc:'Oil-treated oak, brass hinges',price:165,seed:'box',full:'Finger-jointed oak box with solid brass hinges and a inset lid. Oil finish. Perfect for keepsakes, jewelry, or small treasures.',specs:'European oak · Brass hardware · 24×16×12 cm · 1.1 kg'}
];

/* ── Cart via window.name (works with file://) ── */
function getCart(){
  try {
    var raw = window.name;
    if(!raw || raw.indexOf('mc:') !== 0) return {};
    return JSON.parse(raw.substring(3)) || {};
  } catch(e){ return {}; }
}
function saveCart(c){
  try { window.name = 'mc:' + JSON.stringify(c); } catch(e){}
}
function clearCart(){
  try { window.name = ''; } catch(e){}
}
function cartCount(){
  var c = getCart();
  var total = 0;
  for(var k in c) if(c.hasOwnProperty(k)) total += c[k];
  return total;
}

function updateBadge(){
  var b = document.getElementById('cartBadge');
  if(!b) return;
  var n = cartCount();
  b.textContent = n;
  b.style.display = n ? 'inline-flex' : 'none';
}

/* ── Add to Cart (called from any page) ── */
function addToCart(id){
  var c = getCart();
  if(c[id]) c[id]++; else c[id] = 1;
  saveCart(c);
  updateBadge();
  showToast('Added to cart');
}

function showToast(msg){
  var t = document.getElementById('toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1a1816;color:#fff;padding:12px 24px;border-radius:8px;font-size:13px;z-index:999;opacity:0;transition:opacity .3s';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._hide);
  t._hide = setTimeout(function(){ t.style.opacity = '0'; }, 2000);
}

/* ── Render product grid ── */
function renderProductGrid(gridId, items){
  var el = document.getElementById(gridId);
  if(!el) return;
  el.innerHTML = items.map(function(p){
    return '<div class="prod-card">'+
      '<a href="product.html?id='+p.id+'"><div class="thumb"><img src="https://picsum.photos/seed/matter-'+p.seed+'/600/400" alt="" loading="lazy"></div></a>'+
      '<div class="body"><h4><a href="product.html?id='+p.id+'">'+p.name+'</a></h4>'+
      '<div class="meta">'+p.desc+'</div><div class="price">$'+p.price+'</div>'+
      '<button class="btn btn-sm atc" onclick="addToCart('+p.id+')">Add to Cart</button></div></div>';
  }).join('');
  /* stagger animation */
  requestAnimationFrame(function(){
    var cards = el.querySelectorAll('.prod-card');
    for(var i=0;i<cards.length;i++){
      (function(idx){
        setTimeout(function(){ cards[idx].classList.add('visible'); }, idx*60);
      })(i);
    }
  });
}

/* ── Render cart items ── */
function renderCartItems(){
  var cont = document.getElementById('cartContent');
  if(!cont) return;
  var cart = getCart();
  var isEmpty = true;
  for(var k in cart) if(cart.hasOwnProperty(k)){ isEmpty = false; break; }

  if(isEmpty){
    var emptyEl = document.getElementById('cartEmpty');
    if(emptyEl) emptyEl.style.display = '';
    cont.style.display = 'none';
    return;
  }
  var emptyEl = document.getElementById('cartEmpty');
  if(emptyEl) emptyEl.style.display = 'none';
  cont.style.display = '';

  var el = document.getElementById('cartItems');
  if(!el) return;
  var html = '';
  var idx = 0;
  for(var key in cart){
    if(!cart.hasOwnProperty(key)) continue;
    var id = Number(key);
    var p = null;
    for(var pi=0;pi<products.length;pi++){ if(products[pi].id === id){ p = products[pi]; break; } }
    if(!p) continue;
    var q = cart[key];
    html += '<div class="cart-item" style="transition-delay:'+(idx*0.06)+'s">'+
      '<a href="product.html?id='+id+'"><div class="ci-thumb"><img src="https://picsum.photos/seed/matter-'+p.seed+'/200/200" alt="" loading="lazy"></div></a>'+
      '<div class="ci-info"><a href="product.html?id='+id+'" style="color:inherit"><h4>'+p.name+'</h4></a><p>'+p.desc+'</p></div>'+
      '<div class="ci-qty"><button onclick="cartQty('+id+',-1)">&minus;</button><span>'+q+'</span><button onclick="cartQty('+id+',1)">+</button></div>'+
      '<div class="ci-price">$'+(p.price*q)+'</div>'+
      '<button class="ci-remove" onclick="cartRemove('+id+')">&times;</button></div>';
    idx++;
  }
  el.innerHTML = html;
  /* animate */
  requestAnimationFrame(function(){
    var items = el.querySelectorAll('.cart-item');
    for(var i=0;i<items.length;i++) items[i].classList.add('visible');
  });
  updateCartTotals();
}

/* ── Cart qty / remove ── */
function cartQty(id, d){
  var c = getCart();
  if(!c[id] && d>0) c[id] = 1;
  else if(c[id]){
    c[id] += d;
    if(c[id] <= 0) delete c[id];
  }
  saveCart(c);
  updateBadge();
  renderCartItems();
}

function cartRemove(id){
  var c = getCart();
  delete c[id];
  saveCart(c);
  updateBadge();
  renderCartItems();
}

function updateCartTotals(){
  var c = getCart();
  var sub = 0;
  for(var key in c){
    if(!c.hasOwnProperty(key)) continue;
    var id = Number(key);
    for(var pi=0;pi<products.length;pi++){
      if(products[pi].id === id){ sub += products[pi].price * c[key]; break; }
    }
  }
  var subEl = document.getElementById('cartSubtotal');
  var shipEl = document.getElementById('cartShipping');
  var totalEl = document.getElementById('cartTotal');
  if(subEl) subEl.textContent = '$'+sub;
  var ship = sub >= 200 ? 0 : 15;
  if(shipEl) shipEl.textContent = ship === 0 ? 'Free' : '$'+ship;
  if(totalEl) totalEl.textContent = '$'+(sub+ship);
}

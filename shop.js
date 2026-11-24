(() => {
 const key='yuph-soft-orbit-cart-v1',bag=$('bag'),body=$('bagBody');
 const products=new Map();
 looks.forEach(look=>look[4].forEach(([name,price])=>{if(!products.has(name))products.set(name,{name,price,image:photos[look[2][0]]})}));
 function read(){try{return Object.fromEntries(Object.entries(JSON.parse(localStorage.getItem(key))||{}).filter(([name,count])=>products.has(name)&&Number.isInteger(count)&&count>0&&count<=99))}catch{return {}}}
 let cart=read(),stage='cart',noticeTimer;
 const entries=()=>Object.entries(cart);
 const amount=()=>entries().reduce((total,[name,count])=>total+products.get(name).price*count,0);
 const money=n=>'¥'+n.toLocaleString('zh-CN');
 function badge(){$('bagCount').textContent=entries().reduce((n,[,q])=>n+q,0)}
 function save(){try{localStorage.setItem(key,JSON.stringify(cart))}catch{}badge()}
 function add(names){names.forEach(name=>cart[name]=Math.min(99,(cart[name]||0)+1));save();$('added').textContent='购物车已更新 · 共 '+$('bagCount').textContent+' 件';clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('added').textContent='',2300)}
 $('addLook').onclick=()=>add(looks[active][4].map(([name])=>name));
 $('prices').addEventListener('click',e=>{const btn=e.target.closest('[data-item]');if(btn)add([looks[active][4][Number(btn.dataset.item)][0]])});
 function displayCart(){stage='cart';$('bagTitle').textContent='购物车';if(!entries().length){body.innerHTML='<p>购物车里还没有单品。</p><button class="shopAction" data-act="browse">浏览造型</button>';return}
 body.innerHTML=entries().map(([name,q])=>{const {price,image}=products.get(name);return '<article class="cartItem" data-name="'+name+'"><img src="'+image+'" alt=""><div><strong>'+name+'</strong><small>单价 '+money(price)+'</small><div class="qty"><button data-act="minus" aria-label="减少'+name+'数量" '+(q===1?'disabled':'')+'>−</button>'+q+'<button data-act="plus" aria-label="增加'+name+'数量" '+(q>=99?'disabled':'')+'>＋</button></div></div><div>'+money(price*q)+'<br><button class="remove" data-act="remove">移除</button></div></article>'}).join('')+'<div class="row sumline"><strong>合计</strong><strong>'+money(amount())+'</strong></div><button class="shopAction" data-act="checkout">模拟结算</button><p class="notice">演示购物流程，不会扣款或发货。</p>'}
 function checkout(){stage='pay';$('bagTitle').textContent='模拟结算';body.innerHTML='<button class="back" data-act="back">← 返回购物车</button><div class="receipt">'+entries().map(([name,q])=>'<div class="row"><span>'+name+' × '+q+'</span><span>'+money(products.get(name).price*q)+'</span></div>').join('')+'</div><div class="row sumline"><strong>模拟应付金额</strong><strong>'+money(amount())+'</strong></div><p>选择模拟支付方式</p>'+['微信支付','支付宝'].map((m,i)=>'<label class="method"><input type="radio" name="method" value="'+m+'" '+(i===0?'checked':'')+'> '+m+'</label>').join('')+'<p class="notice">本次为模拟付款，不会唤起支付应用或扣款。</p><button class="shopAction" data-act="pay">确认模拟付款</button>'}
 body.addEventListener('click',e=>{const action=e.target.closest('[data-act]')?.dataset.act;if(!action)return;
 if(action==='browse'){bag.close();location.hash='collection';return}
 if(action==='back'){displayCart();return}
 if(action==='checkout'&&entries().length){checkout();return}
 if(action==='pay'&&stage==='pay'&&entries().length){const method=body.querySelector('input:checked').value,value=money(amount());stage='done';cart={};save();$('bagTitle').textContent='模拟付款完成';body.innerHTML='<div class="result"><strong>'+method+' · 模拟成功</strong><p>模拟支付金额　'+value+'<br>实际扣款　¥0</p></div><button class="shopAction" data-act="browse">继续浏览造型</button>';return}
 const name=e.target.closest('[data-name]')?.dataset.name;if(!cart[name])return;
 if(action==='remove')delete cart[name];if(action==='plus')cart[name]=Math.min(99,cart[name]+1);if(action==='minus')cart[name]=Math.max(1,cart[name]-1);save();displayCart()});
 $('openBag').onclick=()=>{displayCart();bag.showModal()};bag.querySelector('.x').onclick=()=>bag.close();
 window.addEventListener('storage',e=>{if(e.key===key||e.key===null){cart=read();badge();if(bag.open&&stage!=='done')displayCart()}});badge();
})();

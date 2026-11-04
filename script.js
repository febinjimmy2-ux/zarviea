// Zarviea website interactions
// Add a guardian-approved BUSINESS WhatsApp number below before enabling WhatsApp ordering.
// Use country code + number, digits only, e.g. 91XXXXXXXXXX. Do not publish a personal number.
const WA_NUMBER = "81368 72385";
const products = [
  {id:"signature", name:"The Signature Box", type:"Luxury", price:1499, tag:"CURATED LUXURY", image:"images/collection.png", desc:"A little bit of everything, beautifully gathered."},
  {id:"birthday", name:"Birthday Bliss", type:"Birthday", price:1299, tag:"CELEBRATE", image:"images/birthday.png", desc:"A joyful surprise for their special day."},
  {id:"wedding", name:"Forever & Always", type:"Wedding", price:1999, tag:"FOR TWO", image:"images/wedding.png", desc:"A thoughtful keepsake for a beautiful beginning."},
  {id:"anniversary", name:"Golden Moments", type:"Anniversary", price:1799, tag:"SPECIAL EDITION", image:"images/anniversary.png", desc:"A romantic collection for your favourite two."},
  {id:"little", name:"The Little Luxury", type:"Luxury", price:999, tag:"THOUGHTFUL", image:"images/collection.png", desc:"A small box with a lovely amount of meaning."},
  {id:"celebration", name:"The Celebration Edit", type:"Birthday", price:1599, tag:"BESTSELLER", image:"images/birthday.png", desc:"Make the moment feel extra special."}
];
const money = n => "₹" + Number(n).toLocaleString("en-IN");
function toggleMenu(){document.getElementById("nav")?.classList.toggle("open")}
function getCart(){try{return JSON.parse(localStorage.getItem("zarvieaCart")||"[]")}catch(e){return []}}
function saveCart(cart){localStorage.setItem("zarvieaCart",JSON.stringify(cart));updateCartCount()}
function addToCart(id){const cart=getCart();const found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({id,qty:1});saveCart(cart);alert("Added to your bag!")}
function updateCartCount(){const count=getCart().reduce((s,x)=>s+x.qty,0);const el=document.getElementById("cart-count");if(el)el.textContent=count}
function renderProducts(){
 const grid=document.getElementById("product-grid");if(!grid)return;
 const term=(document.getElementById("search")?.value||"").toLowerCase();const cat=document.getElementById("category")?.value||"all";
 const list=products.filter(p=>(cat==="all"||p.type===cat)&&(p.name+" "+p.type+" "+p.desc).toLowerCase().includes(term));
 grid.innerHTML=list.length?list.map(p=>`<article class="product-card"><a href="customize.html" class="product-photo"><img src="${p.image}" alt="${p.name}"><span>${p.tag}</span></a><div class="product-info"><div><p class="eyebrow">${p.type.toUpperCase()} HAMPER</p><h3>${p.name}</h3><p class="muted">${p.desc}</p></div><div class="product-buy"><strong>${money(p.price)}</strong><button onclick="addToCart('${p.id}')" aria-label="Add ${p.name} to bag">＋</button></div></div></article>`).join(""):`<p class="muted">No hampers found. Try another search.</p>`;
}
function renderCart(){
 const wrap=document.getElementById("cart-items");if(!wrap)return;const cart=getCart();
 if(!cart.length){wrap.innerHTML='<div class="empty-state"><h2>Your bag is waiting.</h2><p class="muted">Explore the collection and add something thoughtful.</p><a class="btn btn-gold" href="shop.html">Shop hampers</a></div>';document.getElementById("cart-total").textContent=money(0);return}
 wrap.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);if(!p)return "";return `<div class="cart-row"><img src="${p.image}" alt=""><div><strong>${p.name}</strong><p class="muted">${money(p.price)} each</p></div><div class="qty"><button onclick="changeQty('${p.id}',-1)">−</button>${item.qty}<button onclick="changeQty('${p.id}',1)">＋</button></div><strong>${money(p.price*item.qty)}</strong></div>`}).join("");
 document.getElementById("cart-total").textContent=money(cart.reduce((s,x)=>s+(products.find(p=>p.id===x.id)?.price||0)*x.qty,0));
}
function changeQty(id,delta){let cart=getCart();const item=cart.find(x=>x.id===id);if(item){item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id)}saveCart(cart);renderCart()}
function openWhatsApp(message){if(!WA_NUMBER){alert("WhatsApp ordering is not connected yet. Add an approved business WhatsApp number in script.js (WA_NUMBER) before publishing.");return}window.open("https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(message),"_blank","noopener")}
function checkoutCart(){
 const cart=getCart();
 const status=document.getElementById("checkout-status");
 if(!cart.length){if(status)status.textContent="Your bag is empty. Add a hamper before checkout.";return}
 const name=document.getElementById("order-name")?.value.trim()||"";
 const phone=document.getElementById("order-phone")?.value.trim()||"";
 const address=document.getElementById("order-address")?.value.trim()||"";
 const note=document.getElementById("order-note")?.value.trim()||"";
 if(!name||!phone||!address){if(status)status.textContent="Please enter your name, contact number and delivery address.";alert("Please complete your name, contact number and delivery address.");return}
 const lines=cart.map(x=>{const p=products.find(p=>p.id===x.id);return p?`${p.name} x ${x.qty} — ${money(p.price*x.qty)}`:""}).filter(Boolean);
 const total=cart.reduce((s,x)=>s+(products.find(p=>p.id===x.id)?.price||0)*x.qty,0);
 const message="NEW ZARVIEA ORDER REQUEST\\nCustomer: "+name+"\\nContact: "+phone+"\\nDelivery address: "+address+"\\n\\nItems:\\n"+lines.join("\\n")+"\\n\\nTotal: "+money(total)+"\\nOrder note: "+(note||"None")+"\\n\\nPlease confirm availability, delivery and final order details.";
 if(!WA_NUMBER){if(status)status.textContent="WhatsApp is not connected yet. The order is still in your bag. Ask the site owner to add an approved business WhatsApp number in script.js.";alert("WhatsApp ordering is not connected yet. Add an approved business WhatsApp number in script.js.");return}
 const url="https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(message);
 const opened=window.open(url,"_blank","noopener");
 if(status)status.textContent=opened?"WhatsApp opened with your order details. Tap Send in WhatsApp. Your order is not confirmed until Zarviea replies.":"Allow pop-ups for this site, then click Buy via WhatsApp again. Your bag is still saved.";
}
function updateEstimate(){const base=Number(document.getElementById("size")?.value||899);const checks=[...document.querySelectorAll('#custom-form input[type="checkbox"]:checked')];const extras=checks.reduce((s,x)=>s+Number(x.value),0);document.getElementById("extras-total").textContent=money(extras);document.getElementById("estimate").textContent=money(base+extras);document.getElementById("estimate-bottom").textContent=money(base+extras)}
function sendCustomOrder(e){e.preventDefault();const base=Number(document.getElementById("size").value);const checks=[...document.querySelectorAll('#custom-form input[type="checkbox"]:checked')];const extras=checks.reduce((s,x)=>s+Number(x.value),0);const items=checks.map(x=>x.dataset.name).join(", ")||"No extras selected";const msg=`Hello Zarviea! I'd like a custom hamper enquiry.\\nOccasion: ${document.getElementById("occasion").value}\\nSize: ${money(base)}\\nExtras: ${items}\\nEstimated total: ${money(base+extras)}\\nGift message: ${document.getElementById("gift-message").value}\\nName: ${document.getElementById("customer-name").value}\\nDelivery details: ${document.getElementById("delivery").value}`;openWhatsApp(msg)}
function submitReview(e){e.preventDefault();const review={name:document.getElementById("review-name").value.trim()||"Guest",topic:document.getElementById("review-topic").value,rating:Number(document.getElementById("review-rating").value),text:document.getElementById("review-text").value.trim(),date:new Date().toLocaleDateString()};const all=JSON.parse(localStorage.getItem("zarvieaReviews")||"[]");all.unshift(review);localStorage.setItem("zarvieaReviews",JSON.stringify(all));e.target.reset();renderReviews();alert("Thank you! Your feedback is saved in this browser preview.")}
function renderReviews(){const el=document.getElementById("review-list");if(!el)return;const all=JSON.parse(localStorage.getItem("zarvieaReviews")||"[]");el.innerHTML=all.slice(0,3).map(r=>`<div class="mini-review"><div class="stars">${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}</div><strong>${escapeHTML(r.name)}</strong><p>${escapeHTML(r.text)}</p><small>${escapeHTML(r.topic)} · ${escapeHTML(r.date)}</small></div>`).join("")}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function sendContact(e){e.preventDefault();const subject=encodeURIComponent("Zarviea website enquiry");const body=encodeURIComponent(`Name: ${document.getElementById("contact-name").value}\\nReply contact: ${document.getElementById("contact-method").value}\\n\\n${document.getElementById("contact-message").value}`);window.location.href=`mailto:?subject=${subject}&body=${body}`}
document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll("#year").forEach(x=>x.textContent=new Date().getFullYear());updateCartCount();renderProducts();renderCart();renderReviews();if(document.getElementById("custom-form"))updateEstimate()});

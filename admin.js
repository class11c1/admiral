import {
  db, ref, onValue, push, set, update, remove,
  auth, onAuthStateChanged, signInWithEmailAndPassword, signOut
} from "./firebase.js";

const $ = id => document.getElementById(id);
const flowersRef = ref(db, "flowers");

$("loginBtn").onclick = async () => {
  $("loginMsg").textContent = "";
  try {
    await signInWithEmailAndPassword(auth, $("email").value.trim(), $("password").value);
  } catch (e) {
    $("loginMsg").textContent = "Đăng nhập thất bại: " + e.message;
  }
};

$("logoutBtn").onclick = () => signOut(auth);

onAuthStateChanged(auth, user => {
  $("loginBox").classList.toggle("hidden", !!user);
  $("adminApp").classList.toggle("hidden", !user);
});

onValue(flowersRef, snapshot => {
  const data = snapshot.val() || {};
  const items = Object.entries(data)
    .map(([id, item]) => ({ id, ...item }))
    .sort((a,b) => (a.order ?? 9999) - (b.order ?? 9999));

  $("count").textContent = `${items.length} sản phẩm`;

  const list = $("adminList");
  list.innerHTML = "";

  for (const item of items) {
    const row = document.createElement("div");
    row.className = "admin-item";
    row.innerHTML = `
      <div class="thumb">${item.image ? `<img src="${escapeAttr(item.image)}" alt="">` : "🌸"}</div>
      <div class="item-main">
        <b>${escapeHtml(item.name || "Chưa đặt tên")}</b>
        <span>${formatPrice(item.price)} · ${escapeHtml(item.category || "Hoa")}</span>
        <small>${item.active === false ? "🔴 Đang ẩn" : "🟢 Đang hiển thị"}</small>
      </div>
      <div class="item-actions">
        <button data-edit="${item.id}">Sửa</button>
        <button class="danger" data-delete="${item.id}">Xóa</button>
      </div>
    `;
    list.appendChild(row);
  }

  list.querySelectorAll("[data-edit]").forEach(btn => {
    btn.onclick = () => {
      const item = items.find(x => x.id === btn.dataset.edit);
      if (!item) return;
      $("flowerId").value = item.id;
      $("name").value = item.name || "";
      $("price").value = item.price ?? "";
      $("category").value = item.category || "";
      $("order").value = item.order ?? 999;
      $("image").value = item.image || "";
      $("description").value = item.description || "";
      $("active").checked = item.active !== false;
      $("formTitle").textContent = "✏️ Sửa loại hoa";
      $("cancelBtn").classList.remove("hidden");
      window.scrollTo({top: 0, behavior: "smooth"});
    };
  });

  list.querySelectorAll("[data-delete]").forEach(btn => {
    btn.onclick = async () => {
      if (!confirm("Xóa sản phẩm này khỏi User Web?")) return;
      await remove(ref(db, `flowers/${btn.dataset.delete}`));
    };
  });
});

$("saveBtn").onclick = async () => {
  const name = $("name").value.trim();
  if (!name) return $("saveMsg").textContent = "Vui lòng nhập tên hoa.";

  const payload = {
    name,
    price: $("price").value === "" ? "" : Number($("price").value),
    category: $("category").value.trim() || "Hoa",
    order: Number($("order").value) || 999,
    image: $("image").value.trim(),
    description: $("description").value.trim(),
    active: $("active").checked,
    updatedAt: Date.now()
  };

  try {
    const id = $("flowerId").value;
    if (id) {
      await update(ref(db, `flowers/${id}`), payload);
      $("saveMsg").textContent = "Đã cập nhật sản phẩm.";
    } else {
      payload.createdAt = Date.now();
      const newRef = push(flowersRef);
      await set(newRef, payload);
      $("saveMsg").textContent = "Đã thêm sản phẩm mới.";
    }
    resetForm();
  } catch (e) {
    $("saveMsg").textContent = "Lỗi: " + e.message;
  }
};

$("cancelBtn").onclick = resetForm;

function resetForm() {
  $("flowerId").value = "";
  $("name").value = "";
  $("price").value = "";
  $("category").value = "";
  $("order").value = "999";
  $("image").value = "";
  $("description").value = "";
  $("active").checked = true;
  $("formTitle").textContent = "➕ Thêm loại hoa";
  $("cancelBtn").classList.add("hidden");
}

function formatPrice(v) {
  if (v === "" || v === null || v === undefined) return "Liên hệ";
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString("vi-VN") + " ₫" : String(v);
}
function escapeHtml(v) {
  return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function escapeAttr(v) { return escapeHtml(v); }
        

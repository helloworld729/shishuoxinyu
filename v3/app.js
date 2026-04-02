(function () {
  'use strict';

  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    spawnBubble(query);
    input.value = '';
    clearActiveTags();
  });

  // 物理弹球：碰壁反弹，永不消失
  function spawnBubble(text) {
    var bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    // 先隐形挂载，以便获取真实尺寸
    bubble.style.visibility = 'hidden';
    document.body.appendChild(bubble);

    var w = bubble.offsetWidth;
    var h = bubble.offsetHeight;

    // 随机初始位置（保证在视口内）
    var x = Math.random() * (window.innerWidth  - w);
    var y = Math.random() * (window.innerHeight - h);

    // 随机速度，范围 1.2 ~ 2.4 px/frame
    var speed = 1.2 + Math.random() * 1.2;
    var angle = Math.random() * Math.PI * 2;
    var vx = Math.cos(angle) * speed;
    var vy = Math.sin(angle) * speed;

    bubble.style.left = x + 'px';
    bubble.style.top  = y + 'px';
    bubble.style.visibility = '';

    function tick() {
      x += vx;
      y += vy;

      var vw = window.innerWidth;
      var vh = window.innerHeight;

      // 碰左右壁
      if (x <= 0) {
        x = 0;
        vx = Math.abs(vx);
      } else if (x + w >= vw) {
        x = vw - w;
        vx = -Math.abs(vx);
      }

      // 碰上下壁
      if (y <= 0) {
        y = 0;
        vy = Math.abs(vy);
      } else if (y + h >= vh) {
        y = vh - h;
        vy = -Math.abs(vy);
      }

      bubble.style.left = x + 'px';
      bubble.style.top  = y + 'px';

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  // 按 Escape 清空输入框
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      input.value = '';
      clearActiveTags();
    }
  });

  // 领域标签点击：填入搜索框并高亮选中
  function clearActiveTags() {
    document.querySelectorAll('.tag').forEach(function (t) {
      t.classList.remove('active');
    });
  }

  document.querySelectorAll('.tag').forEach(function (tag) {
    tag.addEventListener('click', function () {
      const isActive = tag.classList.contains('active');
      clearActiveTags();
      if (!isActive) {
        tag.classList.add('active');
        input.value = tag.dataset.tag + ': ';
      } else {
        input.value = '';
      }
      input.focus();
    });
  });

  // 手动输入时取消标签高亮
  input.addEventListener('input', function () {
    clearActiveTags();
  });
})();


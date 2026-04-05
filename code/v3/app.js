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

  // 物理弹球：碰壁反弹，悬停暂停，支持点赞与评论
  function spawnBubble(text) {
    // ── 构建泡泡 DOM 结构 ──────────────────────────
    var bubble = document.createElement('div');
    bubble.className = 'bubble';

    // 内容行
    var body = document.createElement('div');
    body.className = 'bubble__body';

    var textEl = document.createElement('span');
    textEl.className = 'bubble__text';
    textEl.textContent = text;

    // 操作栏
    var actions = document.createElement('div');
    actions.className = 'bubble__actions';

    var likeBtn = document.createElement('button');
    likeBtn.className = 'bubble__like';
    likeBtn.setAttribute('aria-label', '点赞');
    var likeCount = document.createElement('span');
    likeCount.className = 'bubble__like-count';
    likeCount.textContent = '0';
    likeBtn.innerHTML = '❤ ';
    likeBtn.appendChild(likeCount);

    var commentBtn = document.createElement('button');
    commentBtn.className = 'bubble__comment-btn';
    commentBtn.setAttribute('aria-label', '评论');
    commentBtn.textContent = '💬';

    actions.appendChild(likeBtn);
    actions.appendChild(commentBtn);
    body.appendChild(textEl);
    body.appendChild(actions);

    // 评论区
    var commentBox = document.createElement('div');
    commentBox.className = 'bubble__comment-box';
    commentBox.hidden = true;

    var commentList = document.createElement('ul');
    commentList.className = 'bubble__comment-list';

    var inputRow = document.createElement('div');
    inputRow.className = 'bubble__comment-input-row';

    var commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.className = 'bubble__comment-input';
    commentInput.placeholder = '说点什么……';
    commentInput.maxLength = 50;

    var sendBtn = document.createElement('button');
    sendBtn.type = 'button';
    sendBtn.className = 'bubble__comment-send';
    sendBtn.textContent = '↩';

    inputRow.appendChild(commentInput);
    inputRow.appendChild(sendBtn);
    commentBox.appendChild(commentList);
    commentBox.appendChild(inputRow);

    bubble.appendChild(body);
    bubble.appendChild(commentBox);

    // ── 挂载到 body，获取尺寸 ──────────────────────
    bubble.style.visibility = 'hidden';
    document.body.appendChild(bubble);

    var w = bubble.offsetWidth;
    var h = bubble.offsetHeight;

    // ── 随机初始位置 ───────────────────────────────
    var x = Math.random() * (window.innerWidth  - w);
    var y = Math.random() * (window.innerHeight - h);

    // ── 随机速度，范围 1.2 ~ 2.4 px/frame ─────────
    var speed = 1.2 + Math.random() * 1.2;
    var angle = Math.random() * Math.PI * 2;
    var vx = Math.cos(angle) * speed;
    var vy = Math.sin(angle) * speed;

    bubble.style.left = x + 'px';
    bubble.style.top  = y + 'px';
    bubble.style.visibility = '';

    // ── 暂停状态 ───────────────────────────────────
    var paused = false;
    var commentOpen = false;

    // ── 鼠标悬停：暂停运动 ─────────────────────────
    bubble.addEventListener('mouseenter', function () {
      paused = true;
      bubble.classList.add('bubble--hover');
      // 重新获取尺寸（评论区展开后可能变化）
      w = bubble.offsetWidth;
      h = bubble.offsetHeight;
    });

    bubble.addEventListener('mouseleave', function () {
      // 评论区展开时，鼠标离开也不恢复运动
      if (!commentOpen) {
        paused = false;
        bubble.classList.remove('bubble--hover');
      }
    });

    // ── 点赞 toggle ────────────────────────────────
    likeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var liked = bubble.dataset.liked === 'true';
      bubble.dataset.liked = String(!liked);
      var count = parseInt(likeCount.textContent, 10);
      likeCount.textContent = liked ? count - 1 : count + 1;
      likeBtn.classList.toggle('bubble__like--active', !liked);
    });

    // ── 评论区 展开/收起 ───────────────────────────
    commentBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      commentOpen = !commentOpen;
      commentBox.hidden = !commentOpen;
      bubble.classList.toggle('bubble--expanded', commentOpen);
      // 展开时更新尺寸
      w = bubble.offsetWidth;
      h = bubble.offsetHeight;
      if (commentOpen) {
        // 确保评论区不超出视口下边界
        if (y + h > window.innerHeight) {
          y = window.innerHeight - h - 4;
          bubble.style.top = y + 'px';
        }
        commentInput.focus();
      } else {
        paused = false;
        bubble.classList.remove('bubble--hover');
      }
    });

    // ── 提交评论 ───────────────────────────────────
    function submitComment() {
      var val = commentInput.value.trim();
      if (!val) return;
      var item = document.createElement('li');
      item.className = 'bubble__comment-item';
      item.textContent = val;
      commentList.appendChild(item);
      commentList.scrollTop = commentList.scrollHeight;
      commentInput.value = '';
      // 更新尺寸
      w = bubble.offsetWidth;
      h = bubble.offsetHeight;
    }

    sendBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      submitComment();
    });

    commentInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        submitComment();
      }
      // 阻止 Escape 冒泡到外层清空主输入框
      if (e.key === 'Escape') {
        e.stopPropagation();
      }
    });

    // 防止评论输入框内的 input 事件触发外层清空标签逻辑
    commentInput.addEventListener('input', function (e) {
      e.stopPropagation();
    });

    // ── 运动 tick ──────────────────────────────────
    function tick() {
      if (!paused) {
        x += vx;
        y += vy;

        var vw = window.innerWidth;
        var vh = window.innerHeight;

        if (x <= 0) {
          x = 0;
          vx = Math.abs(vx);
        } else if (x + w >= vw) {
          x = vw - w;
          vx = -Math.abs(vx);
        }

        if (y <= 0) {
          y = 0;
          vy = Math.abs(vy);
        } else if (y + h >= vh) {
          y = vh - h;
          vy = -Math.abs(vy);
        }

        bubble.style.left = x + 'px';
        bubble.style.top  = y + 'px';
      }

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


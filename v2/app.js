(function () {
  'use strict';

  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    // 使用默认搜索引擎（可根据需要替换为其他引擎）
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(query);
    window.open(url, '_blank', 'noopener,noreferrer');
  });

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


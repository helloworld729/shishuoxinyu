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
    }
  });
})();


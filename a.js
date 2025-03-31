// File: media/main.js
(function () {
    const vscode = acquireVsCodeApi();
    const input = document.getElementById('chat-input');
    const dropdown = document.getElementById('dropdown');
  
    const baseOptions = [
      '@File', '@Code', '@Git Diff', '@Current File', '@Terminal', '@Docs', '@Open',
      '@Web', '@Codebase', '@Folder', '@Search', '@Url', '@Clipboard', '@Tree',
      '@Problems', '@Debugger', '@Repository Map', '@Operating System'
    ];
  
    let filteredOptions = [];
    let activeIndex = -1;
    let inSubmenu = false;
    let submenuItems = [];
    let triggerWord = '';
  
    input.addEventListener('input', () => {
      const value = input.value;
      const atIndex = value.lastIndexOf('@');
      if (atIndex >= 0) {
        triggerWord = value.substring(atIndex);
        if (!inSubmenu) {
          filteredOptions = baseOptions.filter(opt => opt.toLowerCase().startsWith(triggerWord.toLowerCase()));
          showDropdown();
        }
      } else {
        dropdown.style.display = 'none';
      }
    });
  
    input.addEventListener('keydown', (e) => {
      if (dropdown.style.display === 'block') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeIndex = (activeIndex + 1) % filteredOptions.length;
          renderDropdown();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeIndex = (activeIndex - 1 + filteredOptions.length) % filteredOptions.length;
          renderDropdown();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (activeIndex >= 0) {
            const selected = filteredOptions[activeIndex];
            if (selected === '@File' && !inSubmenu) {
              vscode.postMessage({ command: 'getFiles' });
              inSubmenu = true;
              return;
            }
            insertSelectedText(selected);
          }
        } else if (e.key === 'Escape') {
          dropdown.style.display = 'none';
          activeIndex = -1;
          inSubmenu = false;
        }
      }
    });
  
    window.addEventListener('message', (event) => {
      const msg = event.data;
      if (msg.command === 'fileList') {
        submenuItems = msg.files.map(f => `@File:${f}`);
        filteredOptions = submenuItems;
        activeIndex = 0;
        renderDropdown();
        showDropdown();
      }
    });
  
    function insertSelectedText(selected) {
      const atIndex = input.value.lastIndexOf('@');
      input.value = input.value.substring(0, atIndex) + selected + ' ';
      dropdown.style.display = 'none';
      activeIndex = -1;
      inSubmenu = false;
    }
  
    function showDropdown() {
      dropdown.innerHTML = '';
      renderDropdown();
      dropdown.style.display = 'block';
      const rect = input.getBoundingClientRect();
      dropdown.style.left = rect.left + 'px';
      dropdown.style.top = rect.bottom + 'px';
    }
  
    function renderDropdown() {
      dropdown.innerHTML = '';
      filteredOptions.forEach((opt, i) => {
        const div = document.createElement('div');
        div.textContent = opt;
        div.className = 'dropdown-item' + (i === activeIndex ? ' active' : '');
        div.addEventListener('click', () => {
          if (opt === '@File' && !inSubmenu) {
            vscode.postMessage({ command: 'getFiles' });
            inSubmenu = true;
          } else {
            insertSelectedText(opt);
          }
        });
        dropdown.appendChild(div);
      });
    }
  })();
  ////



// File: media/main.js
(function () {
  const vscode = acquireVsCodeApi();
  const input = document.getElementById('chat-input');
  const dropdown = document.getElementById('dropdown');

  const baseOptions = [
    { label: 'Files', hint: 'Type to search', icon: 'folder' },
    { label: 'Codebase', hint: 'Automatically find relevant files', icon: 'sparkles' },
    { label: 'Prompt Files', hint: '.prompt files', icon: 'document' },
    { label: 'Code', hint: 'Type to search', icon: 'code' },
    { label: 'Docs', hint: 'Type to search docs', icon: 'book-open' },
    { label: 'Git Diff', hint: 'Reference the current git diff', icon: 'diff' },
    { label: 'Terminal', hint: 'Reference the last terminal command', icon: 'terminal' },
    { label: 'Problems', hint: 'Reference problems in the current file', icon: 'alert' },
    { label: 'Folder', hint: 'Type to search', icon: 'folder' },
    { label: 'Add more context providers', hint: '', icon: 'plus' }
  ];

  let filteredOptions = [];
  let activeIndex = -1;
  let inSubmenu = false;
  let submenuItems = [];
  let triggerWord = '';

  input.addEventListener('input', () => {
    const value = input.value;
    const atIndex = value.lastIndexOf('@');
    if (atIndex >= 0) {
      triggerWord = value.substring(atIndex);
      if (!inSubmenu) {
        filteredOptions = baseOptions.filter(opt => ('@' + opt.label.toLowerCase()).startsWith(triggerWord.toLowerCase()));
        showDropdown();
      }
    } else {
      dropdown.style.display = 'none';
    }
  });

  input.addEventListener('keydown', (e) => {
    if (dropdown.style.display === 'block') {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % filteredOptions.length;
        renderDropdown();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + filteredOptions.length) % filteredOptions.length;
        renderDropdown();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0) {
          const selected = filteredOptions[activeIndex];
          if (selected.label === 'Files' && !inSubmenu) {
            vscode.postMessage({ command: 'getFiles' });
            inSubmenu = true;
            return;
          }
          insertSelectedText('@' + selected.label);
        }
      } else if (e.key === 'Escape') {
        dropdown.style.display = 'none';
        activeIndex = -1;
        inSubmenu = false;
      }
    }
  });

  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (msg.command === 'fileList') {
      submenuItems = msg.files.map(f => ({ label: `File:${f}`, hint: '', icon: 'file' }));
      filteredOptions = submenuItems;
      activeIndex = 0;
      renderDropdown();
      showDropdown();
    }
  });

  function insertSelectedText(selected) {
    const atIndex = input.value.lastIndexOf('@');
    input.value = input.value.substring(0, atIndex) + selected + ' ';
    dropdown.style.display = 'none';
    activeIndex = -1;
    inSubmenu = false;
  }

  function showDropdown() {
    dropdown.innerHTML = '';
    renderDropdown();
    dropdown.style.display = 'block';
    const rect = input.getBoundingClientRect();
    dropdown.style.left = rect.left + 'px';
    dropdown.style.top = rect.bottom + 'px';
  }

  function renderDropdown() {
    dropdown.innerHTML = '';
    filteredOptions.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'dropdown-item' + (i === activeIndex ? ' selected' : '');
      btn.innerHTML = `
        <span class="item-content">
          <div class="item-left">
            <span class="item-icon">🔹</span>
            <span class="item-label">${opt.label}</span>
          </div>
          <span class="item-hint${opt.hint ? '' : ' hidden'}">
            ${opt.hint}
          </span>
        </span>
      `;
      btn.addEventListener('click', () => {
        if (opt.label === 'Files' && !inSubmenu) {
          vscode.postMessage({ command: 'getFiles' });
          inSubmenu = true;
        } else {
          insertSelectedText('@' + opt.label);
        }
      });
      dropdown.appendChild(btn);
    });
  }
})();

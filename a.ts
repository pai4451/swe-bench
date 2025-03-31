// File: extension.ts
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('chatPanel.start', () => {
      const panel = vscode.window.createWebviewPanel(
        'chatPanel',
        'Chat Panel',
        vscode.ViewColumn.One,
        { enableScripts: true, localResourceRoots: [vscode.Uri.file(context.extensionPath)] }
      );

      const scriptUri = panel.webview.asWebviewUri(
        vscode.Uri.file(path.join(context.extensionPath, 'media', 'main.js'))
      );

      panel.webview.html = getWebviewContent(scriptUri);

      panel.webview.onDidReceiveMessage(async (message) => {
        if (message.command === 'getFiles') {
          const workspaceFolders = vscode.workspace.workspaceFolders;
          if (!workspaceFolders) {
            panel.webview.postMessage({ command: 'fileList', files: [] });
            return;
          }
          const folder = workspaceFolders[0].uri.fsPath;
          const files = getAllFiles(folder).map(f => path.relative(folder, f));
          panel.webview.postMessage({ command: 'fileList', files });
        }
      });
    })
  );
}

function getAllFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

function getWebviewContent(scriptUri: vscode.Uri): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: sans-serif; padding: 1rem; }
    #chat-input { width: 100%; padding: 0.5rem; font-size: 16px; }
    #dropdown {
      position: absolute;
      background: white;
      border: 1px solid #ccc;
      max-height: 150px;
      overflow-y: auto;
      display: none;
      z-index: 999;
    }
    .dropdown-item {
      padding: 5px 10px;
      cursor: pointer;
    }
    .dropdown-item.active {
      background-color: #007acc;
      color: white;
    }
  </style>
</head>
<body>
  <input id="chat-input" type="text" placeholder="Type your message..." autocomplete="off" />
  <div id="dropdown"></div>
  <script src="${scriptUri}"></script>
</body>
</html>
`;
}

export function deactivate() {}

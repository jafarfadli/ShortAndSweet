const { app, BrowserWindow } = require('electron');
const path = require('path');

// 앱 창을 생성하는 함수
const createWindow = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 800,
    resizable: false,
    maximizable: false,
    webPreferences: {
      // preload 스크립트를 지정합니다. 렌더러 프로세스에서도 Node.js API를 사용할 수 있게 해줍니다.
      // preload: path.join(__dirname, 'preload.js') // 필요하다면 사용
    }
  });

  // 가장 중요한 부분! 기존에 만든 index.html 파일을 로드합니다.
  win.loadFile('index.html');

  // 개발자 도구를 열고 싶다면 아래 줄의 주석을 해제하세요.
  // win.webContents.openDevTools();
};

// Electron 앱이 준비되면 창을 생성합니다.
app.whenReady().then(() => {
  createWindow();

  // macOS에서 독 아이콘을 클릭했을 때 창을 다시 여는 로직
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 모든 창이 닫혔을 때 앱을 종료하는 로직 (macOS 제외)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
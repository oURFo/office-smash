# 上班打打打 ✳

繁體中文辦公室紓壓網頁遊戲。純 HTML / CSS / JavaScript，無須建置、無後端，可部署於 GitHub Pages，包括專案子路徑。

## 開始遊玩

執行 `npm run dev`，以瀏覽器開啟 http://127.0.0.1:5173 。需要 Python 3；也可使用任何靜態 HTTP 伺服器。不要直接以 file:// 開啟。

首頁點「不使用照片進入」，即可使用男性、中等稍胖、戴眼鏡的原創角色「文政」。或先命名並上傳 JPG、PNG、WEBP（最多 20 MB），自動去背並框選人物後進入。框內可拖移、右下角可縮放，框外拖曳可重畫；也可先選取整張圖片再縮放。

點擊人物或按空白鍵攻擊。初始開放巴掌、拖鞋，共 15 種道具。每次揮擊有 62% 機率掉落金幣，自動收集；點擊鎖定道具即可花費金幣解鎖並裝備。連擊窗口 900ms，連擊與高階道具提高掉幣量。右上角可開啟合成音效。金幣、解鎖、累積揮擊、最佳連擊存在 localStorage；照片不持久儲存，重新整理後需再次選取。

## 部署到 GitHub

1. 建立 GitHub repository，將此資料夾內容放到 repository 根目錄並推送至 `main`。
2. Repository → Settings → Pages → Build and deployment → Source 選擇 **GitHub Actions**。
3. Actions 執行 `Deploy GitHub Pages` 完成後，到 Pages 查看網址。若推送早於 Pages 設定，手動重新執行 workflow。

```sh
git init -b main
git add .
git commit -m "Build office smash game"
git remote add origin https://github.com/YOUR_ACCOUNT/office-smash.git
git push -u origin main
```

## 照片與模型

使用 Google MediaPipe Tasks Vision 0.10.21 與 Selfie Segmenter，遵循 [Image Segmenter 官方介面](https://developers.google.com/edge/mediapipe/solutions/vision/image_segmenter?tab=Web)。照片經縮圖後在本機 WebAssembly 執行人物分割，使用人物信心遮罩產生透明 PNG，再由玩家框選裁切。多人物照片可能保留多個人物，需手動縮小選區。髮絲及遮擋的辨識品質依照片而異。

首次使用需要存取 jsDelivr 與 Google 模型儲存服務；字體由 Google Fonts 提供。無法載入模型時會明確提示，允許重試或用原圖裁切繼續，並不會假裝去背完成。預設角色與遊戲不需要模型。正式離線部署可將模型、WASM、模組、字體改為自託管。模型相關授權請參閱 Google MediaPipe 專案及模型卡。

## 開發檢查

`npm run check` 檢查 JavaScript 語法。手動驗證：預設角色開始、15 種道具且初始兩種、連擊與掉幣、餘額不足不可解鎖、解鎖後刷新保留、音效切換、上傳去背與透明預覽、框選移動縮放、重新偵測、離線失敗提示、手機觸控版面。

`character.svg` 為本專案原創向量角色。遊戲不含暴力血腥效果。

## 1.1 打擊與恢復

- 金幣由人物位置噴出、旋轉落下並彈跳，再飛進錢包；收集完成才增加餘額並儲存。
- 拖鞋採用專屬 SVG 圖案，工具列與揮擊都能顯示，不依賴裝置 emoji 支援。
- 15 種道具有個別動作、打擊文字與碎片效果，角色會依打擊類型側甩、震動、壓扁、後退或彈起。
- 受傷程度從 0 到 100；18 / 42 / 72 分別進入疼痛、鼻青臉腫、暈頭轉向。每擊增加 7 + 道具強度 × 1.3。
- 最後受擊 3 秒後每秒恢復 8 點；滿傷約需停手 15.5 秒才能完全恢復。更換角色重設傷勢。
- 文政有三張專屬受傷表情；照片角色使用受擊動作、繃帶、眼淚及暈眩星星疊加，不修改照片的五官。
- `npm run check` 同時檢查三個模組的語法及傷勢升級、恢復、上限與時間一致性的測試。

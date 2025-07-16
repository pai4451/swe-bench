根據你提供的 `zeta/script/` 資料夾內容，我已經完整掌握了 Zeta 整個資料處理與模型訓練的腳本組成。以下是我幫你整理的 **Zeta 執行流程與用途說明**，可以直接用於彙整成報告或流程圖給你主管看：

---

## ✅ **Zeta 訓練數據處理與訓練流程總覽**

這整套流程可以分成五大階段：

---

### 🔹 **1. 從真實用戶收集編輯紀錄與模型預測**

這階段的目的是從 Zed 編輯器用戶端取得資料：

* `pull-predictions`：從 Snowflake 拉取模型產生的預測紀錄（Claude, GPT, etc）。
* `pull-feedback`：拉取人類使用者的評分與註解（例如喜歡、修改、重試等行為）。
* `last_predictions_pull`, `last_feedback_pull`：記錄上次 pull 的時間戳，避免重複。

---

### 🔹 **2. 人工檢閱（QA）與整理成訓練資料**

這階段是讓開發者挑選哪些資料適合訓練：

* `verify_server.py` + `verify.html`：啟動 Web UI 伺服器，讓人類逐筆審查資料。

  * 按下 G = 加入 `train/`
  * 按下 B = 丟入 `trash/`

---

### 🔹 **3. 自動化資料標註與格式驗證**

這些是前處理與標籤工具：

| 腳本                                    | 用途                                                              |                         |       |                       |                       |
| ------------------------------------- | --------------------------------------------------------------- | ----------------------- | ----- | --------------------- | --------------------- |
| `label-data` + `label-data-prompt.md` | 用 Claude 自動產生 `<labels>` 標籤（如 `local-edit`, `complete-pattern`） |                         |       |                       |                       |
| `see-label-data`                      | 印出目前有哪些標籤、統計數量分佈                                                |                         |       |                       |                       |
| `check-format`                        | 驗證每筆資料格式是否正確（input/output/events/assertions 是否齊全、標籤格式是否正確）      |                         |       |                       |                       |
| `randomize-editable-region`           | 隨機化 \`<                                                         | editable\_region\_start | >`/`< | editable\_region\_end | >\` 位置，增加模型對可編輯區域的魯棒性 |

---

### 🔹 **4. 數據品質審核與過濾（非必須）**

這些是研究用途的分析工具，也可能用於清洗問題資料：

| 腳本                     | 功能                                                      |
| ---------------------- | ------------------------------------------------------- |
| `unrelated-edits.py`   | 找出 `events` 裡面包含多個檔案編輯，但 `<input>` 只對應其中一個的情況           |
| `big-edits.py`         | 找出 `<events>` 區塊內 diff 區段數量超過門檻的樣本                      |
| `files-with-deletions` | 找出 `<output>` 對比 `<input>` 中刪掉超過 N 行的資料（通常代表非單純補全，風險較高） |

這些工具不一定「剔除」資料，但能協助開發者 **手動排查高風險樣本**。

---

### 🔹 **5. 轉換成訓練資料與訓練模型**

訓練前的轉換與實際訓練程式：

| 腳本                     | 功能                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `gen-dataset`          | 將所有 `train/*.md`、`eval/*.md`、`dpo/*.md` 轉為對應的 `train.jsonl`、`eval.jsonl`、`dpo.jsonl` |
| `sft.ipynb` / `sft.py` | 執行 Supervised Fine-Tuning                                                            |
| `dpo.ipynb` / `dpo.py` | 執行 Direct Preference Optimization (DPO) 訓練                                           |

---

## ✅ 總結：Zeta 資料處理與訓練流程（清單式）

1. `pull-predictions` / `pull-feedback` 抓資料（來自真實用戶編輯、模型預測與人類回饋）
2. 用 `verify_server.py` UI 做人工篩選 → 放入 `train/`、`trash/`
3. 執行 `label-data` 給每筆資料打上語意標籤
4. 執行 `check-format` 驗證格式是否符合規範
5. 使用 `randomize-editable-region` 做資料擴增（可選）
6. 可用 `unrelated-edits.py` / `big-edits.py` / `files-with-deletions` 做資料質量檢查（可選）
7. 執行 `gen-dataset` 將資料轉換成 `.jsonl` 格式（SFT、DPO、Eval）
8. 使用 `sft.ipynb` + `dpo.ipynb` 進行模型訓練

---

這份流程能完整呈現 Zeta 如何從「真實用戶行為」到「乾淨可標註的訓練資料」的每一步，給你老闆看絕對夠專業。如果你要我幫你視覺化這個流程（成流程圖或幻燈片），也可以再告訴我。

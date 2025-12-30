// 以直覺三數與問題生成易經卦象，並給出行動提示
const prompts = [
    "想改變工作方向，但不確定時機是否成熟。",
    "與夥伴合作的專案，如何在溝通上更順暢？",
    "考慮搬遷到新城市，想知道是否合適。",
    "面臨重要考試，需要專注與節奏的建議。",
    "感情關係進入瓶頸，如何找到新的平衡？",
    "計畫創業，想知道近期能量與風向。",
    "想學習新技能，如何安排最有利的步驟？",
    "要不要接受突如其來的邀約？",
    "家庭決策產生分歧，如何找到共識？",
    "想要放慢腳步休息，是否是合適的時點？"
];

// 64 卦的名稱、意義與簡短建議
const hexagrams = [
    { name: "乾為天", meaning: "純陽之勢，主創造與開端。", advice: "保持自信與紀律，凡事以長遠為考量，切勿躁進。" },
    { name: "坤為地", meaning: "純陰之柔，承載與包容。", advice: "放慢速度、穩健行事，成為支撐他人的力量。" },
    { name: "水雷屯", meaning: "初生未熟，困難重重。", advice: "多做準備，請教前輩，先解決基礎問題再求突破。" },
    { name: "山水蒙", meaning: "啟蒙之象，需開發潛能。", advice: "向專業求教，建立規律學習，避免閉門造車。" },
    { name: "水天需", meaning: "等待時機，蓄勢待發。", advice: "保留實力，觀察局勢；當機會來臨要果斷出手。" },
    { name: "天水訟", meaning: "爭執辯論，易生衝突。", advice: "先求理解再表態，用事實與耐心化解誤會。" },
    { name: "地水師", meaning: "統領眾人，需要秩序。", advice: "制定明確流程與規則，領導者要公正並重視團隊。" },
    { name: "水地比", meaning: "互助親密，與人結盟。", advice: "建立信任，明確分工，在互補中取得成功。" },
    { name: "風天小畜", meaning: "小有積蓄，成長漸進。", advice: "累積資源、磨練技能，小步快跑勝過一次到位。" },
    { name: "天澤履", meaning: "循規蹈矩，謹慎前行。", advice: "遵守規範、守住原則，行事必須留意界線。" },
    { name: "地天泰", meaning: "上下通氣，順遂安泰。", advice: "好運臨門，趁勢推進，但仍要保有謙遜。" },
    { name: "天地否", meaning: "閉塞不通，阻礙頻仍。", advice: "暫避鋒芒，整理策略，等待風向扭轉。" },
    { name: "天火同人", meaning: "同道相應，群策群力。", advice: "與志同道合者合作，公開透明能凝聚士氣。" },
    { name: "火天大有", meaning: "豐收之象，成就可期。", advice: "分享成果、回饋支持者，善用資源進行下一步。" },
    { name: "地山謙", meaning: "內實外虛，謙遜自守。", advice: "保持低調，專注打磨內功，勿貪圖表面聲望。" },
    { name: "雷地豫", meaning: "喜悅鼓舞，眾心可用。", advice: "善用士氣推動計畫，但不要忽略細節管理。" },
    { name: "澤雷隨", meaning: "順勢而為，隨機應變。", advice: "觀察趨勢，調整策略，靈活才能抓住機會。" },
    { name: "山風蠱", meaning: "積弊待除，需大掃除。", advice: "面對問題根源，勇於改革，先清理陳舊規則。" },
    { name: "地澤臨", meaning: "領導臨眾，開創新局。", advice: "以身作則、關懷部屬，逐步推動變革。" },
    { name: "風地觀", meaning: "觀察評估，謙和而行。", advice: "多聽多看，了解環境後再決策，避免武斷。" },
    { name: "火雷噬嗑", meaning: "以刑去邪，明辨是非。", advice: "訂定明確規範，果斷處理違規，維持公正。" },
    { name: "山火賁", meaning: "裝飾美化，外顯其質。", advice: "適度包裝與呈現，讓價值被看見，但勿華而不實。" },
    { name: "火地晉", meaning: "晉升向上，光明漸增。", advice: "持續精進，展現專業，同時維持正直。" },
    { name: "地火明夷", meaning: "光被遮蔽，暫時受挫。", advice: "保護自己，低調行事，等待重獲舞台。" },
    { name: "山地剝", meaning: "山體崩解，衰退之象。", advice: "及時止損、收縮戰線，留住核心資源。" },
    { name: "地雷復", meaning: "失而復得，轉折向好。", advice: "回顧初心，從小處重建信心，循序恢復。" },
    { name: "天雷無妄", meaning: "天真無妄，順乎自然。", advice: "保持正直與單純，勿強求，讓事情自然流動。" },
    { name: "山天大畜", meaning: "大有積蓄，力量待發。", advice: "持續累積，等待突破口，切記謹慎管理資源。" },
    { name: "山雷頤", meaning: "養生養德，涵養內在。", advice: "照顧身心，節制言行，以充盈內在能量。" },
    { name: "澤風大過", meaning: "樑木將折，負荷過重。", advice: "避免過度承擔，求助或分擔，先穩固基礎。" },
    { name: "坎為水", meaning: "多險之境，反覆艱難。", advice: "保持冷靜，小心試探，仰賴信任的夥伴。" },
    { name: "離為火", meaning: "附麗之光，亮麗而敏捷。", advice: "善用直覺與表達，讓創意照亮前路。" },
    { name: "澤山咸", meaning: "感應互動，情感流動。", advice: "真誠交流，重視感受，建立深度連結。" },
    { name: "雷風恒", meaning: "恆常不變，持續耕耘。", advice: "穩定節奏，重複正確的事，自然累積成果。" },
    { name: "天山遯", meaning: "隱退避難，養晦待時。", advice: "暫避鋒芒，保留實力，等待更好時機。" },
    { name: "雷天大壯", meaning: "強勢突破，氣勢如雷。", advice: "敢於進取，但需控制衝動，尊重規則。" },
    { name: "地風升", meaning: "循序上升，穩健成長。", advice: "一步一腳印，累積信任，讓成果自然展現。" },
    { name: "澤水困", meaning: "受困之象，阻塞難行。", advice: "保存實力，求助外援，等待突破口。" },
    { name: "水風井", meaning: "汲水之井，資源共享。", advice: "建設穩定的資源系統，長期維護，惠及眾人。" },
    { name: "澤火革", meaning: "革新變化，舊去新來。", advice: "推動改革，勇敢捨棄無效模式，迎接新局。" },
    { name: "火風鼎", meaning: "鼎鍋煮物，協作共融。", advice: "整合資源、匯聚人才，共煮一鍋好菜。" },
    { name: "震為雷", meaning: "雷動初驚，開局震撼。", advice: "主動出擊，帶來突破，但須善後收斂。" },
    { name: "艮為山", meaning: "止於當下，靜中有力。", advice: "適時止步，反省修正，讓決策更清明。" },
    { name: "風火家人", meaning: "家庭秩序，各安其位。", advice: "明確角色與責任，彼此扶持，家和萬事興。" },
    { name: "雷澤歸妹", meaning: "新結合，需辨正道。", advice: "慎選合作與承諾，確保價值觀一致。" },
    { name: "風澤中孚", meaning: "誠信之心，互相感應。", advice: "坦誠溝通，以真心換真心，建立信任基礎。" },
    { name: "雷火豐", meaning: "收穫豐盛，光明顯耀。", advice: "分享成果，同時防範自滿，未雨綢繆。" },
    { name: "火山旅", meaning: "行旅在外，變動不停。", advice: "保持彈性，注意安全，尊重當地規則。" },
    { name: "巽為風", meaning: "隨風而行，滲透入微。", advice: "用柔和影響力推動變化，多聽少說。" },
    { name: "兌為澤", meaning: "悅納之象，喜悅交流。", advice: "以愉悅心態交流，善用談判，創造雙贏。" },
    { name: "風水渙", meaning: "渙散分離，需要凝聚。", advice: "集中目標，召集夥伴，重新建立共同願景。" },
    { name: "水澤節", meaning: "節制有度，收放自如。", advice: "設定界限，管理資源，適度而止。" },
    { name: "風澤中孚（再省察）", meaning: "誠信之心，需要反覆驗證。", advice: "以真誠打動人心，重申承諾，守信可得支持。" },
    { name: "雷山小過", meaning: "小過無咎，細節要慎。", advice: "避免重大決策，先修補瑕疵，處理微小失誤。" },
    { name: "水火既濟", meaning: "陰陽調和，事事圓滿。", advice: "成果即將完成，保持警醒，善後收尾。" },
    { name: "火水未濟", meaning: "未竟之業，尚待完成。", advice: "最後關頭別鬆懈，補足缺口再行定案。" },
    { name: "坎為水（重）", meaning: "重重險阻，加倍小心。", advice: "逐步拆解困境，尋求支援，耐心等待轉機。" },
    { name: "離為火（重）", meaning: "光芒閃耀，需要節制。", advice: "保持清明，避免過度張揚，專注核心價值。" },
    { name: "天火同人（反覆）", meaning: "同道合作需再確認。", advice: "重新校準共識，確認目標一致後再前進。" },
    { name: "山澤損", meaning: "減少與節制，去蕪存菁。", advice: "刪減不必要的投入，聚焦關鍵優先事項。" },
    { name: "風山漸", meaning: "漸進之勢，如木生山。", advice: "耐心穩步推進，小成果累積成大成果。" },
    { name: "澤水困（解）", meaning: "受困將解，迎來破曉。", advice: "即將迎來轉折，保持信念，適時尋求外援。" },
    { name: "雷水解", meaning: "雷雨解旱，危機解除。", advice: "問題逐步化解，趁勢整理收尾，維持警覺。" },
    { name: "天水訟（慎）", meaning: "訟爭再起，需和解。", advice: "避免口角，尋求第三方調解，回到事實。" }
];

// 生成隨機提問靈感
function renderPrompt() {
    const promptDisplay = document.getElementById("prompt-display");
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    promptDisplay.textContent = prompt;
}

// 驗證並取得三個數字
function getNumbers() {
    const n1 = Number(document.getElementById("number-one").value);
    const n2 = Number(document.getElementById("number-two").value);
    const n3 = Number(document.getElementById("number-three").value);

    if ([n1, n2, n3].some((n) => Number.isNaN(n) || n < 1 || n > 9)) {
        return null;
    }

    return [n1, n2, n3];
}

// 依照數字導出卦象索引
function deriveHexagramIndex(numbers) {
    const weightSum = numbers[0] * 13 + numbers[1] * 7 + numbers[2] * 3;
    return weightSum % hexagrams.length;
}

// 呈現解卦結果
function renderResult(question, hexagram) {
    const container = document.getElementById("result");
    const markup = `
        <p class="question-label">問題／情境：${question}</p>
        <h3>卦象：${hexagram.name}</h3>
        <p>${hexagram.meaning}</p>
        <p><strong>建議：</strong>${hexagram.advice}</p>
    `;
    container.innerHTML = markup;
}

// 綁定事件
function setup() {
    const promptButton = document.getElementById("prompt-button");
    const form = document.getElementById("divination-form");

    promptButton.addEventListener("click", renderPrompt);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const question = document.getElementById("question").value.trim();
        const numbers = getNumbers();

        if (!question) {
            alert("請描述你的問題或情境。");
            return;
        }

        if (!numbers) {
            alert("請輸入 1 至 9 之間的三個數字。");
            return;
        }

        const index = deriveHexagramIndex(numbers);
        const hexagram = hexagrams[index];
        renderResult(question, hexagram);
    });

    form.addEventListener("reset", () => {
        document.getElementById("result").innerHTML = "";
    });
}

document.addEventListener("DOMContentLoaded", setup);

/* Local UI only. No network, game loop, player identity creation, or automatic initialization. */
window.ShiwakeCommon = (() => {
  "use strict";
  const languages = [
    ["ja", "日本語"], ["en", "English"], ["es", "Español"], ["pt-BR", "Português (Brasil)"],
    ["zh-Hans", "简体中文"], ["fr", "Français"], ["de", "Deutsch"], ["ko", "한국어"],
    ["ru", "Русский"], ["it", "Italiano"], ["zh-Hant", "繁體中文"], ["id", "Bahasa Indonesia"],
    ["tr", "Türkçe"], ["vi", "Tiếng Việt"], ["th", "ไทย"],
  ];
  const catalogs = {
    en: {
      description: "Sort 99 falling monkeys into matching areas. Correct +10, wrong −10, escaped −15.", best: "Personal best", name: "Player name (optional)", privacy: "Enter a name to publish your name and score in the ranking. You can play with this blank.", language: "Language", volume: "Volume", soundOn: "Sound: on", soundOff: "Sound: off", localNotice: "Your best and settings are saved in this browser. Another browser or website address has separate storage.", start: "Start game", rules: "How to play", share: "Share on X", ranking: "Ranking", preview: "Check the four colored areas", retire: "Retire", speed: "Speed up!", result: "This result", sortScore: "Sorting points", mistakes: "Wrong sorts", misses: "Escaped monkeys", total: "Total score", newBest: "New personal best!", submission: "Ranking submission", refresh: "Reload", retry: "Play again", home: "Home", close: "Close", popupBlocked: "X could not be opened", copy: "Copy text and URL", copied: "Copied", copyFailed: "Copy failed. Select and copy the text.", points: "{n} points", times: "{n}", retired: "Retired", completed: "Completed", noBest: "No record yet", nameLine: "Name: {name}", anonymous: "No name", storageFailed: "Not saved on this device. Your current input still works.", zone: "Area for {type}", sortMonkey: "Sort {type}", go: "Go!", scoreHud: "Score: {n}", remaining: "Left: {n}", retireNoSend: "Retired games are not submitted.", autoSend: "The completed score is sent once with the name entered at the start.", anonymousNoSend: "No name at the start: this play is not published.", sendPending: "Waiting to send", sending: "Sending…", sent: "Submission accepted", sendUncertain: "Delivery could not be confirmed. This result is kept; resending is disabled to avoid duplicates.", sendRejected: "Submission was not accepted. Your result is kept.", rankingLoading: "Loading ranking…", rankingFailed: "Could not load the ranking. Use Reload to try again.", rankingEmpty: "No records yet", rankingTop: "Best scores · up to 30 entries", gameScreen: "Game", field: "Sorting field",
      rulesText: "Drag each falling monkey into the colored area with the same emoji.\nThe whole colored quarter is a target, not just the small icon.\nAreas are shuffled each game. Check them during the countdown.\nCorrect +10, wrong −10, escaped below the screen −15.\nThe game ends after all 99 monkeys. Speed becomes 1.3× with 40 left.\nThe countdown shows the areas only; monkeys appear after it ends.",
    },
    ja: {
      description: "99匹の猿を同じ絵文字のエリアへ仕分けよう。正解+10、ミス−10、逃し−15。", best: "ベストスコア", name: "プレイヤー名（任意）", privacy: "名前を入力すると、名前と記録がランキングに公開されます。空欄でも遊べます。", language: "言語", volume: "音量", soundOn: "音：オン", soundOff: "音：オフ", localNotice: "自己ベストと設定はこのブラウザ内に保存されます。別のブラウザや公開元URLには自動で引き継がれません。", start: "ゲーム開始", rules: "遊び方", share: "Xでシェア", ranking: "ランキング", preview: "4つの色つきエリアを確認してください", retire: "リタイア", speed: "スピードアップ！", result: "今回の結果", sortScore: "仕分けスコア", mistakes: "仕分けミス", misses: "仕分け逃し", total: "総合スコア", newBest: "ベスト更新！", submission: "ランキング送信", refresh: "再読込", retry: "もう一度遊ぶ", home: "ホームへ", close: "閉じる", popupBlocked: "Xを開けませんでした", copy: "本文とURLをコピー", copied: "コピーしました", copyFailed: "コピーできませんでした。本文を選択してコピーしてください。", points: "{n}点", times: "{n}回", retired: "リタイア", completed: "完了", noBest: "まだありません", nameLine: "名前：{name}", anonymous: "名前なし", storageFailed: "端末に保存できませんでした。今回の入力では遊べます。", zone: "{type}の受付エリア", sortMonkey: "{type}を仕分ける", go: "開始", scoreHud: "スコア：{n}", remaining: "残り：{n}", retireNoSend: "リタイア時はランキングへ送信しません。", autoSend: "正常終了した記録を、開始時の名前で一度だけ送信します。", anonymousNoSend: "開始時に名前がないため、今回の記録は公開しません。", sendPending: "送信待ち", sending: "送信中…", sent: "送信が受理されました", sendUncertain: "送信結果を確認できませんでした。結果は保持しています。二重登録を避けるため再送しません。", sendRejected: "送信が受理されませんでした。今回の結果は保持しています。", rankingLoading: "ランキングを読み込み中…", rankingFailed: "ランキングを取得できませんでした。「再読込」で再試行できます。", rankingEmpty: "まだ記録はありません", rankingTop: "最高スコア・最大30件", gameScreen: "ゲーム画面", field: "仕分けフィールド",
      rulesText: "流れる猿をドラッグし、同じ絵文字の色つきエリアへ入れます。\n小さなアイコンだけでなく、画面を4分割した色つきエリア全体が受付です。\n猿の場所は毎回変わります。カウントダウン中に確認してください。\n正解+10点、ミス−10点、画面下へ逃すと−15点です。\n99匹をすべて処理すると終了。残り40匹から速さが1.3倍になります。\nカウントダウン中はエリアだけを表示し、終了後に猿が流れます。",
    },
    es: {
      description: "Clasifica 99 monos en sus zonas. Acierto +10, error −10, mono escapado −15.", best: "Mejor puntuación", name: "Nombre (opcional)", privacy: "Si escribes un nombre, tu nombre y puntuación se publicarán en la clasificación. Puedes jugar sin nombre.", language: "Idioma", volume: "Volumen", soundOn: "Sonido: activado", soundOff: "Sonido: desactivado", localNotice: "Tu récord y ajustes se guardan en este navegador. Otro navegador o dirección web tiene datos distintos.", start: "Empezar", rules: "Cómo jugar", share: "Compartir en X", ranking: "Clasificación", preview: "Mira las cuatro zonas de colores", retire: "Abandonar", speed: "¡Más rápido!", result: "Este resultado", sortScore: "Puntos por aciertos", mistakes: "Errores", misses: "Monos escapados", total: "Puntuación total", newBest: "¡Nuevo récord personal!", submission: "Envío a la clasificación", refresh: "Recargar", retry: "Volver a jugar", home: "Inicio", close: "Cerrar", popupBlocked: "No se pudo abrir X", copy: "Copiar texto y enlace", copied: "Copiado", copyFailed: "No se pudo copiar. Selecciona y copia el texto.", points: "{n} puntos", times: "{n}", retired: "Abandonado", completed: "Completado", noBest: "Sin récord", nameLine: "Nombre: {name}", anonymous: "Sin nombre", storageFailed: "No se guardó en este dispositivo. Puedes usar el nombre actual.", zone: "Zona de {type}", sortMonkey: "Clasificar {type}", go: "¡Ya!", scoreHud: "Puntos: {n}", remaining: "Quedan: {n}", retireNoSend: "Las partidas abandonadas no se envían.", autoSend: "La puntuación final se envía una vez con el nombre del inicio.", anonymousNoSend: "Sin nombre al inicio: esta partida no se publica.", sendPending: "Envío pendiente", sending: "Enviando…", sent: "Envío aceptado", sendUncertain: "No se confirmó la entrega. El resultado se conserva; no se reenvía para evitar duplicados.", sendRejected: "Envío rechazado. Tu resultado se conserva.", rankingLoading: "Cargando clasificación…", rankingFailed: "No se pudo cargar. Pulsa Recargar para reintentar.", rankingEmpty: "Aún no hay registros", rankingTop: "Mejores puntuaciones · hasta 30 entradas", gameScreen: "Juego", field: "Zona de clasificación",
      rulesText: "Arrastra cada mono a la zona del mismo emoji.\nTodo el cuarto de color es válido, no solo el icono.\nLas zonas cambian en cada partida. Míralas en la cuenta atrás.\nAcierto +10, error −10, mono que sale por abajo −15.\nTermina al procesar los 99 monos. Con 40 restantes, la velocidad es 1,3×.\nLa cuenta atrás muestra solo las zonas; los monos aparecen después.",
    },
    "pt-BR": {
      description: "Separe 99 macacos nas áreas certas. Acerto +10, erro −10, fuga −15.", best: "Recorde pessoal", name: "Nome (opcional)", privacy: "Ao informar um nome, seu nome e pontuação serão publicados no ranking. Você pode jogar sem nome.", language: "Idioma", volume: "Volume", soundOn: "Som: ligado", soundOff: "Som: desligado", localNotice: "Seu recorde e ajustes ficam neste navegador. Outro navegador ou endereço tem armazenamento separado.", start: "Começar", rules: "Como jogar", share: "Compartilhar no X", ranking: "Ranking", preview: "Confira as quatro áreas coloridas", retire: "Desistir", speed: "Mais rápido!", result: "Resultado desta partida", sortScore: "Pontos por acertos", mistakes: "Erros", misses: "Macacos que escaparam", total: "Pontuação total", newBest: "Novo recorde pessoal!", submission: "Envio ao ranking", refresh: "Recarregar", retry: "Jogar novamente", home: "Início", close: "Fechar", popupBlocked: "Não foi possível abrir o X", copy: "Copiar texto e link", copied: "Copiado", copyFailed: "Falha ao copiar. Selecione e copie o texto.", points: "{n} pontos", times: "{n}", retired: "Desistência", completed: "Concluído", noBest: "Sem recorde", nameLine: "Nome: {name}", anonymous: "Sem nome", storageFailed: "Não foi salvo neste aparelho. A entrada atual ainda funciona.", zone: "Área de {type}", sortMonkey: "Separar {type}", go: "Já!", scoreHud: "Pontos: {n}", remaining: "Restam: {n}", retireNoSend: "Partidas abandonadas não são enviadas.", autoSend: "O resultado final é enviado uma vez com o nome informado no início.", anonymousNoSend: "Sem nome no início: esta partida não será publicada.", sendPending: "Aguardando envio", sending: "Enviando…", sent: "Envio aceito", sendUncertain: "Não foi possível confirmar a entrega. O resultado foi mantido; não há reenvio para evitar duplicatas.", sendRejected: "Envio não aceito. Seu resultado foi mantido.", rankingLoading: "Carregando ranking…", rankingFailed: "Falha ao carregar. Use Recarregar para tentar de novo.", rankingEmpty: "Ainda sem registros", rankingTop: "Melhores pontuações · até 30 entradas", gameScreen: "Jogo", field: "Área de separação",
      rulesText: "Arraste cada macaco até a área com o mesmo emoji.\nTodo o quarto colorido vale, não apenas o ícone.\nAs áreas mudam a cada partida. Confira na contagem regressiva.\nAcerto +10, erro −10, fuga pela parte de baixo −15.\nTermina após os 99 macacos. Com 40 restantes, a velocidade passa a 1,3×.\nNa contagem aparecem só as áreas; os macacos vêm depois.",
    },
    "zh-Hans": {
      description: "将99只猴子拖到相同表情的区域。正确+10，错误−10，漏掉−15。", best: "个人最佳", name: "玩家名（选填）", privacy: "输入名字后，名字和成绩会在排行榜公开。不填也能玩。", language: "语言", volume: "音量", soundOn: "声音：开", soundOff: "声音：关", localNotice: "最佳成绩和设置保存在当前浏览器中。其他浏览器或网址的存储相互独立。", start: "开始游戏", rules: "玩法", share: "分享到X", ranking: "排行榜", preview: "请确认四个彩色区域", retire: "退出本局", speed: "加速！", result: "本次结果", sortScore: "正确分类得分", mistakes: "分类错误", misses: "漏掉的猴子", total: "总分", newBest: "刷新个人最佳！", submission: "提交排行榜", refresh: "重新加载", retry: "再玩一次", home: "主页", close: "关闭", popupBlocked: "无法打开X", copy: "复制文字和链接", copied: "已复制", copyFailed: "复制失败，请选中文字后复制。", points: "{n}分", times: "{n}次", retired: "已退出", completed: "已完成", noBest: "暂无记录", nameLine: "名字：{name}", anonymous: "未填写", storageFailed: "无法保存到设备，当前输入仍可使用。", zone: "{type}的区域", sortMonkey: "分类{type}", go: "开始", scoreHud: "得分：{n}", remaining: "剩余：{n}", retireNoSend: "退出的对局不会提交。", autoSend: "正常完成后，以开始时的名字提交一次成绩。", anonymousNoSend: "开始时没有名字，本局成绩不公开。", sendPending: "等待提交", sending: "提交中…", sent: "提交已受理", sendUncertain: "无法确认提交结果。成绩已保留，为避免重复，不会重新提交。", sendRejected: "提交未被受理，本次成绩已保留。", rankingLoading: "正在加载排行榜…", rankingFailed: "加载失败，请点击“重新加载”重试。", rankingEmpty: "暂无记录", rankingTop: "最高分 · 最多30条", gameScreen: "游戏画面", field: "分类区域",
      rulesText: "拖动下落的猴子，放到相同表情的彩色区域。\n整个彩色四分之一区域都能接收，不只是图标。\n每局区域都会改变，请在倒计时中确认。\n正确+10分，错误−10分，从底部逃走−15分。\n处理完99只猴子后结束。剩余40只时速度变为1.3倍。\n倒计时只显示区域，结束后猴子才会出现。",
    },
    fr: {
      description: "Triez 99 singes dans les bonnes zones. Réussite +10, erreur −10, fuite −15.", best: "Record personnel", name: "Nom (facultatif)", privacy: "Si vous saisissez un nom, votre nom et votre score seront publiés au classement. Vous pouvez jouer sans nom.", language: "Langue", volume: "Volume", soundOn: "Son : activé", soundOff: "Son : désactivé", localNotice: "Votre record et vos réglages sont enregistrés dans ce navigateur. Une autre adresse ou un autre navigateur utilise un stockage séparé.", start: "Jouer", rules: "Comment jouer", share: "Partager sur X", ranking: "Classement", preview: "Repérez les quatre zones colorées", retire: "Abandonner", speed: "Accélération !", result: "Résultat de cette partie", sortScore: "Points de tri", mistakes: "Erreurs", misses: "Singes échappés", total: "Score total", newBest: "Nouveau record personnel !", submission: "Envoi au classement", refresh: "Recharger", retry: "Rejouer", home: "Accueil", close: "Fermer", popupBlocked: "Impossible d’ouvrir X", copy: "Copier le texte et le lien", copied: "Copié", copyFailed: "Échec de la copie. Sélectionnez et copiez le texte.", points: "{n} points", times: "{n}", retired: "Abandon", completed: "Terminé", noBest: "Aucun record", nameLine: "Nom : {name}", anonymous: "Sans nom", storageFailed: "Enregistrement impossible sur cet appareil. La saisie actuelle reste utilisable.", zone: "Zone de {type}", sortMonkey: "Trier {type}", go: "Partez !", scoreHud: "Score : {n}", remaining: "Restants : {n}", retireNoSend: "Les parties abandonnées ne sont pas envoyées.", autoSend: "Le score final est envoyé une fois avec le nom saisi au départ.", anonymousNoSend: "Sans nom au départ : cette partie ne sera pas publiée.", sendPending: "Envoi en attente", sending: "Envoi…", sent: "Envoi accepté", sendUncertain: "Livraison non confirmée. Le résultat est conservé ; aucun renvoi pour éviter les doublons.", sendRejected: "Envoi refusé. Le résultat est conservé.", rankingLoading: "Chargement du classement…", rankingFailed: "Chargement impossible. Utilisez Recharger pour réessayer.", rankingEmpty: "Aucun résultat", rankingTop: "Meilleurs scores · 30 entrées maximum", gameScreen: "Jeu", field: "Zone de tri",
      rulesText: "Glissez chaque singe vers la zone du même emoji.\nTout le quart coloré est une cible, pas seulement l’icône.\nLes zones changent à chaque partie. Repérez-les pendant le décompte.\nRéussite +10, erreur −10, fuite par le bas −15.\nLa partie finit après 99 singes. À 40 restants, la vitesse passe à 1,3×.\nLe décompte montre uniquement les zones ; les singes arrivent ensuite.",
    },
    de: {
      description: "Sortiere 99 Affen in passende Bereiche. Richtig +10, falsch −10, entkommen −15.", best: "Persönlicher Rekord", name: "Name (freiwillig)", privacy: "Wenn du einen Namen eingibst, werden Name und Punktzahl in der Rangliste veröffentlicht. Du kannst ohne Namen spielen.", language: "Sprache", volume: "Lautstärke", soundOn: "Ton: an", soundOff: "Ton: aus", localNotice: "Rekord und Einstellungen werden in diesem Browser gespeichert. Andere Browser oder Webadressen haben getrennte Speicher.", start: "Spiel starten", rules: "Spielanleitung", share: "Auf X teilen", ranking: "Rangliste", preview: "Präge dir die vier farbigen Bereiche ein", retire: "Aufgeben", speed: "Schneller!", result: "Dieses Ergebnis", sortScore: "Sortierpunkte", mistakes: "Fehlsortierungen", misses: "Entkommene Affen", total: "Gesamtpunkte", newBest: "Neuer persönlicher Rekord!", submission: "Ranglisteneintrag", refresh: "Neu laden", retry: "Erneut spielen", home: "Startseite", close: "Schließen", popupBlocked: "X konnte nicht geöffnet werden", copy: "Text und Link kopieren", copied: "Kopiert", copyFailed: "Kopieren fehlgeschlagen. Text markieren und kopieren.", points: "{n} Punkte", times: "{n}", retired: "Aufgegeben", completed: "Abgeschlossen", noBest: "Noch kein Rekord", nameLine: "Name: {name}", anonymous: "Ohne Namen", storageFailed: "Nicht auf diesem Gerät gespeichert. Die aktuelle Eingabe bleibt nutzbar.", zone: "Bereich für {type}", sortMonkey: "{type} sortieren", go: "Los!", scoreHud: "Punkte: {n}", remaining: "Übrig: {n}", retireNoSend: "Abgebrochene Spiele werden nicht übertragen.", autoSend: "Das Endergebnis wird einmal mit dem Namen vom Spielstart übertragen.", anonymousNoSend: "Ohne Namen gestartet: Dieses Spiel wird nicht veröffentlicht.", sendPending: "Übertragung ausstehend", sending: "Wird gesendet…", sent: "Übertragung angenommen", sendUncertain: "Übertragung nicht bestätigt. Das Ergebnis bleibt erhalten; kein erneutes Senden, um Duplikate zu vermeiden.", sendRejected: "Übertragung abgelehnt. Das Ergebnis bleibt erhalten.", rankingLoading: "Rangliste wird geladen…", rankingFailed: "Laden fehlgeschlagen. Mit Neu laden erneut versuchen.", rankingEmpty: "Noch keine Einträge", rankingTop: "Beste Punktzahlen · bis zu 30 Einträge", gameScreen: "Spiel", field: "Sortierfeld",
      rulesText: "Ziehe jeden fallenden Affen zum Bereich mit demselben Emoji.\nDas ganze farbige Viertel zählt, nicht nur das Symbol.\nDie Bereiche wechseln jede Runde. Prüfe sie beim Countdown.\nRichtig +10, falsch −10, unten entkommen −15.\nNach 99 Affen endet das Spiel. Bei 40 übrigen steigt das Tempo auf 1,3×.\nDer Countdown zeigt nur die Bereiche; die Affen folgen danach.",
    },
    ko: {
      description: "원숭이 99마리를 같은 이모지 영역으로 분류하세요. 정답 +10, 오답 −10, 놓침 −15.", best: "개인 최고 기록", name: "이름(선택)", privacy: "이름을 입력하면 이름과 점수가 순위표에 공개됩니다. 비워 두어도 플레이할 수 있습니다.", language: "언어", volume: "음량", soundOn: "소리: 켜짐", soundOff: "소리: 꺼짐", localNotice: "최고 기록과 설정은 이 브라우저에 저장됩니다. 다른 브라우저나 웹 주소의 저장 공간과는 별개입니다.", start: "게임 시작", rules: "게임 방법", share: "X에 공유", ranking: "순위표", preview: "네 개의 색상 영역을 확인하세요", retire: "포기", speed: "속도 상승!", result: "이번 결과", sortScore: "분류 점수", mistakes: "분류 실수", misses: "놓친 원숭이", total: "총점", newBest: "개인 최고 기록!", submission: "순위표 전송", refresh: "새로고침", retry: "다시 하기", home: "홈", close: "닫기", popupBlocked: "X를 열 수 없습니다", copy: "내용과 링크 복사", copied: "복사했습니다", copyFailed: "복사하지 못했습니다. 내용을 선택해 복사하세요.", points: "{n}점", times: "{n}회", retired: "포기함", completed: "완료", noBest: "기록 없음", nameLine: "이름: {name}", anonymous: "이름 없음", storageFailed: "기기에 저장하지 못했습니다. 현재 입력은 사용할 수 있습니다.", zone: "{type} 영역", sortMonkey: "{type} 분류", go: "시작", scoreHud: "점수: {n}", remaining: "남음: {n}", retireNoSend: "포기한 게임은 전송하지 않습니다.", autoSend: "완료 점수를 시작할 때 입력한 이름으로 한 번 전송합니다.", anonymousNoSend: "시작할 때 이름이 없어 이번 기록은 공개하지 않습니다.", sendPending: "전송 대기", sending: "전송 중…", sent: "전송이 접수되었습니다", sendUncertain: "전송 결과를 확인하지 못했습니다. 결과는 유지되며 중복 방지를 위해 재전송하지 않습니다.", sendRejected: "전송이 접수되지 않았습니다. 결과는 유지됩니다.", rankingLoading: "순위표 불러오는 중…", rankingFailed: "불러오지 못했습니다. 새로고침으로 다시 시도하세요.", rankingEmpty: "아직 기록이 없습니다", rankingTop: "최고 점수 · 최대 30개", gameScreen: "게임 화면", field: "분류 영역",
      rulesText: "떨어지는 원숭이를 같은 이모지가 있는 색상 영역으로 드래그하세요.\n작은 아이콘뿐 아니라 해당 색상의 사분면 전체가 목표입니다.\n영역은 매 게임 바뀝니다. 카운트다운 중 확인하세요.\n정답 +10점, 오답 −10점, 아래로 놓치면 −15점입니다.\n99마리를 모두 처리하면 종료됩니다. 40마리가 남으면 속도가 1.3배가 됩니다.\n카운트다운에는 영역만 표시되고, 끝나면 원숭이가 나타납니다.",
    },
    ru: {
      description: "Разложите 99 обезьян по зонам. Верно +10, ошибка −10, упущена −15.", best: "Личный рекорд", name: "Имя (необязательно)", privacy: "Если указать имя, имя и результат будут опубликованы в рейтинге. Можно играть без имени.", language: "Язык", volume: "Громкость", soundOn: "Звук: вкл.", soundOff: "Звук: выкл.", localNotice: "Рекорд и настройки хранятся в этом браузере. У другого браузера или веб-адреса отдельное хранилище.", start: "Начать игру", rules: "Как играть", share: "Поделиться в X", ranking: "Рейтинг", preview: "Запомните четыре цветные зоны", retire: "Сдаться", speed: "Ускорение!", result: "Этот результат", sortScore: "Очки за сортировку", mistakes: "Ошибки", misses: "Упущено", total: "Общий счёт", newBest: "Новый личный рекорд!", submission: "Отправка в рейтинг", refresh: "Обновить", retry: "Играть снова", home: "Главная", close: "Закрыть", popupBlocked: "Не удалось открыть X", copy: "Копировать текст и ссылку", copied: "Скопировано", copyFailed: "Не удалось скопировать. Выделите и скопируйте текст.", points: "Очки: {n}", times: "{n}", retired: "Игра прервана", completed: "Завершено", noBest: "Рекорда пока нет", nameLine: "Имя: {name}", anonymous: "Без имени", storageFailed: "Не сохранено на устройстве. Текущий ввод можно использовать.", zone: "Зона для {type}", sortMonkey: "Отсортировать {type}", go: "Старт!", scoreHud: "Счёт: {n}", remaining: "Осталось: {n}", retireNoSend: "Прерванные игры не отправляются.", autoSend: "Итог отправляется один раз с именем, указанным в начале.", anonymousNoSend: "Игра начата без имени: результат не публикуется.", sendPending: "Ожидание отправки", sending: "Отправка…", sent: "Отправка принята", sendUncertain: "Доставка не подтверждена. Результат сохранён; повторная отправка отключена во избежание дублей.", sendRejected: "Отправка отклонена. Результат сохранён.", rankingLoading: "Загрузка рейтинга…", rankingFailed: "Не удалось загрузить. Нажмите «Обновить» для повтора.", rankingEmpty: "Записей пока нет", rankingTop: "Лучшие результаты · до 30 записей", gameScreen: "Игра", field: "Поле сортировки",
      rulesText: "Перетащите обезьяну в зону с таким же эмодзи.\nПодходит вся цветная четверть поля, а не только значок.\nЗоны меняются каждую игру. Изучите их во время отсчёта.\nВерно +10, ошибка −10, уход за нижний край −15.\nИгра заканчивается после 99 обезьян. При 40 оставшихся скорость становится 1,3×.\nВо время отсчёта видны только зоны; обезьяны появляются позже.",
    },
    it: {
      description: "Smista 99 scimmie nelle zone giuste. Corretto +10, errore −10, fuga −15.", best: "Record personale", name: "Nome (facoltativo)", privacy: "Inserendo un nome, nome e punteggio saranno pubblicati in classifica. Puoi giocare senza nome.", language: "Lingua", volume: "Volume", soundOn: "Audio: attivo", soundOff: "Audio: disattivo", localNotice: "Record e impostazioni sono salvati in questo browser. Un altro browser o indirizzo web ha dati separati.", start: "Inizia", rules: "Come giocare", share: "Condividi su X", ranking: "Classifica", preview: "Controlla le quattro zone colorate", retire: "Abbandona", speed: "Più veloce!", result: "Questo risultato", sortScore: "Punti di smistamento", mistakes: "Errori", misses: "Scimmie fuggite", total: "Punteggio totale", newBest: "Nuovo record personale!", submission: "Invio alla classifica", refresh: "Ricarica", retry: "Gioca ancora", home: "Pagina iniziale", close: "Chiudi", popupBlocked: "Impossibile aprire X", copy: "Copia testo e link", copied: "Copiato", copyFailed: "Copia non riuscita. Seleziona e copia il testo.", points: "{n} punti", times: "{n}", retired: "Abbandonato", completed: "Completato", noBest: "Nessun record", nameLine: "Nome: {name}", anonymous: "Senza nome", storageFailed: "Non salvato sul dispositivo. Puoi usare il nome attuale.", zone: "Zona di {type}", sortMonkey: "Smista {type}", go: "Via!", scoreHud: "Punti: {n}", remaining: "Restano: {n}", retireNoSend: "Le partite abbandonate non vengono inviate.", autoSend: "Il punteggio finale viene inviato una volta con il nome iniziale.", anonymousNoSend: "Nessun nome all’inizio: questa partita non sarà pubblicata.", sendPending: "Invio in attesa", sending: "Invio…", sent: "Invio accettato", sendUncertain: "Consegna non confermata. Risultato conservato; nessun reinvio per evitare duplicati.", sendRejected: "Invio rifiutato. Risultato conservato.", rankingLoading: "Caricamento classifica…", rankingFailed: "Caricamento non riuscito. Usa Ricarica per riprovare.", rankingEmpty: "Ancora nessun risultato", rankingTop: "Migliori punteggi · fino a 30 voci", gameScreen: "Gioco", field: "Campo di smistamento",
      rulesText: "Trascina ogni scimmia nella zona con la stessa emoji.\nVale tutto il quarto colorato, non soltanto l’icona.\nLe zone cambiano a ogni partita. Controllale durante il conto alla rovescia.\nCorretto +10, errore −10, fuga dal bordo inferiore −15.\nLa partita termina dopo 99 scimmie. Con 40 rimaste, la velocità sale a 1,3×.\nIl conto alla rovescia mostra solo le zone; le scimmie arrivano dopo.",
    },
    "zh-Hant": {
      description: "將99隻猴子拖到相同表情的區域。正確+10，錯誤−10，漏掉−15。", best: "個人最佳", name: "玩家名稱（選填）", privacy: "輸入名稱後，名稱和成績會在排行榜公開。不填也能玩。", language: "語言", volume: "音量", soundOn: "聲音：開", soundOff: "聲音：關", localNotice: "最佳成績和設定儲存在目前瀏覽器。其他瀏覽器或網址的儲存空間彼此獨立。", start: "開始遊戲", rules: "玩法", share: "分享到X", ranking: "排行榜", preview: "請確認四個彩色區域", retire: "退出本局", speed: "加速！", result: "本次結果", sortScore: "正確分類得分", mistakes: "分類錯誤", misses: "漏掉的猴子", total: "總分", newBest: "刷新個人最佳！", submission: "提交排行榜", refresh: "重新載入", retry: "再玩一次", home: "首頁", close: "關閉", popupBlocked: "無法開啟X", copy: "複製文字和連結", copied: "已複製", copyFailed: "複製失敗，請選取文字後複製。", points: "{n}分", times: "{n}次", retired: "已退出", completed: "已完成", noBest: "尚無紀錄", nameLine: "名稱：{name}", anonymous: "未填寫", storageFailed: "無法儲存到裝置，目前的輸入仍可使用。", zone: "{type}的區域", sortMonkey: "分類{type}", go: "開始", scoreHud: "得分：{n}", remaining: "剩餘：{n}", retireNoSend: "退出的對局不會提交。", autoSend: "正常完成後，以開始時的名稱提交一次成績。", anonymousNoSend: "開始時沒有名稱，本局成績不公開。", sendPending: "等待提交", sending: "提交中…", sent: "提交已受理", sendUncertain: "無法確認提交結果。成績已保留，為避免重複，不會再次提交。", sendRejected: "提交未被受理，本次成績已保留。", rankingLoading: "正在載入排行榜…", rankingFailed: "載入失敗，請按「重新載入」重試。", rankingEmpty: "尚無紀錄", rankingTop: "最高分 · 最多30筆", gameScreen: "遊戲畫面", field: "分類區域",
      rulesText: "拖動下落的猴子，放到相同表情的彩色區域。\n整個彩色四分之一區域都能接收，不只是圖示。\n每局區域都會改變，請在倒數時確認。\n正確+10分，錯誤−10分，從底部逃走−15分。\n處理完99隻猴子後結束。剩餘40隻時速度變為1.3倍。\n倒數時只顯示區域，結束後猴子才會出現。",
    },
    id: {
      description: "Pilah 99 monyet ke area yang cocok. Benar +10, salah −10, lolos −15.", best: "Rekor pribadi", name: "Nama (opsional)", privacy: "Jika nama diisi, nama dan skor akan dipublikasikan di peringkat. Anda boleh bermain tanpa nama.", language: "Bahasa", volume: "Volume", soundOn: "Suara: aktif", soundOff: "Suara: nonaktif", localNotice: "Rekor dan pengaturan disimpan di browser ini. Browser atau alamat situs lain memiliki penyimpanan terpisah.", start: "Mulai bermain", rules: "Cara bermain", share: "Bagikan di X", ranking: "Peringkat", preview: "Periksa empat area berwarna", retire: "Menyerah", speed: "Makin cepat!", result: "Hasil kali ini", sortScore: "Poin pemilahan", mistakes: "Salah pilah", misses: "Monyet lolos", total: "Skor total", newBest: "Rekor pribadi baru!", submission: "Pengiriman peringkat", refresh: "Muat ulang", retry: "Main lagi", home: "Beranda", close: "Tutup", popupBlocked: "X tidak dapat dibuka", copy: "Salin teks dan tautan", copied: "Disalin", copyFailed: "Gagal menyalin. Pilih dan salin teksnya.", points: "{n} poin", times: "{n}", retired: "Menyerah", completed: "Selesai", noBest: "Belum ada rekor", nameLine: "Nama: {name}", anonymous: "Tanpa nama", storageFailed: "Tidak tersimpan di perangkat. Isian saat ini tetap dapat digunakan.", zone: "Area {type}", sortMonkey: "Pilah {type}", go: "Mulai!", scoreHud: "Skor: {n}", remaining: "Sisa: {n}", retireNoSend: "Permainan yang ditinggalkan tidak dikirim.", autoSend: "Skor akhir dikirim sekali dengan nama saat mulai.", anonymousNoSend: "Tanpa nama saat mulai: permainan ini tidak dipublikasikan.", sendPending: "Menunggu pengiriman", sending: "Mengirim…", sent: "Pengiriman diterima", sendUncertain: "Pengiriman belum terkonfirmasi. Hasil disimpan; pengiriman ulang dinonaktifkan agar tidak ganda.", sendRejected: "Pengiriman ditolak. Hasil tetap disimpan.", rankingLoading: "Memuat peringkat…", rankingFailed: "Gagal memuat. Gunakan Muat ulang untuk mencoba lagi.", rankingEmpty: "Belum ada catatan", rankingTop: "Skor terbaik · hingga 30 entri", gameScreen: "Permainan", field: "Area pemilahan",
      rulesText: "Seret setiap monyet ke area dengan emoji yang sama.\nSeluruh seperempat area berwarna dapat menerima, bukan hanya ikonnya.\nArea berubah tiap permainan. Periksa saat hitung mundur.\nBenar +10, salah −10, lolos lewat bawah −15.\nSelesai setelah 99 monyet. Saat tersisa 40, kecepatan menjadi 1,3×.\nHitung mundur hanya menampilkan area; monyet muncul setelahnya.",
    },
    tr: {
      description: "99 maymunu eşleşen alanlara ayır. Doğru +10, yanlış −10, kaçan −15.", best: "Kişisel rekor", name: "Ad (isteğe bağlı)", privacy: "Ad girerseniz adınız ve puanınız sıralamada yayımlanır. Adsız da oynayabilirsiniz.", language: "Dil", volume: "Ses düzeyi", soundOn: "Ses: açık", soundOff: "Ses: kapalı", localNotice: "Rekor ve ayarlar bu tarayıcıda saklanır. Başka tarayıcı veya web adresinin depolama alanı ayrıdır.", start: "Oyunu başlat", rules: "Nasıl oynanır", share: "X’te paylaş", ranking: "Sıralama", preview: "Dört renkli alanı kontrol edin", retire: "Vazgeç", speed: "Hızlanıyor!", result: "Bu oyunun sonucu", sortScore: "Ayırma puanı", mistakes: "Yanlış ayırma", misses: "Kaçan maymunlar", total: "Toplam puan", newBest: "Yeni kişisel rekor!", submission: "Sıralamaya gönderim", refresh: "Yenile", retry: "Tekrar oyna", home: "Ana sayfa", close: "Kapat", popupBlocked: "X açılamadı", copy: "Metni ve bağlantıyı kopyala", copied: "Kopyalandı", copyFailed: "Kopyalanamadı. Metni seçip kopyalayın.", points: "{n} puan", times: "{n}", retired: "Vazgeçildi", completed: "Tamamlandı", noBest: "Henüz rekor yok", nameLine: "Ad: {name}", anonymous: "Adsız", storageFailed: "Cihaza kaydedilemedi. Mevcut giriş kullanılabilir.", zone: "{type} alanı", sortMonkey: "{type} ayır", go: "Başla!", scoreHud: "Puan: {n}", remaining: "Kalan: {n}", retireNoSend: "Vazgeçilen oyunlar gönderilmez.", autoSend: "Sonuç başlangıçtaki adla bir kez gönderilir.", anonymousNoSend: "Başlangıçta ad yoktu: bu oyun yayımlanmaz.", sendPending: "Gönderim bekleniyor", sending: "Gönderiliyor…", sent: "Gönderim kabul edildi", sendUncertain: "Teslim doğrulanamadı. Sonuç korunuyor; yinelenmeyi önlemek için tekrar gönderilmiyor.", sendRejected: "Gönderim kabul edilmedi. Sonuç korunuyor.", rankingLoading: "Sıralama yükleniyor…", rankingFailed: "Yüklenemedi. Yenile ile tekrar deneyin.", rankingEmpty: "Henüz kayıt yok", rankingTop: "En iyi puanlar · en fazla 30 kayıt", gameScreen: "Oyun", field: "Ayırma alanı",
      rulesText: "Her maymunu aynı emojinin olduğu renkli alana sürükleyin.\nYalnızca simge değil, renkli çeyreğin tamamı hedeftir.\nAlanlar her oyunda değişir. Geri sayımda kontrol edin.\nDoğru +10, yanlış −10, alttan kaçan −15.\n99 maymundan sonra oyun biter. 40 kalınca hız 1,3× olur.\nGeri sayımda yalnız alanlar görünür; maymunlar sonra gelir.",
    },
    vi: {
      description: "Phân 99 chú khỉ vào đúng vùng. Đúng +10, sai −10, bỏ lỡ −15.", best: "Kỷ lục cá nhân", name: "Tên (không bắt buộc)", privacy: "Nếu nhập tên, tên và điểm của bạn sẽ được công khai trên bảng xếp hạng. Bạn có thể chơi không cần tên.", language: "Ngôn ngữ", volume: "Âm lượng", soundOn: "Âm thanh: bật", soundOff: "Âm thanh: tắt", localNotice: "Kỷ lục và cài đặt được lưu trong trình duyệt này. Trình duyệt hoặc địa chỉ web khác có bộ nhớ riêng.", start: "Bắt đầu", rules: "Cách chơi", share: "Chia sẻ lên X", ranking: "Bảng xếp hạng", preview: "Xem bốn vùng màu", retire: "Bỏ cuộc", speed: "Tăng tốc!", result: "Kết quả lần này", sortScore: "Điểm phân loại", mistakes: "Phân loại sai", misses: "Khỉ bị bỏ lỡ", total: "Tổng điểm", newBest: "Kỷ lục cá nhân mới!", submission: "Gửi bảng xếp hạng", refresh: "Tải lại", retry: "Chơi lại", home: "Trang chủ", close: "Đóng", popupBlocked: "Không mở được X", copy: "Sao chép nội dung và liên kết", copied: "Đã sao chép", copyFailed: "Sao chép thất bại. Hãy chọn và sao chép nội dung.", points: "{n} điểm", times: "{n} lần", retired: "Đã bỏ cuộc", completed: "Hoàn thành", noBest: "Chưa có kỷ lục", nameLine: "Tên: {name}", anonymous: "Không có tên", storageFailed: "Không lưu được trên thiết bị. Vẫn dùng được nội dung vừa nhập.", zone: "Vùng của {type}", sortMonkey: "Phân loại {type}", go: "Bắt đầu!", scoreHud: "Điểm: {n}", remaining: "Còn: {n}", retireNoSend: "Ván bỏ cuộc không được gửi.", autoSend: "Điểm hoàn thành được gửi một lần với tên lúc bắt đầu.", anonymousNoSend: "Không có tên khi bắt đầu: ván này không được công khai.", sendPending: "Chờ gửi", sending: "Đang gửi…", sent: "Đã chấp nhận gửi", sendUncertain: "Chưa xác nhận được việc gửi. Kết quả được giữ lại; không gửi lại để tránh trùng lặp.", sendRejected: "Không chấp nhận gửi. Kết quả được giữ lại.", rankingLoading: "Đang tải bảng xếp hạng…", rankingFailed: "Không tải được. Nhấn Tải lại để thử lại.", rankingEmpty: "Chưa có kết quả", rankingTop: "Điểm cao nhất · tối đa 30 mục", gameScreen: "Trò chơi", field: "Vùng phân loại",
      rulesText: "Kéo từng chú khỉ vào vùng có cùng biểu tượng.\nCả một phần tư vùng màu đều nhận khỉ, không chỉ biểu tượng nhỏ.\nVị trí đổi mỗi ván. Hãy xem trong lúc đếm ngược.\nĐúng +10, sai −10, lọt xuống dưới −15.\nKết thúc sau 99 chú khỉ. Khi còn 40, tốc độ tăng lên 1,3 lần.\nLúc đếm ngược chỉ hiện các vùng; khỉ xuất hiện sau đó.",
    },
    th: {
      description: "แยกลิง 99 ตัวลงพื้นที่ที่ตรงกัน ถูก +10 ผิด −10 หลุด −15", best: "สถิติส่วนตัว", name: "ชื่อผู้เล่น (ไม่บังคับ)", privacy: "หากใส่ชื่อ ชื่อและคะแนนจะเผยแพร่ในอันดับ คุณเล่นโดยไม่ใส่ชื่อได้", language: "ภาษา", volume: "ระดับเสียง", soundOn: "เสียง: เปิด", soundOff: "เสียง: ปิด", localNotice: "สถิติและการตั้งค่าบันทึกในเบราว์เซอร์นี้ เบราว์เซอร์หรือที่อยู่เว็บอื่นมีที่เก็บแยกกัน", start: "เริ่มเกม", rules: "วิธีเล่น", share: "แชร์บน X", ranking: "อันดับ", preview: "ดูพื้นที่สีทั้งสี่ส่วน", retire: "ยอมแพ้", speed: "เร็วขึ้น!", result: "ผลครั้งนี้", sortScore: "คะแนนแยกถูก", mistakes: "แยกผิด", misses: "ลิงที่หลุด", total: "คะแนนรวม", newBest: "สถิติส่วนตัวใหม่!", submission: "ส่งคะแนนเข้าอันดับ", refresh: "โหลดใหม่", retry: "เล่นอีกครั้ง", home: "หน้าหลัก", close: "ปิด", popupBlocked: "เปิด X ไม่ได้", copy: "คัดลอกข้อความและลิงก์", copied: "คัดลอกแล้ว", copyFailed: "คัดลอกไม่สำเร็จ โปรดเลือกและคัดลอกข้อความ", points: "{n} คะแนน", times: "{n} ครั้ง", retired: "ยอมแพ้แล้ว", completed: "จบเกม", noBest: "ยังไม่มีสถิติ", nameLine: "ชื่อ: {name}", anonymous: "ไม่มีชื่อ", storageFailed: "บันทึกลงอุปกรณ์ไม่ได้ แต่ยังใช้ข้อมูลที่กรอกอยู่ได้", zone: "พื้นที่ของ {type}", sortMonkey: "แยก {type}", go: "เริ่ม!", scoreHud: "คะแนน: {n}", remaining: "เหลือ: {n}", retireNoSend: "เกมที่ยอมแพ้จะไม่ส่งคะแนน", autoSend: "คะแนนเมื่อเล่นจบจะส่งครั้งเดียวด้วยชื่อที่กรอกตอนเริ่ม", anonymousNoSend: "ไม่ได้ใส่ชื่อตอนเริ่ม จึงไม่เผยแพร่ผลเกมนี้", sendPending: "รอส่ง", sending: "กำลังส่ง…", sent: "รับข้อมูลแล้ว", sendUncertain: "ยืนยันการส่งไม่ได้ เก็บผลไว้แล้วและจะไม่ส่งซ้ำเพื่อป้องกันข้อมูลซ้ำ", sendRejected: "ไม่รับข้อมูลที่ส่ง ผลของคุณยังคงอยู่", rankingLoading: "กำลังโหลดอันดับ…", rankingFailed: "โหลดไม่ได้ กดโหลดใหม่เพื่อลองอีกครั้ง", rankingEmpty: "ยังไม่มีข้อมูล", rankingTop: "คะแนนสูงสุด · ไม่เกิน 30 รายการ", gameScreen: "หน้าจอเกม", field: "พื้นที่แยก",
      rulesText: "ลากลิงที่ตกลงมาไปยังพื้นที่สีที่มีอีโมจิตรงกัน\nพื้นที่สีหนึ่งในสี่ส่วนทั้งหมดรับได้ ไม่ใช่แค่ไอคอนเล็ก\nตำแหน่งเปลี่ยนทุกเกม ดูให้ดีก่อนนับถอยหลังจบ\nถูก +10 ผิด −10 หลุดด้านล่าง −15\nจบเมื่อจัดการครบ 99 ตัว เมื่อเหลือ 40 ตัวจะเร็วขึ้นเป็น 1.3 เท่า\nระหว่างนับถอยหลังจะแสดงเฉพาะพื้นที่ ลิงจะมาตอนนับจบ",
    },
  };

  // The legacy endpoint has no verified acceptance schema. HTTP success is not
  // presented as proof that the score was accepted into a participant ranking.
  const responseLabels = {
    ja: "送信処理が完了しました。記録の受理は未確認です。",
    en: "Request completed. Record acceptance is not verified.",
    es: "Solicitud completada. No se ha verificado la aceptación del registro.",
    "pt-BR": "Solicitação concluída. A aceitação do registro não foi verificada.",
    "zh-Hans": "请求已完成，记录是否被受理尚未确认。",
    fr: "Requête terminée. L’acceptation du résultat n’est pas vérifiée.",
    de: "Anfrage abgeschlossen. Die Annahme des Ergebnisses ist nicht bestätigt.",
    ko: "요청이 완료되었습니다. 기록 접수 여부는 확인되지 않았습니다.",
    ru: "Запрос завершён. Принятие результата не подтверждено.",
    it: "Richiesta completata. L’accettazione del risultato non è verificata.",
    "zh-Hant": "請求已完成，紀錄是否被受理尚未確認。",
    id: "Permintaan selesai. Penerimaan catatan belum diverifikasi.",
    tr: "İstek tamamlandı. Kaydın kabul edildiği doğrulanmadı.",
    vi: "Yêu cầu đã hoàn tất. Chưa xác minh việc chấp nhận kết quả.",
    th: "คำขอเสร็จสิ้นแล้ว แต่ยังไม่ยืนยันว่ารับผลคะแนนแล้ว",
  };
  for (const [id] of languages) catalogs[id].sent = responseLabels[id];
  const LANGUAGE_KEY = "shiwakezaru_language";
  const AUDIO_KEY = "shiwakezaru_audio";
  let language = "en";
  let settings = { enabled: true, volume: 0.35 };
  let doc = null;
  let context = null;
  let audioEpoch = 0;
  let audioGestureEpoch = -1;
  let lastSoundAt = -Infinity;
  const active = new Set();
  const tones = { select: [380, 0.045], start: [520, 0.12], correct: [760, 0.075], wrong: [180, 0.11], miss: [125, 0.13], speed: [920, 0.16], complete: [660, 0.22], best: [1040, 0.25], cancel: [260, 0.1] };

  function read(key) { try { return window.localStorage.getItem(key); } catch (_) { return null; } }
  function write(key, value) { try { window.localStorage.setItem(key, value); return true; } catch (_) { return false; } }
  function matchLanguage(value) {
    if (typeof value !== "string") return null;
    const lower = value.toLowerCase().replace(/_/g, "-");
    const exact = languages.find(([id]) => id.toLowerCase() === lower);
    if (exact) return exact[0];
    if (lower === "zh" || lower.startsWith("zh-")) {
      const parts = lower.split("-");
      if (parts.includes("hans")) return "zh-Hans";
      if (parts.includes("hant")) return "zh-Hant";
      return parts.some(part => ["tw", "hk", "mo"].includes(part)) ? "zh-Hant" : "zh-Hans";
    }
    if (lower === "pt" || lower.startsWith("pt-")) return "pt-BR";
    return languages.find(([id]) => id === lower.split("-")[0])?.[0] || null;
  }
  function chooseLanguage(saved, browsers) {
    const validSaved = languages.some(([id]) => id === saved) ? saved : null;
    return validSaved || (browsers || []).map(matchLanguage).find(Boolean) || "en";
  }
  function t(key, params = {}) {
    const value = catalogs[language][key] ?? catalogs.en[key] ?? key;
    return value.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ""));
  }
  function setLanguage(value) {
    if (!languages.some(([id]) => id === value)) return false;
    language = value;
    return write(LANGUAGE_KEY, value);
  }
  function parseAudio(raw) {
    if (raw === null) return { enabled: true, volume: 0.35 };
    try {
      const value = JSON.parse(raw);
      return {
        enabled: typeof value?.enabled === "boolean" ? value.enabled : true,
        volume: typeof value?.volume === "number" && Number.isFinite(value.volume) && value.volume >= 0 && value.volume <= 1 ? value.volume : 0.35,
      };
    } catch (_) { return { enabled: true, volume: 0.35 }; }
  }
  function saveAudio() { write(AUDIO_KEY, JSON.stringify(settings)); renderAudio(); }
  function renderAudio() {
    if (!doc) return;
    const button = doc.getElementById("soundButton");
    button.textContent = t(settings.enabled ? "soundOn" : "soundOff");
    button.setAttribute("aria-pressed", String(settings.enabled));
    doc.getElementById("volumeInput").value = String(Math.round(settings.volume * 100));
  }
  function toggleSound() {
    settings.enabled = !settings.enabled;
    if (!settings.enabled) silence();
    saveAudio();
    if (settings.enabled) unlockAudio();
  }
  function setVolume(value) {
    if (!Number.isFinite(value)) return;
    settings.volume = Math.max(0, Math.min(1, value));
    if (settings.volume === 0) silence();
    saveAudio();
    if (settings.volume > 0 && settings.enabled) unlockAudio();
  }
  function unlockAudio() {
    if (!settings.enabled || settings.volume <= 0 || (doc && doc.hidden)) return;
    audioGestureEpoch = audioEpoch;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!context) context = new AudioContext();
      if (context.state === "suspended") {
        const resumedContext = context;
        Promise.resolve(context.resume()).then(() => {
          if (audioGestureEpoch !== audioEpoch || !settings.enabled || settings.volume <= 0 || (doc && doc.hidden)) {
            try { Promise.resolve(resumedContext.suspend()).catch(() => {}); } catch (_) {}
          }
        }).catch(() => {});
      }
    } catch (_) { /* Audio must never gate game start. */ }
  }
  function disposeVoice(voice, stop = true) {
    if (!voice || voice.disposed) return;
    voice.disposed = true;
    if (stop) { try { voice.oscillator?.stop(); } catch (_) {} }
    try { voice.oscillator?.disconnect(); } catch (_) {}
    try { voice.gain?.disconnect(); } catch (_) {}
    active.delete(voice);
  }
  function silence() {
    audioEpoch += 1;
    for (const voice of active) disposeVoice(voice);
    if (context && context.state === "running") {
      try { Promise.resolve(context.suspend()).catch(() => {}); } catch (_) {}
    }
  }
  function sound(event) {
    if (!settings.enabled || settings.volume <= 0 || !context || context.state !== "running" || (doc && doc.hidden)) return;
    const tone = tones[event];
    if (!tone) return;
    const now = context.currentTime;
    const terminal = event === "complete" || event === "best" || event === "cancel";
    if (!terminal && (now - lastSoundAt < 0.055 || active.size >= 4)) return;
    const voice = { oscillator: null, gain: null };
    try {
      if (terminal) {
        for (const previous of active) disposeVoice(previous);
      }
      lastSoundAt = now;
      const oscillator = voice.oscillator = context.createOscillator();
      const gain = voice.gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(tone[0], now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(settings.volume * 0.08, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + tone[1]);
      oscillator.connect(gain);
      gain.connect(context.destination);
      active.add(voice);
      oscillator.onended = () => disposeVoice(voice, false);
      oscillator.start(now);
      oscillator.stop(now + tone[1] + 0.01);
    } catch (_) { disposeVoice(voice); /* Failure is silent and non-blocking. */ }
  }
  function applyText(document) {
    document.documentElement.lang = language;
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
    const rules = document.querySelector(".rules-list");
    rules.replaceChildren(...t("rulesText").split("\n").map((line) => {
      const p = document.createElement("p"); p.textContent = line; return p;
    }));
    document.getElementById("languageSelect").value = language;
    const description = document.querySelector('meta[name="description"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (description) description.content = t("description");
    if (ogDescription) ogDescription.content = t("description");
    renderAudio();
  }
  function init(document) {
    doc = document;
    language = chooseLanguage(read(LANGUAGE_KEY), navigator.languages || [navigator.language]);
    settings = parseAudio(read(AUDIO_KEY));
    const select = doc.getElementById("languageSelect");
    for (const [id, label] of languages) { const option = doc.createElement("option"); option.value = id; option.textContent = label; select.appendChild(option); }
    renderAudio();
  }
  return Object.freeze({ languages, catalogs, chooseLanguage, parseAudio, t, setLanguage, init, applyText, toggleSound, setVolume, unlockAudio, silence, sound });
})();

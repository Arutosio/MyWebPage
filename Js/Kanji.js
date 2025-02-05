export default class Kanji {
    //static miaProprieta; // Dichiarazione senza inizializzazione
    htmlBuilder
    ShowToast
    // Variabili per Kanji Section
    kanjiListJson;
    selectOptionsKanjiList;
    kanjiListAddedOnTrainGroup;
    buttonRemoveKanjiList;
    buttonAddKanjiList;
    checkboxStartStopLearnKanji;
    buttonCheckKanji;
    checkboxKunYomi;
    checkboxOnYomi;
    divInputKunYomi;
    divInputOnYomi;
    numOfKunYomi;
    numOfOnYomi;
    inputKunYomi;
    inputOnYomi;
    labelInputKunYomi;
    labelInputOnYomi;
    spanButtonCountKanjiAnswerToDo;
    spanButtonCountKanjiAnswerDid;
    spanButtonCountKanjiAnswerWrong;
    spanButtonCountKanjiAnswerCorrectly;
    kanjiProgressBar;
    kanjiProgressBarProgress;
    kanjiAsk;
    // Var Kanji Exexise
    kanjiToLearn = [];
    lastKanji;
    testIsStarted = false;
    _countKanjiAnswerDid = 0;
    _countKanjiAnswerCorrectly = new Set();
    _countKanjiAnswerWrong = new Set();

    constructor(htmlBuilder, showToastFunction) { 
        this.htmlBuilder = htmlBuilder;
        if (typeof showToastFunction !== 'function') {
            throw new Error('Il parametro showToastFunction deve essere una funzione.');
        }
        this.ShowToast = showToastFunction;
    }

    //#region Getters and Setters
    get countKanjiAnswerDid() { return this._countKanjiAnswerDid; }
    set countKanjiAnswerDid(value) {
        this._countKanjiAnswerDid = value;
        this.spanButtonCountKanjiAnswerDid.textContent = value;
        this.UpdateProgressBar();
    }
    get countKanjiAnswerCorrectly() { return this._countKanjiAnswerCorrectly; }
    set countKanjiAnswerCorrectly(value) {
        this._countKanjiAnswerCorrectly = value;
        this.spanButtonCountKanjiAnswerCorrectly.textContent = this.countKanjiAnswerCorrectly.size;
    }
    get countKanjiAnswerWrong() { return this._countKanjiAnswerWrong; }
    set countKanjiAnswerWrong(value) {
        this._countKanjiAnswerWrong = value;
        this.spanButtonCountKanjiAnswerWrong.textContent = this.countKanjiAnswerWrong.size;
    }
    //#endregion Getters and Setters

    async Run() {
        if (this.kanjiListJson) {
            await this.InizializeComponent(); // Assicurati che gli elementi siano assegnati
            this.AddEventListenerElements();
        } else { 
            console.log("Non ci sono Liste di Kanji dentro kanjiListJson:", this.kanjiListJson); 
        }
    }

    async InizializeComponent() {
        //console.log("Kanji.Start() getElmenti! Start");
        //Kanji elements
        this.selectOptionsKanjiList = document.querySelector('#kanjiListSelectOptions');
        this.kanjiListAddedOnTrainGroup = document.querySelector('#kanjiListAddedOnTrainGroup');
        this.buttonRemoveKanjiList = document.querySelector('#buttonRemoveKanjiList');
        this.buttonAddKanjiList = document.querySelector('#buttonAddKanjiList');
        this.checkboxStartStopLearnKanji = document.querySelector('#checkboxStartStopLearnKanji');
        this.buttonCheckKanji = document.querySelector('#buttonCheckKanji');
        this.spanButtonCountKanjiAnswerToDo = document.querySelector('#spanButtonCountKanjiAnswerToDo');
        this.spanButtonCountKanjiAnswerDid = document.querySelector('#spanButtonCountKanjiAnswerDid');
        this.spanButtonCountKanjiAnswerWrong = document.querySelector('#spanButtonCountKanjiAnswerWrong');
        this.spanButtonCountKanjiAnswerCorrectly = document.querySelector('#spanButtonCountKanjiAnswerCorrectly');
        this.kanjiProgressBar = document.querySelector('#kanjiProgressBar');
        this.kanjiProgressBarProgress = document.querySelector('#kanjiProgressBarProgress');
        this.checkboxKunYomi = document.querySelector('#checkboxKunYomi');
        this.checkboxOnYomi = document.querySelector('#checkboxOnYomi');
        this.divInputKunYomi = document.querySelector('#divInputKunYomi');
        this.divInputOnYomi = document.querySelector('#divInputOnYomi');
        this.numOfKunYomi = this.divInputKunYomi.querySelector('#numOfKunYomi');
        this.numOfOnYomi = this.divInputOnYomi.querySelector('#numOfOnYomi');
        this.inputKunYomi = this.divInputKunYomi.querySelector('#inputKunYomi');
        this.inputOnYomi = this.divInputOnYomi.querySelector('#inputOnYomi');
        this.labelInputKunYomi = this.divInputKunYomi.querySelector('#labelInputKunYomi');
        this.labelInputOnYomi = this.divInputKunYomi.querySelector('#labelInputOnYomi');
        this.kanjiAsk = document.querySelector('#kanjiAsk');
        //console.log("Kanji.Start() getElmenti! End");
        return true;
    }

    AddEventListenerElements() {
        //console.log("Kanji.Start() AddEventsElements! Start");
        // Usa bind(this) per i metodi della classe
        this.selectOptionsKanjiList.addEventListener("change", this.selectOptionsKanjiListSelectChange.bind(this));
        this.buttonAddKanjiList.addEventListener('click', this.AddKanjiListOnGroup.bind(this));
        this.buttonRemoveKanjiList.addEventListener('click', this.RemoveKanjiListOnGroup.bind(this));
        this.checkboxStartStopLearnKanji.addEventListener('click', this.StartStopLearnKanji.bind(this));
        this.buttonCheckKanji.addEventListener('click', this.AskNextKanji.bind(this));
        this.checkboxKunYomi.addEventListener('change', this.InputKunYomiHiddenShow.bind(this));
        this.checkboxOnYomi.addEventListener('change', this.InputOnYomiHiddenShow.bind(this));
        this.inputKunYomi.addEventListener('input', this.InputKunYomiOnChangeResetColor.bind(this));
        this.inputOnYomi.addEventListener('input', this.InputOnYomiOnChangeResetColor.bind(this));
        this.inputKunYomi.addEventListener('keydown', this.InputKunYomiOnPressEnther.bind(this));
        this.inputOnYomi.addEventListener('keydown', this.InputOnYomiOnPressEnther.bind(this));

        //console.log("Kanji.Start() AddEventsElements! End");
    }

    selectOptionsKanjiListSelectChange(event) {
        // Stampa il valore selezionato nella console
        //console.log('Valore selezionato:', this.kanjiListSelectOptions.value);
        // Puoi anche ottenere il testo dell'opzione selezionata
        const selectedText = this.selectOptionsKanjiList.options[this.selectOptionsKanjiList.selectedIndex].text;
        //console.log('Testo selezionato:', selectedText);
    }

    EnableDisableStartStopButton() {
        const listItems = this.kanjiListAddedOnTrainGroup.querySelectorAll('li'); // Seleziona tutti gli elementi <li>
        if (listItems.length >= 2) { // Verifica se ci sono almeno due elementi <li>
        this.checkboxStartStopLearnKanji.disabled = false; // Abilita il pulsante
        } else {
            this.checkboxStartStopLearnKanji.disabled = true; // Disabilita il pulsante
        }
    }

    EnableAddRemoveButton(bool) {
        if (bool) {
            this.buttonAddKanjiList.disabled = false; 
            this.buttonRemoveKanjiList.disabled = false;
        } else {
            this.buttonAddKanjiList.disabled = true; 
            this.buttonRemoveKanjiList.disabled = true;
        }
    }

    EnableYomiCheckbox(bool) {
        if (bool) {
            this.checkboxKunYomi.disabled = false; 
            this.checkboxOnYomi.disabled = false;
        } else {
            this.checkboxKunYomi.disabled = true; 
            this.checkboxOnYomi.disabled = true;
        }
    }

    async AddKanjiListOnGroup() {
        // Codice da eseguire quando il pulsante viene cliccato
        //console.log('Il pulsante buttonAddKanjiList è stato cliccato!');
        try {
            if (!this.kanjiListAddedOnTrainGroup.querySelector(`#added${this.selectOptionsKanjiList.value}`))
            {
                let htmlKanjiListTemplate = ""; // Variabile per memorizzare il template HTML
                // Itera attraverso l'array kanjiListJson
                for (let i = 0; i < this.kanjiListJson.length; i++) {
                    const aKanjiListInfo = this.kanjiListJson[i]; // Ottieni l'elemento corrente
                    // Confronta il fileName con il valore selezionato
                    if (aKanjiListInfo.fileName === this.selectOptionsKanjiList.value) {
                        htmlKanjiListTemplate = await this.htmlBuilder.CreateHtmlKanjiListInfoByJsonKanjiList(aKanjiListInfo); // Crea il template HTML
                        break; // Esci dal ciclo una volta trovato l'elemento
                    }
                }
                // Se il template è vuoto, significa che non è stato trovato alcun elemento corrispondente
                if (htmlKanjiListTemplate === "") {
                    console.log(`${htmlKanjiListTemplate} non trovato!`);
                } else {
                    // Aggiungi il template HTML al contenitore
                    this.kanjiListAddedOnTrainGroup.insertAdjacentHTML('beforeend', htmlKanjiListTemplate);
                }
            } else { console.log(`I kanji: ${this.selectOptionsKanjiList.value} sono gia presenti nel gruppo.`); }
            this.EnableDisableStartStopButton(); // Aggiorna lo stato del pulsante.
        } catch (error) {
            console.error("Errore: non esistono elementi #added:", error);
            // Gestisci l'errore (mostra un messaggio all'utente, ecc.)
        }
    }

    RemoveKanjiListOnGroup() {
        // Codice da eseguire quando il pulsante viene cliccato
        //console.log('Il pulsante buttonRemoveKanjiList è stato cliccato!');
        // 2. Trova l'elemento da rimuovere (esempio: usando una classe)
        let elementToRemove = this.kanjiListAddedOnTrainGroup.querySelector(`#added${this.selectOptionsKanjiList.value}`); // Selettore più specifico
        // 3. Rimuovi l'elemento
        if (elementToRemove) { // Verifica che l'elemento esista prima di rimuoverlo
            elementToRemove.remove();
        } else {
            console.log("Elemento da rimuovere non trovato.");
        }
        this.EnableDisableStartStopButton(); // Aggiorna lo stato del pulsante.
    }

    // #region Methods Input Kun/On Yomi
    InputKunYomiHiddenShow() {
        if (this.divInputKunYomi.style.display === "none") {
            this.divInputKunYomi.style.display = "block"; // Mostra l'input
        } else {
            this.divInputKunYomi.style.display = "none"; // Nasconde l'input
        }
    }

    InputOnYomiHiddenShow() {
        if (this.divInputOnYomi.style.display === "none") {
            this.divInputOnYomi.style.display = "block"; // Mostra l'input
        } else {
            this.divInputOnYomi.style.display = "none"; // Nasconde l'input
        }
    }

    InputKunYomiOnChangeResetColor(event) {
        // Codice da eseguire quando viene premuto il tasto invio
        if (this.testIsStarted && this.inputKunYomi.style.color != '') {
            this.inputKunYomi.style.color = ''; 
        }
    }

    InputOnYomiOnChangeResetColor(event) {
        // Codice da eseguire quando viene premuto il tasto invio
        if (this.testIsStarted && this.inputOnYomi.style.color != '') {
            this.inputOnYomi.style.color = ''; 
        }
    }

    InputKunYomiOnPressEnther(event) {
        // Codice da eseguire quando viene premuto il tasto invio
        if (event.key === "Enter" && this.testIsStarted && !this.checkboxOnYomi.checked) {
            this.buttonCheckKanji.click();
        }
    }

    InputOnYomiOnPressEnther(event) {
        // Codice da eseguire quando viene premuto il tasto invio
        if (event.key === "Enter" && this.testIsStarted && !this.checkboxKunYomi.checked) {
            this.buttonCheckKanji.click();
        }
    }

    InputKunYomiSetColorGreenRed(bool) {
        if (bool) {
            this.inputKunYomi.style.color = 'green';
            this.inputKunYomi.disabled = true;
        } else { 
            this.inputKunYomi.style.color = 'red';
        }
    }

    InputOnYomiSetColorGreenRed(bool) {
        if (bool) {
            this.inputOnYomi.style.color = 'green';
            this.inputOnYomi.disabled = true;
        } else { 
            this.inputOnYomi.style.color = 'red';
        }
    }

    InputKOYomiEnable(bool) {
        if (bool) {
            this.inputKunYomi.disabled = false;
            this.inputOnYomi.disabled = false;
        } else {
            this.inputKunYomi.disabled = true;
            this.inputOnYomi.disabled = true;
        }
    }

    // #endregion Methods Input Kun/On Yomi
    UpdateKanjiAsk() {
        if (this.kanjiToLearn[this.countKanjiAnswerDid]) { // Importante: verifica che l'elemento esista!
            // Rimpiazza solo il testo:
            this.kanjiAsk.textContent = this.kanjiToLearn[this.countKanjiAnswerDid].carattere;
        } else {
            console.error("Elemento con id 'kanjiAsk' non trovato!");
        }
    }

    NumberOfYomiRefresShow() {
        if (this.kanjiToLearn[this.countKanjiAnswerDid] !== undefined) {
            if (this.kanjiToLearn[this.countKanjiAnswerDid].kun_yomi !== undefined){
                this.numOfKunYomi.textContent = this.kanjiToLearn[this.countKanjiAnswerDid].kun_yomi.length;
            } else { this.numOfKunYomi.textContent = "" }
            if (this.kanjiToLearn[this.countKanjiAnswerDid].on_yomi !== undefined){
                this.numOfOnYomi.textContent = this.kanjiToLearn[this.countKanjiAnswerDid].on_yomi.length;
            } else { this.numOfOnYomi.textContent = "" }
        } else {
            this.numOfKunYomi.textContent = ""
            this.numOfOnYomi.textContent = ""
        }
    }

    UpdateProgressBar() {
        const percent = (this.countKanjiAnswerDid / this.kanjiToLearn.length) * 100;
        const strProgressBar = `${percent}% ${this.countKanjiAnswerDid}/${this.kanjiToLearn.length}`;
        console.log(percent);
        this.kanjiProgressBar.setAttribute('aria-valuenow', percent); // oppure kanjiProgressBar.ariaValueNow = percent;
        this.kanjiProgressBarProgress.style.width = `${percent}%`; // Usa style.width
        this.kanjiProgressBarProgress.textContent = strProgressBar;
    }

    ClearInputYomi() {
        this.inputKunYomi.value = '';
        this.inputOnYomi.value = '';
    }

    AddKanjiInLearnKanjiList() {
        // Codice da eseguire quando il pulsante viene cliccato
        //console.log('Il pulsante checkboxStartStopLearnKanji è stato cliccato!');
        this.kanjiToLearn = []; // Svuota l'array prima di aggiungere nuovi elementi
        
        const elementiAdded = this.kanjiListAddedOnTrainGroup.querySelectorAll('[id^="added"]');
        
        if (elementiAdded.length > 0) { // Verifica se ci sono elementi prima di iterare (più efficiente)
            for (const elemento of elementiAdded) { // Usa for...of per iterare sugli elementi (più moderno e leggibile)
                const nameKanjiList = elemento.dataset.nameKanjiList; // Ottieni il dataset una sola volta per elemento
                
                if (nameKanjiList) { // Verifica che l'attributo data-name-kanji-list esista (gestione errori)
                    for (const kanjiList of this.kanjiListJson) { // Usa for...of per iterare su kanjiListJson
                        if (nameKanjiList === kanjiList.fileName) {
                            const kanjitoAdd = kanjiList.data.kanji;
                            
                            if (Array.isArray(kanjitoAdd)) { // Verifica se kanjitoAdd è un array (gestione errori)
                                for (const kanji of kanjitoAdd) {
                                    const kanjiEsistente = this.kanjiToLearn.find(k => k.carattere === kanji.carattere);
                                    if (!kanjiEsistente) {
                                        this.kanjiToLearn.push(kanji);
                                    }
                                }
                            } else if (kanjitoAdd) { // Gestisci il caso in cui kanjitoAdd è un singolo oggetto kanji
                                const kanjiEsistente = this.kanjiToLearn.find(k => k.carattere === kanjitoAdd.carattere);
                                if (!kanjiEsistente) {
                                    this.kanjiToLearn.push(kanjitoAdd);
                                }
                            } else {
                                console.warn(`Nessun kanji trovato per ${nameKanjiList}`); // Avviso se non ci sono kanji
                            }
                            break; // Esci dal ciclo interno dopo aver trovato la corrispondenza (ottimizzazione)
                        }
                    }
                } else {
                    console.warn(`L'elemento con id ${elemento.id} non ha l'attributo data-name-kanji-list.`);
                }
            }
        } else {
            console.log("Nessun elemento aggiunto al gruppo.");
        }
        console.log("Kanji da imparare:", this.kanjiToLearn); // Stampa l'array finale (utile per debug)
    }

    IsKanjiAnswersCorrect() {
        let isCorrect = true;
        //console.log('Eseguo IsKanjiAnswersCorrect.');
        const kanji = this.kanjiToLearn[this.countKanjiAnswerDid];

        if(this.checkboxKunYomi.checked) {
            // Controllo KunYomi
            if (this.inputKunYomi.value) {
                const arrayKunYomi = this.inputKunYomi.value.split('、');
                if (arrayKunYomi.length === kanji.kun_yomi.length) {
                    let allKunYomiCorrect = true; // Flag per le kun'yomi
                    for (let i = 0; i < arrayKunYomi.length; i++) {
                        const trimmedKunYomi = arrayKunYomi[i].trim();
                        let kunYomiFound = false;
                        for (const k_kun_yomi of kanji.kun_yomi) {
                            // if(!isHiraganaContingOFF) {

                            // }
                            // const hiraganaN = str.replace(/\(.*?\)/g, '');
                            console.log(trimmedKunYomi +' '+ k_kun_yomi.hiragana);

                            if (k_kun_yomi.hiragana === trimmedKunYomi) {
                                kunYomiFound = true;
                                break;
                            }
                        }

                        if (!kunYomiFound) {
                            isCorrect = false; // isCorrect è definita esternamente
                            allKunYomiCorrect = false;
                            this.ShowToast("Kun Yomi", `${trimmedKunYomi} errato.`);
                        }
                    }

                    this.InputKunYomiSetColorGreenRed(allKunYomiCorrect);
                    if (!allKunYomiCorrect) { // Se almeno una kun'yomi è sbagliata, isCorrect = false
                        isCorrect = false;
                    }
                } else {
                    isCorrect = false;
                    this.ShowToast("Kun Yomi", `Inseriti ${arrayKunYomi.length} / ${kanji.kun_yomi.length} (effettivi).`);
                }
            } else if (kanji.kun_yomi.length > 0) { // Gestisci il caso in cui il campo è vuoto ma ci sono kun'yomi
                isCorrect = false;
                this.ShowToast("Kun Yomi", "Il campo Kun Yomi è vuoto.");
            }
        }


        if(this.checkboxOnYomi.checked) {
            // Controllo OnYomi
            if (this.inputOnYomi.value) {
                const arrayOnYomi = this.inputOnYomi.value.split('、');
                if (arrayOnYomi.length === kanji.on_yomi.length) {
                    let allOnYomiCorrect = true; // Flag per le on'yomi
                    for (let i = 0; i < arrayOnYomi.length; i++) {
                        const trimmedOnYomi = arrayOnYomi[i].trim();
                        let onYomiFound = false;
                        for (const k_on_yomi of kanji.on_yomi) {
                            // if(!isHiraganaContingOFF) {

                            // }
                            // const hiraganaN = str.replace(/\(.*?\)/g, '');
                            console.log(trimmedOnYomi +' '+ k_on_yomi.hiragana);

                            if (k_on_yomi.hiragana === trimmedOnYomi) {
                                onYomiFound = true;
                                break;
                            }
                        }

                        if (!onYomiFound) {
                            isCorrect = false; // isCorrect è definita esternamente
                            allOnYomiCorrect = false;
                            this.ShowToast("On Yomi", `${trimmedOnYomi} errato.`);
                        }
                    }

                    this.InputOnYomiSetColorGreenRed(allOnYomiCorrect)
                    if (!allOnYomiCorrect) { // Se almeno una on'yomi è sbagliata, isCorrect = false
                        isCorrect = false;
                    }
                } else {
                    isCorrect = false;
                    this.ShowToast("On Yomi", `Inseriti ${arrayOnYomi.length} / ${kanji.on_yomi.length} (effettivi).`);
                }
            } else if (kanji.on_yomi.length > 0) { // Gestisci il caso in cui il campo è vuoto ma ci sono kun'yomi
                isCorrect = false;
                this.ShowToast("On Yomi", "Il campo Kun Yomi è vuoto.");
            }
        }

        if(isCorrect) {
            if (!this.countKanjiAnswerCorrectly.has(kanji.carattere) && !this.countKanjiAnswerWrong.has(kanji.carattere)) {
                this.countKanjiAnswerCorrectly.add(kanji.carattere);
            }
        } else {
            if (!this.countKanjiAnswerWrong.has(kanji.carattere)) {
                this.countKanjiAnswerWrong.add(kanji.carattere);
            }
        }
        this.UpdateCountKanjiAnswerCorrectAndWrong();
        return isCorrect;
    }

    UpdateCountKanjiAnswerCorrectAndWrong() {
        this.spanButtonCountKanjiAnswerCorrectly.textContent = this.countKanjiAnswerCorrectly.size;
        this.spanButtonCountKanjiAnswerWrong.textContent = this.countKanjiAnswerWrong.size;
    }

    AskNextKanji() {
        if(this.testIsStarted && this.IsKanjiAnswersCorrect())
        {
            this.countKanjiAnswerDid++;
            if(this.countKanjiAnswerDid < this.kanjiToLearn.length) {
                //this.previousKanjiAnswer = this.kanjiToLearn[this.countKanjiAnswerDid-1]
                this.UpdateKanjiAsk();
                this.NumberOfYomiRefresShow();
                this.spanButtonCountKanjiAnswerDid.textContent = this.countKanjiAnswerDid;
                this.InputKOYomiEnable(true);
            } else if (this.countKanjiAnswerDid = this.kanjiToLearn.length) {
                this.EnableAddRemoveButton(true);
                this.EnableYomiCheckbox(true);
                this.buttonCheckKanji.disabled = true;
                this.testIsStarted = false;
                this.ShowToast("Finish!", "Lista di kanji conclusa.");
            }
            this.ClearInputYomi();
        }
        // else { this.ShowToast("Wrong", "The Answers is incorrect."); }
    }

    RandomizzaKanjiToLearn() {
        if (!this.kanjiToLearn || this.kanjiToLearn.length === 0) {
            console.warn("L'array kanjiToLearn è vuoto o non definito.");
            return; // Non fare nulla se l'array è vuoto
        }

        // Algoritmo di Fisher-Yates (modificato) per randomizzare l'array
        for (let i = this.kanjiToLearn.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.kanjiToLearn[i], this.kanjiToLearn[j]] = [this.kanjiToLearn[j], this.kanjiToLearn[i]];
        }
        console.log("Array kanjiToLearn randomizzato:", this.kanjiToLearn);
    } 

    async StartStopLearnKanji() {
        if(this.checkboxStartStopLearnKanji.checked)
        {
            this.ClearInputYomi();
            this.InputKOYomiEnable(false);
            this.EnableAddRemoveButton(true);
            this.EnableYomiCheckbox(true);
            this.kanjiToLearning = [];
            this.countKanjiAnswerDid = 0;
            this.countKanjiAnswerCorrectly = new Set();
            this.countKanjiAnswerWrong = new Set();
            this.spanButtonCountKanjiAnswerToDo.textContent = this.kanjiToLearn.length;
            this.NumberOfYomiRefresShow();
            this.buttonCheckKanji.disabled = true;
            this.testIsStarted = false;
        } else {
            // Controlli
            this.EnableAddRemoveButton(false);
            this.EnableYomiCheckbox(false);
            this.AddKanjiInLearnKanjiList();
            this.RandomizzaKanjiToLearn();
            this.countKanjiAnswerDid = 0;
            this.countKanjiAnswerCorrectly = new Set();
            this.countKanjiAnswerWrong = new Set();
            this.spanButtonCountKanjiAnswerToDo.textContent = this.kanjiToLearn.length;
            this.testIsStarted = true;
            this.UpdateKanjiAsk();
            this.NumberOfYomiRefresShow();
            this.InputKOYomiEnable(true);
            this.buttonCheckKanji.disabled = false;
        }
    }
}
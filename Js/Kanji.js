export default class Kanji {
    //static miaProprieta; // Dichiarazione senza inizializzazione
    htmlBuilder
    ShowToast
    // Variabili per Kanji Section
    kanjiListJson;
    kanjiListSelectOptions;
    kanjiListAddedOnTrainGroup;
    buttonRemoveKanjiList;
    buttonAddKanjiList;
    buttonStartStopLearnKanji;
    buttonCheckKanji;
    checkboxKunYomi;
    checkboxOnYomi;
    divInputKunYomi;
    divInputOnYomi;
    inputKunYomi;
    inputOnYomi;
    labelInputKunYomi;
    labelInputOnYomi;
    spanButtonCountDid;
    spanButtonCountToDo;
    kanjiProgressBar;
    kanjiProgressBarProgress;
    kanjiAsk;
    kanjiToLearn = [];
    // Var Kanji Exexise
    testIsStarted = false;
    countKanjiAnswer = 0;

    constructor(htmlBuilder, showToastFunction) { 
        this.htmlBuilder = htmlBuilder;
        if (typeof showToastFunction !== 'function') {
            throw new Error('Il parametro showToastFunction deve essere una funzione.');
        }
        this.ShowToast = showToastFunction;
    }

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
        this.kanjiListSelectOptions = document.querySelector('#kanjiListSelectOptions');
        this.kanjiListAddedOnTrainGroup = document.querySelector('#kanjiListAddedOnTrainGroup');
        this.buttonRemoveKanjiList = document.querySelector('#buttonRemoveKanjiList');
        this.buttonAddKanjiList = document.querySelector('#buttonAddKanjiList');
        this.buttonStartStopLearnKanji = document.querySelector('#buttonStartStopLearnKanji');
        this.buttonCheckKanji = document.querySelector('#buttonCheckKanji');
        this.spanButtonCountDid = document.querySelector('#spanButtonCountDid');
        this.spanButtonCountToDo = document.querySelector('#spanButtonCountToDo');
        this.kanjiProgressBar = document.querySelector('#kanjiProgressBar');
        this.kanjiProgressBarProgress = document.querySelector('#kanjiProgressBarProgress');
        this.checkboxKunYomi = document.querySelector('#checkboxKunYomi');
        this.checkboxOnYomi = document.querySelector('#checkboxOnYomi');
        this.divInputKunYomi = document.querySelector('#divInputKunYomi');
        this.divInputOnYomi = document.querySelector('#divInputOnYomi');
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
        this.kanjiListSelectOptions.addEventListener("change", this.KanjiListSelectChange.bind(this));
        this.buttonAddKanjiList.addEventListener('click', this.AddKanjiListOnGroup.bind(this));
        this.buttonRemoveKanjiList.addEventListener('click', this.RemoveKanjiListOnGroup.bind(this));
        this.buttonStartStopLearnKanji.addEventListener('click', this.StartStopLearnKanji.bind(this));
        this.buttonCheckKanji.addEventListener('click', this.AskNextKanji.bind(this));
        this.checkboxKunYomi.addEventListener('change', this.HiddenShowInputKunYomi.bind(this));
        this.checkboxOnYomi.addEventListener('change', this.HiddenShowInputOnYomi.bind(this));
        this.inputKunYomi.addEventListener('keydown', this.InputKunYomiOnPressEnther.bind(this));
        this.inputOnYomi.addEventListener('keydown', this.InputOnYomiOnPressEnther.bind(this));

        //console.log("Kanji.Start() AddEventsElements! End");
    }

    KanjiListSelectChange(event) {
        // Stampa il valore selezionato nella console
        //console.log('Valore selezionato:', this.kanjiListSelectOptions.value);
        // Puoi anche ottenere il testo dell'opzione selezionata
        const selectedText = this.kanjiListSelectOptions.options[this.kanjiListSelectOptions.selectedIndex].text;
        //console.log('Testo selezionato:', selectedText);
    }

    // #region Section-Kanji-Methods
    EnableDisableStartStopButton() {
        const listItems = this.kanjiListAddedOnTrainGroup.querySelectorAll('li'); // Seleziona tutti gli elementi <li>
        if (listItems.length >= 2) { // Verifica se ci sono almeno due elementi <li>
        this.buttonStartStopLearnKanji.disabled = false; // Abilita il pulsante
        } else {
            this.buttonStartStopLearnKanji.disabled = true; // Disabilita il pulsante
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
            if (!this.kanjiListAddedOnTrainGroup.querySelector(`#added${this.kanjiListSelectOptions.value}`))
            {
                let htmlKanjiListTemplate = ""; // Variabile per memorizzare il template HTML
                // Itera attraverso l'array kanjiListJson
                for (let i = 0; i < this.kanjiListJson.length; i++) {
                    const aKanjiListInfo = this.kanjiListJson[i]; // Ottieni l'elemento corrente
                    // Confronta il fileName con il valore selezionato
                    if (aKanjiListInfo.fileName === this.kanjiListSelectOptions.value) {
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
            } else { console.log(`I kanji: ${this.kanjiListSelectOptions.value} sono gia presenti nel gruppo.`); }
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
        let elementToRemove = this.kanjiListAddedOnTrainGroup.querySelector(`#added${this.kanjiListSelectOptions.value}`); // Selettore più specifico
        // 3. Rimuovi l'elemento
        if (elementToRemove) { // Verifica che l'elemento esista prima di rimuoverlo
            elementToRemove.remove();
        } else {
            console.log("Elemento da rimuovere non trovato.");
        }
        this.EnableDisableStartStopButton(); // Aggiorna lo stato del pulsante.
    }

    HiddenShowInputKunYomi() {
        if (this.divInputKunYomi.style.display === "none") {
            this.divInputKunYomi.style.display = "block"; // Mostra l'input
        } else {
            this.divInputKunYomi.style.display = "none"; // Nasconde l'input
        }
    }

    HiddenShowInputOnYomi() {
        if (this.divInputOnYomi.style.display === "none") {
            this.divInputOnYomi.style.display = "block"; // Mostra l'input
        } else {
            this.divInputOnYomi.style.display = "none"; // Nasconde l'input
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

    UpdateKanjiAsk(kanji) {
        if (this.kanjiAsk) { // Importante: verifica che l'elemento esista!
            // Rimpiazza solo il testo:
            this.kanjiAsk.textContent = kanji.carattere;
        } else {
            console.error("Elemento con id 'kanjiAsk' non trovato!");
        }
    }

    UpdateProgressBar() {
        const percent = (this.countKanjiAnswer / this.kanjiToLearn.length) * 100;
        const strProgressBar = `${percent}% ${this.countKanjiAnswer}/${this.kanjiToLearn.length}`;
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
        //console.log('Il pulsante buttonStartStopLearnKanji è stato cliccato!');
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
        const kanji = this.kanjiToLearn[this.countKanjiAnswer];

        if(this.checkboxKunYomi.checked) {
            // Controllo KunYomi
            if (this.inputKunYomi.value) {
                const arrayKunYomi = this.inputKunYomi.value.split('、');
                if (arrayKunYomi.length === kanji.kun_yomi.length) {

                    console.log(arrayKunYomi.length +' '+ kanji.kun_yomi.length);

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

                    console.log(arrayOnYomi.length +' '+ kanji.on_yomi.length);

                    let allOnYomiCorrect = true; // Flag per le kun'yomi

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

                    if (!allOnYomiCorrect) { // Se almeno una kun'yomi è sbagliata, isCorrect = false
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
        return isCorrect;
    }

    AskNextKanji() {
        if(this.countKanjiAnswer == -1 || this.IsKanjiAnswersCorrect())
        {
            this.countKanjiAnswer++;
            if(this.kanjiToLearn.length !== undefined) {
        
                if(this.countKanjiAnswer < this.kanjiToLearn.length) {
                    this.spanButtonCountDid.textContent = this.countKanjiAnswer;
                    this.UpdateKanjiAsk(this.kanjiToLearn[this.countKanjiAnswer]); //
                } else {
                    this.ShowToast("Finish!", "Lista di kanji conclusa.");
                    this.EnableAddRemoveButton(true);
                    this.EnableYomiCheckbox(true);
                    this.buttonCheckKanji.disabled = true;
                }
                this.ClearInputYomi();
                this.UpdateProgressBar(); // Aggiorna la barra di progressione
            }
        }
        // else { this.ShowToast("Wrong", "The Answers is incorrect."); }
    }

    async StartStopLearnKanji() {
        // Controlli
        this.testIsStarted = true;
        this.EnableAddRemoveButton(false);
        this.EnableYomiCheckbox(false);
        this.AddKanjiInLearnKanjiList();
        this.countKanjiAnswer = -1;
        this.spanButtonCountDid.textContent = 0;
        this.spanButtonCountToDo.textContent = this.kanjiToLearn.length;
        this.AskNextKanji();
        this.buttonCheckKanji.disabled = false;
    }
    // #end region Section-Kanji-Methods
}
export default class DonateCrypto {
    htmlBuilder
    ShowToast
    // Variabili per Donate Section
    cryptoSelectOptions;
    addressInfos;

    constructor(htmlBuilder, showToastFunction) { 
        this.htmlBuilder = htmlBuilder;
        if (typeof showToastFunction !== 'function') {
            throw new Error('Il parametro showToastFunction deve essere una funzione.');
        }
        this.ShowToast = showToastFunction;
    }

    async Run() {
        if (true) {
            await this.InizializeComponent(); // Assicurati che gli elementi siano assegnati
            this.AddEventListenerElements();
        } else { 
            console.log("Non SDXDSDsadasd:", "ssssss"); 
        }
    }

    async InizializeComponent() {
        // console.log("DonateCrypto.Start() getElmenti! Start");
        // Crypto elements
        this.cryptoSelectOptions = document.querySelector('#cryptoSelectOptions');
        this.addressInfos = document.querySelectorAll(".chainList");
        // console.log("DonateCrypto.Start() getElmenti! End");
        return true;
    }

    AddEventListenerElements() {
        // console.log("DonateCrypto.Start() AddEventsElements! Start");
        // Usa bind(this) per i metodi della classe
        this.cryptoSelectOptions.addEventListener("change", this.HiddenShowAddress.bind(this));
        // this.cryptoSelectOptions.addEventListener("select", this.ShowAddressInfo.bind(this));

        // console.log("DonateCrypto.Start() AddEventsElements! End");
    }

    
    // ShowAddressInfo() {
    //     cryptoSelectOptions
    // }

    HiddenShowAddress() {
        for (let i = 0; i < this.addressInfos.length; i++) {
            let address = this.addressInfos[i];
            if (i == this.cryptoSelectOptions.value) {
                address.style.display = "flex";
            }
            else {
                address.style.display = "none";
            }
        }
    }
}
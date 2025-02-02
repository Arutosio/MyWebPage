//import readFileSync from 'fs';

export default class UtilityClass {
    // constructor(height, width) {
    //   this.height = height;
    //   this.width = width;
    // }
    static GetJsonFileNames(folderName) {
        try {
            let directoryPath = `../Files/Json/${folderName}`;
            
            if (!fs.existsSync(directoryPath)) {
                console.error(`La cartella "${folderName}" non esiste.`);
                return [];
            }

            const files = fs.readdirSync(directoryPath);
            const jsonFiles = files.filter(file => file.endsWith('.json'));

            return jsonFiles;
        } catch (error) {
            console.error('Errore durante la lettura della cartella:', error);
            return [];
        }
    }

    static async GetJsonFromRootPage(nameJsonFile) {
        return UtilityClass.GetJsonFromFile(`../Files/Json/${nameJsonFile}.json`);
    };

    static async GetJsonFromFile(filePath) {
        let fileText = await UtilityClass.GetTextFromFile(filePath);
        let jData = JSON.parse(fileText);
        return jData;
    };

    static async GetTextFromFile(filePath) {
        return await fetch(filePath).then(function (response) {
            return response.text();
        });
    }





    static async GetJsonFilesFromFolder(folderName, kanjiFileNames) {
        let jsonFiles = [];
        for (let index = 0; index < kanjiFileNames.length; index++) {
            try {
                // Costruisci il percorso del file
                let pathFileJson = `${folderName}/${kanjiFileNames[index]}`;
                // Ottieni i dati JSON (supponendo che GetJsonFromRootPage sia una funzione asincrona)
                let data = await UtilityClass.GetJsonFromRootPage(pathFileJson);
                // Aggiungi il file JSON alla lista
                let tempObj = { fileName: kanjiFileNames[index], data: data };
                jsonFiles.push(tempObj);
            } catch (error) {
                console.error(`Errore durante la lettura del file ${kanjiFileNames[index]}:`, error);
            }
        }
        return jsonFiles;
    }
}
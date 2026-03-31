export default class UtilityClass {

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
}
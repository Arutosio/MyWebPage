import UtilityClass from './UtilityClass.js';

export default class HtmlBuilder {
    constructor(pathTemplate, pathJson) {
        this.pathTemplate = pathTemplate;
        this.pathJson = pathJson;
    }
    // #region Navbar-Section-Footer
    async CreateNavbarView(data) {
        let path = `${this.pathTemplate}/Navbar_mainNavbar.html`;
        let htmlPost = await UtilityClass.GetTextFromFile(path);
        return htmlPost;
    }

    async CreateSectionView(data) {
        let path = `${this.pathTemplate}/Section_sHome.html`;
        let htmlPost = await UtilityClass.GetTextFromFile(path);
        return htmlPost;
    }

    async CreateSectionViewById(eleId) {
        let path = `${this.pathTemplate}/Section_${eleId}.html`;
        let htmlPost = await UtilityClass.GetTextFromFile(path);
        return htmlPost;
    }

    async CreateFooterViewById(eleId) {
        let path = `${this.pathTemplate}/Footer_${eleId}.html`;
        let htmlPost = await UtilityClass.GetTextFromFile(path);
        return htmlPost;
    }
    // #endregion Navbar-Section-Footer

    // #region Section-Donate
    async CreateSectionDonateView(jsonWalletDepositAddress) {
        let pathFileTemplate = `${this.pathTemplate}/Section_sDonate.html`;
        let htmlsDonate = await UtilityClass.GetTextFromFile(pathFileTemplate);

        //html Option_Select
        let htmlOptionSelects = await this.CreateHtmlCryptoOptionSelects(jsonWalletDepositAddress);
        htmlsDonate = HtmlBuilder.RepleaceAllKey(htmlsDonate, "Option_Select", htmlOptionSelects);

        let htmlAddressInfo = await this.CreateHtmlCryptoAddressInfos(jsonWalletDepositAddress);
        htmlsDonate = HtmlBuilder.RepleaceAllKey(htmlsDonate, "Address_Info", htmlAddressInfo);

        // let key_Table_Chain = "Table_Chain";
        // let htmlTableChain = await HtmlBuilder.CreateHtmlCryptoAddressInfos(this.pathTemplate, key_Table_Chain, jsonWalletDepositAddress);
        // htmlsDonate = HtmlBuilder.RepleaceAllKey(htmlsDonate, key_Table_Chain, htmlTableChain);

        return htmlsDonate;
    }

    async CreateHtmlCryptoOptionSelects(jsonWalletDepositAddress) {
        let htmlOptionSelects = "";
        let indexNum = 0;
        for (const keyCryptoInfo in jsonWalletDepositAddress) {
            if (Object.hasOwnProperty.call(jsonWalletDepositAddress, keyCryptoInfo)) {
                const elementCryptoInfo = jsonWalletDepositAddress[keyCryptoInfo];
                htmlOptionSelects += await this.CreateHtmlCryptoOptionSelect(elementCryptoInfo, indexNum)
                indexNum++;
            }
        }
        return htmlOptionSelects;
    }

    async CreateHtmlCryptoOptionSelect(elementCryptoInfo, index) {
        let pathOptionSelectTemplateHtml = `${this.pathTemplate}/Section_sDonate_Ele/Option_Select.html`;
        let htmlOptionSelect = await UtilityClass.GetTextFromFile(pathOptionSelectTemplateHtml);
        htmlOptionSelect = HtmlBuilder.RepleaceAllKey(htmlOptionSelect, "indexNum", index);
        htmlOptionSelect = HtmlBuilder.RepleaceAllKey(htmlOptionSelect, "logoCryptoIMG", elementCryptoInfo.logoCryptoIMG);
        htmlOptionSelect = HtmlBuilder.RepleaceAllKey(htmlOptionSelect, "nameCrypto", elementCryptoInfo.nameCrypto);
        htmlOptionSelect = HtmlBuilder.RepleaceAllKey(htmlOptionSelect, "nameSymbol", elementCryptoInfo.nameSymbol);
        return htmlOptionSelect;
    }

    async CreateHtmlCryptoAddressInfos(jsonWalletDepositAddress) {
        let htmlAddressInfos = "";
        for (const keyCryptoInfo in jsonWalletDepositAddress) {
            if (Object.hasOwnProperty.call(jsonWalletDepositAddress, keyCryptoInfo)) {
                const elementCryptoInfo = jsonWalletDepositAddress[keyCryptoInfo];
                htmlAddressInfos += await this.CreateHtmlCryptoAddressInfo(elementCryptoInfo)
            }
        }
        return htmlAddressInfos;
    }

    async CreateHtmlCryptoAddressInfo(elementCryptoInfo) {
        let pathFileTemplateHtml = `${this.pathTemplate}/Section_sDonate_Ele/Address_Info.html`;
        let htmlAddressinfo = await UtilityClass.GetTextFromFile(pathFileTemplateHtml);
        htmlAddressinfo = HtmlBuilder.RepleaceAllKey(htmlAddressinfo, "logoCryptoIMG", elementCryptoInfo.logoCryptoIMG);
        htmlAddressinfo = HtmlBuilder.RepleaceAllKey(htmlAddressinfo, "nameCrypto", elementCryptoInfo.nameCrypto);
        htmlAddressinfo = HtmlBuilder.RepleaceAllKey(htmlAddressinfo, "nameSymbol", elementCryptoInfo.nameSymbol);
        
        let htmlTrTableChains = "";
        let indexNum = 0;
        for (const keyChain in elementCryptoInfo.addressWallet) {
            if (Object.hasOwnProperty.call(elementCryptoInfo.addressWallet, keyChain)) {
                const infoChain = elementCryptoInfo.addressWallet[keyChain];
                htmlTrTableChains += await this.CreateHtmlChainTrTableInfo(infoChain, indexNum)
                indexNum++;
            }
        }
        htmlAddressinfo = HtmlBuilder.RepleaceAllKey(htmlAddressinfo, "Tr_Table_Chain", htmlTrTableChains);
        return htmlAddressinfo;
    }
    
    async CreateHtmlChainTrTableInfo(infoChain, indexNum) {
        let pathFileTemplateHtml = `${this.pathTemplate}/Section_sDonate_Ele/Tr_Table_Chain.html`;
        let htmlTrTableChain = await UtilityClass.GetTextFromFile(pathFileTemplateHtml);
        htmlTrTableChain = HtmlBuilder.RepleaceAllKey(htmlTrTableChain, "indexNum", indexNum);
        htmlTrTableChain = HtmlBuilder.RepleaceAllKey(htmlTrTableChain, "nameSymbolChain", infoChain.nameSymbolChain);
        htmlTrTableChain = HtmlBuilder.RepleaceAllKey(htmlTrTableChain, "nameChain", infoChain.nameChain);
        htmlTrTableChain = HtmlBuilder.RepleaceAllKey(htmlTrTableChain, "addressDepositText", infoChain.addressDepositText);
        htmlTrTableChain = HtmlBuilder.RepleaceAllKey(htmlTrTableChain, "qrcDepositImgQRC", infoChain.qrcDepositImgQRC);
        return htmlTrTableChain;
    }
    
    // #endregion Section-Donate

    // #region Section-Features (GitHub Repos)
    async CreateRepoCardView(repoData) {
        let path = `${this.pathTemplate}/Section_sFeatures_Ele/RepoCard.html`;
        let html = await UtilityClass.GetTextFromFile(path);
        html = HtmlBuilder.RepleaceAllKey(html, "repoName", repoData.name || "Unnamed");
        html = HtmlBuilder.RepleaceAllKey(html, "repoDescription", repoData.description || "No description available.");
        html = HtmlBuilder.RepleaceAllKey(html, "repoStars", repoData.stargazers_count || 0);
        html = HtmlBuilder.RepleaceAllKey(html, "repoForks", repoData.forks_count || 0);
        html = HtmlBuilder.RepleaceAllKey(html, "repoCommits", repoData._commitCount != null ? repoData._commitCount : "—");
        html = HtmlBuilder.RepleaceAllKey(html, "repoUrl", repoData.html_url || "#");
        html = HtmlBuilder.RepleaceAllKey(html, "repoUpdated", repoData._updatedRelative || "");
        return html;
    }
    // #endregion Section-Features

    // #region Utility-Methods
    static RepleaceKey(mainStr, keyword, replaceStr) {
        let htmlEdit;
        let keywordAdapted = `:|§${keyword}§|:`;
        // if(replaceStr !== null && replaceStr !== '') {
        htmlEdit = mainStr.replace(keywordAdapted, replaceStr);
        // } else {
        //     htmlEdit = mainStr.replace(keywordAdapted, '');
        // }
        return htmlEdit;
    }

    static RepleaceAllKey(mainStr, keyword, replaceStr) {
        if (!mainStr){ // || typeof mainStr !== "string") {
            console.error("mainStr non è una stringa valida:", mainStr);
            return ""; // Restituisci una stringa vuota in caso di errore
        }
        let htmlEdit = String(mainStr);
        let keywordAdapted = `:|§${keyword}§|:`;
        do {
            htmlEdit = htmlEdit.replace(keywordAdapted, replaceStr);
        } while (htmlEdit.split(keywordAdapted).length > 1);
        return htmlEdit;
    }
    // #endregion Utility-Methods 
}
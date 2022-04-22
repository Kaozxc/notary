// Search String

function loadBook(filename, displayName) {
    let currentBook = '';
    let url = 'books/' + filename;

    document.getElementById('fileName').innerHTML = displayName;
    document.getElementById('searchstat').innerHTML = '';
    document.getElementById('keyword').value = '';

    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            currentBook = xhr.responseText;

            getDocsStats(currentBook);

            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');

            document.getElementById('fileContent').innerHTML = currentBook;

            let elmnt = document.getElementById('fileContent');
            elmnt.scrollTop = 0;
        }
    }
}

function getDocsStats(fileContent) {
    let docLength = document.getElementById('docLength');
    let wordCount = document.getElementById('wordCount');
    let charCount = document.getElementById('charCount');

    let text = fileContent.toLowerCase();
    let wordArray = text.match(/\b\S+\b/g);
    let wordDictionary = {};

    let uncommonWords = [];

    uncommonWords = filterStopWords(wordArray);

    for (let word in uncommonWords) {
        let wordValue = uncommonWords[word];
        if (wordDictionary[wordValue] > 0) {
            wordDictionary[wordValue] += 1;
        } else {
            wordDictionary[wordValue] = 1;
        }
    }

    let wordList = sortProperties(wordDictionary);

    let top5Words = wordList.slice(0, 6);
    let least5Words = wordList.slice(-6, wordList.length);

    ULTemplate(top5Words, document.getElementById('mostUsed'));
    ULTemplate(least5Words, document.getElementById('leastUsed'));

    docLength.innerText = 'Document Length: ' + text.length;
    wordCount.innerText = "Word Count: " + wordArray.length;
}

function ULTemplate(items, element) {
    let rowTemplate = document.getElementById('template-ul-items');
    let templateHTML = rowTemplate.innerHTML;
    let resultsHTML = '';
    for (let i = 0; i < items.length - 1; i++) {
        resultsHTML += templateHTML.replace('{{val}}', items[i][0] + ': ' + items[i][1] + ' time(s)');
    }
    element.innerHTML = resultsHTML;
}

function sortProperties(obj) {
    let rtnArray = Object.entries(obj);

    rtnArray.sort(function (a, b) {
        return b[1] - a[1];
    })
    return rtnArray;
}

function filterStopWords(wordArray) {
    let commonWords = getStopWords();
    let commonObj = {};
    let uncommonArray = [];

    for (let i = 0; i < commonWords.length; i++) {
        commonObj[commonWords[i].trim()] = true;
    }

    for (let i = 0; i < wordArray.length; i++) {
        word = wordArray[i].trim().toLowerCase();
        if (!commonObj[word]) {
            uncommonArray.push(word);
        }
    }
    return uncommonArray;
}

function getStopWords() {
    return ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']
}

// Highlight the words in search
function perfomMark() {
    let keyword = document.getElementById('keyword').value;
    let display = document.getElementById('fileContent');

    let newContent = '';

    let spans = document.querySelectorAll('mark');

    for (let i = 0; i < spans.length; i++) {
        spans[i].outerHTML = spans[i].innerHTML;
    }

    let re = new RegExp(keyword, 'gi');
    let replaceText = '<mark id="markme">$&</mark>';
    let bookContent = display.innerHTML;

    newContent = bookContent.replace(re, replaceText);

    display.innerHTML = newContent;
    let count = document.querySelectorAll('mark').length;
    document.getElementById('searchstat').innerHTML = 'found' + count + ' matches';
}
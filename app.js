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
    return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
}

// Highlight the words in search
function performMark() {
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

    if (count > 0) {
        let element = document.getElementById('markme');
        element.scrollIntoView();
    }
}
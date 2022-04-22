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

            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');

            document.getElementById('fileContent').innerHTML = currentBook;

            let elmnt = document.getElementById('fileContent');
            elmnt.scrollTop = 0;
        }
    }
}
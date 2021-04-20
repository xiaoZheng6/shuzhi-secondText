function AjaxRequest(url, operationFun,keyword) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        operationFun(JSON.parse(xhttp.responseText),keyword);
      }
    };
    xhttp.open("POST", url, true);
    xhttp.withCredentials = true;
    xhttp.send();
}
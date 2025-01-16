function loadContent(project) {
    // Dynamischer Bereich, in den der neue Inhalt geladen wird
    const mainContent = document.getElementById('main-content');
  
    // Lade die entsprechende HTML-Datei aus dem "content"-Ordner
    fetch(`content/${project}.html`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Projekt nicht gefunden'); // Fehler werfen, falls die Datei nicht existiert
        }
        return response.text(); // HTML-Inhalt als Text zurückgeben
      })
      .then(data => {
        mainContent.innerHTML = data; // HTML-Inhalt in den dynamischen Bereich einfügen
      })
      .catch(error => {
        mainContent.innerHTML = `<p>Fehler: ${error.message}</p>`; // Fehlermeldung anzeigen
      });
  }


//___________



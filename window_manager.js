// Fonction pour récupérer les données de la page Web (titre, icône) via un proxy
function fetchPageData(url) {
    // Utiliser l'URL comme titre (ou tu peux en mettre un fixe)
    const title = url;

    // Icône par défaut (ou tu peux essayer de générer un favicon via Google par ex.)
    const icon = './default-icon.png';

    // Créer directement la fenêtre avec l'iframe
    createWindow(
        icon,
        title,
        `<iframe src="${url}" style="width: 100%; height: 100%; border: none;"></iframe>`
    );
}

// Fonction pour créer une fenêtre avec titre, icône et contenu
function createWindow(icon, title, content) {
    const windowId = "window" + (document.querySelectorAll('.window').length + 1);

    // Créer la structure de la fenêtre
    const windowElement = document.createElement('div');
    windowElement.classList.add('window');
    windowElement.id = windowId;

    // Créer l'en-tête de la fenêtre
    const windowHeader = document.createElement('div');
    windowHeader.classList.add('title-bar');
    windowHeader.id = windowId + 'header';

    // Créer l'icône de la fenêtre
    const windowIcon = document.createElement('img');
    windowIcon.setAttribute('aria-label', 'windowicon');
    windowIcon.src = icon;

    // Créer le titre de la fenêtre
    const windowTitle = document.createElement('div');
    windowTitle.classList.add('title-bar-text');
    windowTitle.innerText = title;

    // Créer les contrôles de la fenêtre
    const windowControls = document.createElement('div');
    windowControls.classList.add('title-bar-controls');

    const minimizeButton = document.createElement('button');
    minimizeButton.setAttribute('aria-label', 'Minimize');
    windowControls.appendChild(minimizeButton);

    const maximizeButton = document.createElement('button');
    maximizeButton.setAttribute('aria-label', 'Maximize');
    windowControls.appendChild(maximizeButton);

    const closeButton = document.createElement('button');
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.addEventListener('click', () => {
        windowElement.remove(); // Supprimer la fenêtre quand on clique sur "fermer"
        removeTaskbarButton(windowId); // Supprimer le bouton dans la barre des tâches
    });
    windowControls.appendChild(closeButton);

    // Ajouter l'icône, le titre et les contrôles dans l'en-tête
    windowHeader.appendChild(windowIcon);
    windowHeader.appendChild(windowTitle);
    windowHeader.appendChild(windowControls);

    // Créer le corps de la fenêtre
    const windowBody = document.createElement('div');
    windowBody.classList.add('window-body');
    windowBody.style.height = '245px';
    windowBody.innerHTML = content;

    // Ajouter l'en-tête et le corps de la fenêtre dans la fenêtre
    windowElement.appendChild(windowHeader);
    windowElement.appendChild(windowBody);

    // Ajouter un coin de redimensionnement en bas à droite
    const resizeHandle = document.createElement('div');
    resizeHandle.classList.add('resize-handle');
    windowElement.appendChild(resizeHandle);

    // Ajouter la fenêtre à la page
    document.body.appendChild(windowElement);

    // Appliquer le drag à la nouvelle fenêtre
    dragElement(windowElement);

    // Ajouter l'événement pour mettre au premier plan la fenêtre
    windowElement.addEventListener('click', () => bringToFront(windowElement));

    // Ajouter les événements pour redimensionner la fenêtre
    makeResizable(windowElement);

    // Créer un bouton dans la barre des tâches (dans la div de class taskbaricons)
    createTaskbarButton(windowId, icon, title);
}

// Fonction pour créer un bouton dans la barre des tâches
function createTaskbarButton(windowId, icon, title) {
    const taskbarIcons = document.querySelector('.taskbaricons'); // Assurez-vous qu'il y a une div avec la classe "taskbaricons"
    const taskbarButton = document.createElement('button');
    taskbarButton.classList.add('taskbarbutton');
    taskbarButton.classList.add('taskbarfocused');
    taskbarButton.classList.add(windowId); // Ajouter l'ID de la fenêtre pour pouvoir le retrouver

    // Créer l'icône pour le bouton de la barre des tâches
    const taskbarIcon = document.createElement('img');
    taskbarIcon.classList.add('taskbaricon');
    taskbarIcon.src = icon;
    taskbarIcon.setAttribute('draggable', 'false');
    taskbarButton.appendChild(taskbarIcon);

    // Ajouter un événement pour amener la fenêtre au premier plan
    taskbarButton.addEventListener('click', () => {
        const windowElement = document.getElementById(windowId);
        bringToFront(windowElement); // Mettre cette fenêtre au premier plan quand on clique sur le bouton
    });

    // Ajouter le bouton à la div taskbaricons
    taskbarIcons.appendChild(taskbarButton);
}

// Fonction pour supprimer un bouton de la barre des tâches
function removeTaskbarButton(windowId) {
    const taskbarButton = document.querySelector(`.taskbarbutton.${windowId}`);
    if (taskbarButton) {
        taskbarButton.remove(); // Supprimer le bouton de la barre des tâches
    }
}

// Fonction pour amener la fenêtre au premier plan
function bringToFront(windowElement) {
    const allWindows = document.querySelectorAll('.window');
    let maxZIndex = 0;
    allWindows.forEach(win => {
        const zIndex = parseInt(window.getComputedStyle(win).zIndex, 10);
        if (zIndex > maxZIndex) {
            maxZIndex = zIndex;
        }
    });

    // Assigner un z-index supérieur à la fenêtre cliquée
    windowElement.style.zIndex = maxZIndex + 1;
}

// Fonction pour rendre une fenêtre redimensionnable
function makeResizable(windowElement) {
    const resizeHandle = windowElement.querySelector('.resize-handle');

    resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();

        const initialWidth = windowElement.offsetWidth;
        const initialHeight = windowElement.offsetHeight;
        const initialX = e.clientX;
        const initialY = e.clientY;

        const onMouseMove = (e) => {
            const deltaX = e.clientX - initialX;
            const deltaY = e.clientY - initialY;

            windowElement.style.width = `${initialWidth + deltaX}px`;
            windowElement.style.height = `${initialHeight + deltaY}px`;
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

// Gestionnaire d'événements pour le bouton
document.querySelector('.open-web').addEventListener('click', () => {
        fetchPageData("https://bigoldjug.github.io/stjo/interstellar.html");

});
document.querySelector('.open-info').addEventListener('click', () => {
    const url = "https://frutigeraeroarchive.org/resources";
    if (url) {
        fetchPageData(url);
    }
});


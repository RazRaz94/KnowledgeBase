let viewer = null;
let fullImage = null;
let viewerTitle = null;

function createViewer() {

    if (viewer) return;

    viewer = document.createElement("div");
    viewer.id = "viewer";

    viewer.innerHTML = `
        <div class="window">

            <div class="titlebar">
                <span id="viewerTitle">Xfire Screenshot Viewer</span>
                <button id="closeBtn">X</button>
            </div>

            <div class="content">
                <img id="fullImage" src="" alt="">
            </div>

        </div>
    `;

    document.body.appendChild(viewer);

    fullImage = viewer.querySelector("#fullImage");
    viewerTitle = viewer.querySelector("#viewerTitle");

    viewer.querySelector("#closeBtn").addEventListener("click", closeViewer);

    viewer.addEventListener("click", function(e) {

        if (e.target === viewer) {
            closeViewer();
        }

    });

}


function openViewer(shot) {

    createViewer();

    const img = shot.querySelector("img");

    if (!img) return;

    fullImage.src = img.src;

    viewerTitle.textContent = img.alt || "Xfire Screenshot Viewer";

    viewer.classList.add("show");

}


function closeViewer() {

    if (viewer) {
        viewer.classList.remove("show");
    }

}


document.addEventListener("keydown", function(e) {

    if (e.key === "Escape") {
        closeViewer();
    }

});


document.addEventListener("DOMContentLoaded", function() {

    document.querySelectorAll(".shot").forEach(function(shot) {

        shot.addEventListener("click", function() {

            openViewer(this);

        });

    });

});
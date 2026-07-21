document.addEventListener("DOMContentLoaded", () => {

    const modal = document.createElement("div");

    modal.className = "video-modal";

    modal.innerHTML = `
        <div class="video-window">

            <div class="video-title">
                Video Player
                <span class="close-button">✕</span>
            </div>

            <div class="player-frame">
                <iframe
                    class="youtube-player"
                    frameborder="0"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowfullscreen>
                </iframe>
            </div>

            <div class="video-footer">
                Powered by JavaScript
            </div>

        </div>
    `;

    document.body.appendChild(modal);


    const player = modal.querySelector(".youtube-player");
    const closeButton = modal.querySelector(".close-button");


    function getYoutubeID(url) {

        const parsed = new URL(url);

        if (parsed.hostname.includes("youtu.be")) {
            return parsed.pathname.substring(1);
        }

        return parsed.searchParams.get("v");

    }


    function openVideo(id) {

        player.src =
            `https://www.youtube-nocookie.com/embed/${id}` +
            `?autoplay=1` +
            `&rel=0` +
            `&origin=${encodeURIComponent(window.location.origin)}`;

        modal.style.display = "block";

    }


    function closeVideo() {

        modal.style.display = "none";
        player.src = "";

    }


    document.addEventListener("click", (event) => {

        const link = event.target.closest(".video-link");

        if (!link) return;

        event.preventDefault();

        const videoID = getYoutubeID(link.href);

        if (videoID) {
            openVideo(videoID);
        }

    });


    closeButton.addEventListener("click", closeVideo);


    modal.addEventListener("click", (event) => {

        if (event.target === modal) {
            closeVideo();
        }

    });


    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            modal.style.display === "block"
        ) {
            closeVideo();
        }

    });

});
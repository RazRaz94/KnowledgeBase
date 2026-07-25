document.addEventListener("DOMContentLoaded", () => {


    document
        .querySelectorAll(".scrollable")
        .forEach(createScrollbar);



    function createScrollbar(section) {


        const container =
            document.createElement("div");

        container.className =
            "custom-scroll-container";


        section.parentNode.insertBefore(
            container,
            section
        );

        container.appendChild(section);



        const scrollbar =
            document.createElement("div");


        scrollbar.className =
            "custom-scrollbar";


        scrollbar.innerHTML = `
            <button class="scroll-up">▲</button>

            <div class="scroll-track">
                <div class="scroll-thumb"></div>
            </div>

            <button class="scroll-down">▼</button>
        `;


        container.appendChild(scrollbar);



        const area = section;


        const content =
            section.querySelector(".scroll-content")
            || section;



        const track =
            scrollbar.querySelector(".scroll-track");


        const thumb =
            scrollbar.querySelector(".scroll-thumb");


        const up =
            scrollbar.querySelector(".scroll-up");


        const down =
            scrollbar.querySelector(".scroll-down");



        let scrollPosition = 0;

        let dragging = false;

        let dragStartY = 0;

        let startScroll = 0;





        function getScrollData() {

            const visibleHeight =
                area.clientHeight;


            const contentHeight =
                content.scrollHeight;


            return {

                visibleHeight,

                contentHeight,

                maxScroll:
                    Math.max(
                        contentHeight - visibleHeight,
                        0
                    )

            };

        }





        function updateScrollbar() {


            const {
                visibleHeight,
                contentHeight
            } = getScrollData();



            if (contentHeight <= visibleHeight) {

                scrollbar.style.display =
                    "none";

                return;

            }



            scrollbar.style.display =
                "flex";



            const thumbHeight =
                Math.max(
                    (
                        visibleHeight /
                        contentHeight
                    )
                    *
                    track.clientHeight,

                    30
                );



            thumb.style.height =
                `${thumbHeight}px`;

        }





        function updateScroll() {


            const {
                maxScroll
            } = getScrollData();



            scrollPosition =
                Math.max(
                    0,
                    Math.min(
                        scrollPosition,
                        maxScroll
                    )
                );



            content.style.transform =
                `translateY(-${scrollPosition}px)`;



            if (maxScroll > 0) {


                const maxThumbMove =
                    track.clientHeight -
                    thumb.offsetHeight;



                const thumbPosition =
                    (
                        scrollPosition /
                        maxScroll
                    )
                    *
                    maxThumbMove;



                thumb.style.transform =
                    `translateY(${thumbPosition}px)`;

            }

        }





        function setScrollPosition(value) {


            const {
                maxScroll
            } = getScrollData();



            scrollPosition =
                Math.max(
                    0,
                    Math.min(
                        value,
                        maxScroll
                    )
                );



            updateScroll();

        }





        function scrollToElement(element) {


            const offset =
                element.offsetTop -
                content.offsetTop;



            setScrollPosition(offset);

        }





        // Wheel scrolling

        area.addEventListener(
            "wheel",
            e => {

                e.preventDefault();


                setScrollPosition(
                    scrollPosition + e.deltaY
                );

            },
            {
                passive:false
            }
        );





        // Buttons

        up.addEventListener(
            "click",
            () => {

                setScrollPosition(
                    scrollPosition - 30
                );

            }
        );



        down.addEventListener(
            "click",
            () => {

                setScrollPosition(
                    scrollPosition + 30
                );

            }
        );





        // Dragging

        thumb.addEventListener(
            "pointerdown",
            e => {


                dragging = true;


                dragStartY =
                    e.clientY;


                startScroll =
                    scrollPosition;


                thumb.setPointerCapture(
                    e.pointerId
                );


                thumb.style.cursor =
                    "grabbing";

            }
        );





        thumb.addEventListener(
            "pointermove",
            e => {


                if (!dragging)
                    return;



                const delta =
                    e.clientY -
                    dragStartY;



                const {
                    maxScroll
                } = getScrollData();



                const maxThumbMove =
                    track.clientHeight -
                    thumb.offsetHeight;



                if (maxThumbMove <= 0)
                    return;



                setScrollPosition(
                    startScroll +
                    delta *
                    (
                        maxScroll /
                        maxThumbMove
                    )
                );

            }
        );





        thumb.addEventListener(
            "pointerup",
            e => {


                dragging = false;


                thumb.releasePointerCapture(
                    e.pointerId
                );


                thumb.style.cursor =
                    "grab";

            }
        );







        // Table of Contents

        document
            .querySelectorAll(".toc a")
            .forEach(link => {


                link.addEventListener(
                    "click",
                    e => {

                        e.preventDefault();


                        const id =
                            link
                            .getAttribute("href")
                            .substring(1);



                        const target =
                            content.querySelector(
                                "#" + id
                            );



                        if (!target)
                            return;



                        scrollToElement(target);



                        history.pushState(
                            null,
                            "",
                            "#" + id
                        );

                    }
                );


            });







        // Browser back/forward

        window.addEventListener(
            "popstate",
            () => {


                const id =
                    location.hash.substring(1);



                if (!id)
                    return;



                const target =
                    content.querySelector(
                        "#" + id
                    );



                if (target)
                    scrollToElement(target);

            }
        );







        // Initial hash position

        if (location.hash) {


            const target =
                content.querySelector(
                    location.hash
                );


            if (target) {

                setTimeout(
                    () => {
                        scrollToElement(target);
                    },
                    50
                );

            }

        }






        window.addEventListener(
            "resize",
            () => {

                updateScrollbar();

                updateScroll();

            }
        );





        updateScrollbar();

        updateScroll();

    }

});

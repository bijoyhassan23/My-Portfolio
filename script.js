function typingAnimation(mEl, typSpeed, delSpeed) {
    const mainElement = document.querySelector(mEl);
    const placedText = mainElement.querySelector(".text-palace");
    const typText = placedText.querySelectorAll("span");
    const texts = [];
    for (let i of typText) {
        texts.push(i.innerHTML);
    }
    placedText.innerHTML = "";
    function rmText(textArray, resFun) {
        let indx = textArray.length - 1;
        const rmInter = setInterval(function () {
            let plx = "";
            if (indx >= 0) {
                for (let i = 0; i <= indx; i++) {
                    plx += textArray[i];
                }
                placedText.innerHTML = plx;
            } else {
                placedText.innerHTML = "";
                indx <= -1 && clearInterval(rmInter);
                resFun();
            }
            indx--;
        }, delSpeed);
    }
    function textFun(tx) {
        return new Promise((res) => {
            const textArray = tx.split("");
            let plText = "";
            let ind = 0;
            const mainTypingText = setInterval(function () {
                plText += textArray[ind];
                placedText.innerHTML = plText;
                if (ind === textArray.length - 1) {
                    clearInterval(mainTypingText);
                    setTimeout(function () {
                        rmText(textArray, function () {
                            res();
                        });
                    }, 500);
                }
                ind++;
            }, typSpeed);
        });
    }
    async function* typGen() {
        for (let text1 of texts) {
            yield await textFun(text1);
        }
    }

    (async function againCallFun() {
        let a = typGen();
        for await (let i of a) {
        }
        againCallFun();
    })();
}

typingAnimation(".typing-animation-text", 500, 70);

function mobileMneu() {
    const getBar = document.querySelector(".bar");
    const getSideBar = document.querySelector(".sidebar-menu");
    const getMbSideBarBack = document.querySelector(".mb-sidebar-back");
    function navMainFun() {
        getMbSideBarBack.classList.toggle("show-sidebar-back");
        getBar.classList.toggle("active");
        getSideBar.classList.toggle("mb-sidebar");
    }
    getBar.addEventListener("click", navMainFun);
    getMbSideBarBack.addEventListener("click", navMainFun);
}

mobileMneu();

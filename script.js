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

function skillRenge() {
    const getSkill = document.querySelectorAll(".skill");
    for (let element of getSkill) {
        let getValue = element.querySelector(".value").innerText;
        element.querySelector(".inner-percent").style.width = getValue;
    }
}

skillRenge();

async function portfolios() {
    const getData = await fetch("http://localhost:3000/portfolio");
    const data = await getData.json();

    const getPorfolios = document.querySelector(".tab-body");
    const getCard = getPorfolios.querySelector(".tab-element");

    const getTabHeading = document.querySelector(".tab-heading ul");

    let allCategory = ["All"];
    getPorfolios.innerHTML = "";
    getTabHeading.innerHTML = "";

    let cardPos = [];
    let colNum = 3;
    if (window.innerWidth <= 576) {
        colNum = 1;
    } else if (window.innerWidth <= 768) {
        colNum = 2;
    }

    let currentCol = 0;
    for (let i = 0; i < colNum; i++) {
        cardPos.push([]);
    }
    let colWidth = getPorfolios.offsetWidth / colNum;
    for (let element of data) {
        if (currentCol >= cardPos.length) {
            currentCol = 0;
        }
        const cloneCard = getCard.cloneNode(true);
        cloneCard.querySelector(".bg-card").src = element.thumImg;
        cloneCard.querySelector(".title").innerText = element.title;
        cloneCard.querySelector(".category").innerText = element.category;
        getPorfolios.append(cloneCard);
        cloneCard.style.left = `${colWidth * currentCol}px`;
        cardPos[currentCol].push(cloneCard);
        currentCol++;
        allCategory = allCategory.concat(element.category);
    }
    allCategory = [...new Set(allCategory)];

    for (let heading of allCategory) {
        let headElement = document.createElement("li");
        headElement.innerHTML = heading;
        getTabHeading.append(headElement);
        headElement.addEventListener("click", function () {
            filterFun(heading, data);
        });
    }

    function setTabHeight() {
        for (let cols of cardPos) {
            let top = 0;
            for (let ele of cols) {
                ele.style.top = `${top}px`;
                top += ele.scrollHeight;
            }
        }
        const getPorfolios2 = document.querySelector(".tab-body");
        getPorfolios2.style.height = `${getPorfolios2.scrollHeight}px`;
    }
    window.addEventListener("load", setTabHeight);
}

portfolios();

window.addEventListener("resize", portfolios);

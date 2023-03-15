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
    let allElement = [];

    for (let catEle of data) {
        allCategory = allCategory.concat(catEle.category);
    }

    allCategory = [...new Set(allCategory)];
    let categoryItem = {};

    for (let cate of allCategory) {
        categoryItem[cate] = [];
    }

    for (let element of data) {
        const cloneCard = getCard.cloneNode(true);
        cloneCard.querySelector(".bg-card").src = element.thumImg;
        cloneCard.querySelector(".title").innerText = element.title;
        cloneCard.querySelector(".category").innerText = element.category;
        getPorfolios.append(cloneCard);
        allElement.push(cloneCard);
        categoryItem["All"].push(cloneCard);
        for (let setCategory of element.category) {
            for (let elem in categoryItem) {
                if (setCategory === elem) {
                    categoryItem[elem].push(cloneCard);
                }
            }
        }
    }

    let allHead = [];
    for (let heading of allCategory) {
        let headElement = document.createElement("li");
        headElement.innerHTML = heading;
        getTabHeading.append(headElement);
        allHead.push(headElement);
        headElement.addEventListener("click", function () {
            filterFun(heading);
            activeHead();
            this.classList.add("active");
        });
    }
    allHead[0].classList.add("active");
    function activeHead() {
        for (let i of allHead) {
            i.classList.remove("active");
        }
    }

    let allEleCopy = [...allElement];
    let prevSet2 = [];

    function filterFun(catValue) {
        allElement = categoryItem[catValue];
        let hideAbleElements = allEleCopy.filter((elemen) => {
            return allElement.indexOf(elemen) == -1;
        });

        for (let showElement of allElement) {
            showElement.style.display = "block";
            setTimeout(function () {
                showElement.style.transform = "scale(1)";
            }, 0);
        }

        if (prevSet2.length) {
            for (let x of prevSet2) {
                clearTimeout(x);
            }
        }

        for (let hideElement of hideAbleElements) {
            hideElement.style.transform = "scale(0)";
            let setT = setTimeout(function () {
                hideElement.style.display = "none";
            }, 700);
            prevSet2.push(setT);
        }
        setLeftTop();
    }

    function setLeftTop() {
        let cardPos = [];
        let colNum = 3;
        let contentHeihgt = 0;
        if (window.innerWidth <= 576) {
            colNum = 1;
        } else if (window.innerWidth <= 768) {
            colNum = 2;
        }
        for (let i = 0; i < colNum; i++) {
            cardPos.push([]);
        }
        let colCount = 0;
        for (let singEle of allElement) {
            if (colCount >= colNum) {
                colCount = 0;
            }
            cardPos[colCount].push(singEle);
            colCount++;
        }
        let colWidth = getPorfolios.offsetWidth / colNum;
        cardPos.forEach(function (cols, index, arr) {
            const getPorfolios2 = document.querySelector(".tab-body");
            let top = 0;
            let left = colWidth * index;
            for (let ele of cols) {
                ele.style.top = `${top}px`;
                ele.style.left = `${left}px`;
                top += ele.scrollHeight;
                if (top > contentHeihgt) {
                    contentHeihgt = top;
                }
            }
            getPorfolios2.style.height = `${contentHeihgt}px`;
        });
    }

    window.addEventListener("load", setLeftTop);
    window.addEventListener("resize", setLeftTop);
}

portfolios();

class slider {
    constructor(
        mainDiv,
        secondaryDiv,
        innerDiv,
        sliderCount,
        sliderGap,
        sectionClass
    ) {
        this.mainDiv = document.querySelector(mainDiv);
        this.secondaryDiv = this.mainDiv.querySelector(secondaryDiv);
        this.innerDiv = this.secondaryDiv.querySelectorAll(innerDiv);
        this.sliderGap = sliderGap;
        this.sliderCount = sliderCount;
        if (window.innerWidth <= 768) {
            this.sliderCount = 1;
        }
        this.fullWidth = document.querySelector(sectionClass).scrollWidth;
        this.sliderWidth = this.fullWidth / this.sliderCount;
        this.totalSliderWidth =
            (this.fullWidth / this.sliderCount) * this.innerDiv.length;
    }
    setSliderWidth() {
        for (let element of this.innerDiv) {
            element.style.minWidth = `${
                this.sliderWidth - this.sliderGap * 2
            }px`;
            element.style.margin = `${this.sliderGap}px`;
        }
    }
    sliderSnap(transValue) {
        this.secondaryDiv.style.transition = `0.3s`;
        this.secondaryDiv.style.transform = `translateX(${transValue}px)`;
        setTimeout(() => {
            this.secondaryDiv.style.transition = `0s`;
        }, 300);
    }
    scrolSnapPoint(curen2) {
        let point = [0];
        let p = 0;
        let cur = 0;
        let curentP = Math.abs(curen2);
        for (let points of this.innerDiv) {
            p += this.sliderWidth;
            point.push(p);
        }

        for (let i = 0; i < point.length - 2; i++) {
            if (
                curentP >= point[i] &&
                curentP <= point[i] + this.sliderWidth / 2
            ) {
                this.sliderSnap(point[i] * -1);
                cur = point[i] * -1;
                break;
            } else if (
                curentP > point[i] + this.sliderWidth / 2 &&
                curentP < point[i] + this.sliderWidth
            ) {
                this.sliderSnap(point[i + 1] * -1);
                cur = point[i + 1] * -1;
                break;
            }
        }
        return cur;
    }
    slide() {
        this.setSliderWidth();
        let grabStatus = false;
        let grabStartPoint = 0;
        let currentValue = 0;
        this.mainDiv.addEventListener("pointerdown", (event) => {
            grabStatus = true;
            grabStartPoint = event.clientX - currentValue;
            event.preventDefault();
        });
        document.addEventListener("pointermove", (event) => {
            if (grabStatus) {
                event.preventDefault();
                const x = event.clientX - grabStartPoint;
                this.secondaryDiv.style.transform = `translateX(${x}px)`;
                currentValue = x;
            }
        });
        document.addEventListener("pointerup", (event) => {
            grabStatus = false;
            event.preventDefault();

            let sliderReturnWidth = -(this.totalSliderWidth - this.fullWidth);
            if (currentValue > 0) {
                this.sliderSnap(0);
                currentValue = 0;
            } else if (currentValue < sliderReturnWidth) {
                this.sliderSnap(sliderReturnWidth);
                currentValue = sliderReturnWidth;
            } else {
                currentValue = this.scrolSnapPoint(currentValue);
            }
        });
    }
}

const testimonial = new slider(
    ".testimonial .sec-content",
    ".slider-sec",
    ".card",
    2,
    10,
    ".testimonial .container"
);

testimonial.slide();

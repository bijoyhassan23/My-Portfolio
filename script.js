function typingAnimation(mEl) {
    const mainElement = document.querySelector(mEl);
    const placedText = mainElement.querySelector(".text-palace");
    const typText = placedText.querySelectorAll("span");
    const texts = [];
    for (let i of typText) {
        texts.push(i.innerHTML);
    }
    function textFun(tx) {
        return new Promise((res) => {
            setTimeout(function () {
                const textArray = tx.split("");

                res(textArray);
            }, 1000);
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
            console.log(i);
        }
        againCallFun();
    })();
}

typingAnimation(".typing-animation-text");

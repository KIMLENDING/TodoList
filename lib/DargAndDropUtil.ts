function getTextWidth(content: any) {
    if (typeof window === 'undefined') {
        // 서버 사이드에서는 기본값 반환
        return 100;
    }

    const text = document.createElement("div");
    document.body.appendChild(text);

    text.style.height = "auto";
    text.style.width = "auto";
    text.style.position = "absolute";
    text.style.whiteSpace = "no-wrap";
    text.style.paddingLeft = "10px";
    text.style.paddingRight = "10px";
    text.innerHTML = content;

    const width = Math.ceil(text.clientWidth);
    let updatedWidthWithMarginAndBorder = width + 12;
    document.body.removeChild(text);

    if (updatedWidthWithMarginAndBorder > 380) {
        updatedWidthWithMarginAndBorder = 380;
    }
    if (updatedWidthWithMarginAndBorder < 60) {
        updatedWidthWithMarginAndBorder = 380;
    }
    console.log(updatedWidthWithMarginAndBorder);
    return updatedWidthWithMarginAndBorder;
}

export function chunkArray(array: any[], maxWidth = 1700, maxItemsPerRow = 5) {
    //maxWidth는 화면의 너비를 의미함
    // array : chunk할 배열
    const tempArray: any = [];
    let currentRow = [];
    let currentWidth = 0;
    if (array.length === 0) {
        return tempArray;
    }

    for (let i = 0; i < array.length; i++) {

        const itemWidth = 380; // chunk하나의 너비 고정임
        if (currentWidth + itemWidth > maxWidth || currentRow.length >= maxItemsPerRow) { // 화면의 넘어가면 다음 줄로
            tempArray.push(currentRow);
            currentRow = []; // 새로운 줄
            currentWidth = 0; // 너비 초기화
        }
        currentRow.push(array[i]);
        currentWidth += itemWidth;
    }

    if (currentRow.length > 0) { // 마지막 줄
        tempArray.push(currentRow);
    }

    return tempArray;
}

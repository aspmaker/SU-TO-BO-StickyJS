//sticky element class
const stickyElementClass = 'stickyElement';
//sticky elementattr name for id 
const dataStickyId = 'data-stickyId';
const stickyIdPre = 'sticky-';
//stciky top & bottom border ids
const stickyTopBorderAttrName = 'data-stickyTopBorder';
const stickyBottomBorderAttrName = 'data-stickyBottomBorder';
//sitcky element list
const stickyElements = [];
//sticky control delay
const stickyControlDelay = 10;

//get rondom integer
const randomNumber = () => {
    let range = { min: 999999, max: 9999999 }
    let delta = range.max - range.min

    return Math.round(range.min + Math.random() * delta)
}

//get sticky element from list
const getStickyElementFromList = (id) => {
    let stickyElement = stickyElements.find(f => f.id == id);
    return stickyElement;
}

//get sticky element index from list 
const getStickyElementIndexFromList = (id) => {
    let stickyElementIndex = stickyElements.findIndex(f => f.id == id);
    return stickyElementIndex;
}

//create all sticky element and required functions
const createAllStickyElement = ({
    elementSelector = `.${stickyElementClass}`,
    activateListeners = true
} = {}) => {
    let elements = document.querySelectorAll(elementSelector);
    //create all sticky element
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        //remove stickyid attribute
        if (element) {
            if (activateListeners == false) {
                element.removeAttribute(dataStickyId);
            }
            //replace element to sticky element
            createStickyElement(element);
        }
    }

    //first check and set position
    checkAndSetAllElementScroll();

    if (activateListeners) {
        //listen for changes
        let setTimoutFunc;
        window.addEventListener("load", function () {
            //check
            clearTimeout(setTimoutFunc);
            setTimoutFunc = setTimeout(() => {
                setAllOffset();
                checkAndSetAllElementScroll();
            }, stickyControlDelay);
        });

        window.addEventListener("scroll", function () {
            //check
            clearTimeout(setTimoutFunc);
            setTimoutFunc = setTimeout(() => {
                setAllOffset();
                checkAndSetAllElementScroll();
            }, stickyControlDelay);
        });

        window.addEventListener("resize", function () {
            //check
            clearTimeout(setTimoutFunc);
            setTimoutFunc = setTimeout(() => {
                //clear list for new offset values
                stickyElements.length = 0;
                createAllStickyElement({ activateListeners: false });
            }, stickyControlDelay);
        });
    }
};

//create sticky element
const createStickyElement = (element) => {
    setElementForSticky(element);

    function setElementForSticky(element) {
        let stickyElementId = element.getAttribute(dataStickyId);
        if (stickyElementId && stickyElements.length > 0)
            return;

        //remove sticky id
        element.removeAttribute(dataStickyId);

        //get top border element
        let topBorderElementId = element.getAttribute(stickyTopBorderAttrName);
        let topBorderOffset = {};
        if (topBorderElementId) {
            let topBorderElement = document.getElementById(topBorderElementId);
            topBorderOffset = offset(topBorderElement, null);
        } else {
            let topBorderElement = document.getElementsByTagName('body')[0];
            topBorderOffset = offset(topBorderElement, null);
        }

        //get bottm border element
        let bottomBorderElementId = element.getAttribute(stickyBottomBorderAttrName);
        let bottomBorderOffset = {};
        if (bottomBorderElementId) {
            let bottomBorderElement = document.getElementById(bottomBorderElementId);
            bottomBorderOffset = offset(bottomBorderElement, null);
        } else {
            let bottomBorderElement = document.getElementsByTagName('body')[0];
            bottomBorderOffset = offset(bottomBorderElement, null);
        }

        //set offset and add list
        setOffset(element, topBorderOffset, bottomBorderOffset);
    }
};

//calc all replace element offset
let calcAllOffsetSTF;
function setAllOffset() {
    clearTimeout(calcAllOffsetSTF);
    calcAllOffsetSTF = setTimeout(() => {
        for (let index = 0; index < stickyElements.length; index++) {
            const stickyElement = stickyElements[index];
            setOffset(stickyElement.element, stickyElement.cloneNode, stickyElement.parentOffset);
        }
    }, stickyControlDelay);
}

//if required, set all replace element new position
let checkAndSetAllElementScrollSTF;
function checkAndSetAllElementScroll() {
    clearTimeout(checkAndSetAllElementScrollSTF);
    checkAndSetAllElementScrollSTF = setTimeout(() => {
        for (let index = 0; index < stickyElements.length; index++) {
            const stickyElement = stickyElements[index];
            checkAndSetElementScroll(stickyElement.element);
        }
    }, stickyControlDelay);
}

//check replace lement position and scroll position and if required set new position
function checkAndSetElementScroll(element) {
    //parse offset
    let stickyElementId = element.getAttribute(dataStickyId);
    let elementOffset = getStickyElementFromList(stickyElementId);
    let scrollPos =
        (window.pageYOffSet || document.documentElement.scrollTop) - elementOffset.orgHeight;
    let scrollBottomStat =
        document.documentElement.scrollHeight -
        window.innerHeight -
        document.documentElement.scrollTop <=
        2;
    let realScrollPos = parseFloat(scrollPos) + parseFloat(elementOffset.orgHeight) + 15;

    if (realScrollPos < 0 && parseFloat(elementOffset?.topBorderOffset.top) == 0) return;

    if (realScrollPos >= parseFloat(elementOffset.offsetTop / 3) &&
        parseFloat(realScrollPos) >= (parseFloat(elementOffset?.topBorderOffset.top) + parseFloat(elementOffset.orgHeight)) &&
        parseFloat(realScrollPos) <= (parseFloat(elementOffset?.bottomBorderOffset.top) + parseFloat(elementOffset?.bottomBorderOffset.height) - parseFloat(elementOffset.orgHeight))) {

        const newStyle = {
            position: "fixed",
            bottom: elementOffset.stickyType == 'bottom' ? '3px' : 'unset',
            top: elementOffset.stickyType == 'top' ? "3px" : "unset",
            right: "unset",
            left: parseFloat(elementOffset.offsetLeft) + "px",
            zIndex: 99999,
            width: parseFloat(elementOffset.orgWidth) + "px",
        };
        Object.assign(element.style, newStyle);
    } else {
        const newStyle = {
            position: elementOffset.poisiton || "inherit",
            bottom: elementOffset.bottom,
            top: elementOffset.top,
            right: elementOffset.right,
            left: elementOffset.left,
            zIndex: elementOffset.zIndex,
        };
        Object.assign(element.style, newStyle);
    }

    //if bottom, go bottom
    if (scrollBottomStat) window.scrollTo(0, document.body.scrollHeight);
}

function setOffset(element, topBorderOffset, bottomBorderOffset) {
    //sticky element 
    let stickyElementIndex = undefined;

    //check for stciky id
    let stickyId = element.getAttribute(dataStickyId);

    //get element pos
    let elOffset = offset(element);

    //offset obj
    let offsetObj = {
        id: stickyId,
        offsetLeft: elOffset.left,
        offsetTop: elOffset.top,
        position: element.style.position || "inherit",
        left: element.style.left ? element.style.left : "unset",
        bottom: element.style.bottom ? element.style.bottom : "unset",
        top: element.style.top ? element.style.top : "unset",
        right: element.style.right ? element.style.right : "unset",
        zIndex: element.style.zIndex || 1,
        height: elOffset.height || 0,
        width: elOffset.width || 0
    };
    //if sticky id exist in element attrs
    if (stickyId) {
        //check sticky element if exist or not
        stickyElementIndex = getStickyElementIndexFromList(stickyId);
        //if exist 
        if (stickyElementIndex > -1) {
            stickyElements[stickyElementIndex] = { ...offsetObj, ...stickyElements[stickyElementIndex] };
        }
    } else {
        //get sticky type
        let sctickyType = element.getAttribute("data-stickyType") || 'top';
        //sticky element id
        stickyId = stickyIdPre + randomNumber();
        //props
        offsetObj.id = stickyId;
        offsetObj.orgWidth = elOffset.width || 0;
        offsetObj.orgHeight = elOffset.height || 0;
        offsetObj.orgOffsetTop = elOffset.top;
        offsetObj.orgOffsetLeft = elOffset.left;
        offsetObj.element = element;
        offsetObj.topBorderOffset = topBorderOffset;
        offsetObj.bottomBorderOffset = bottomBorderOffset;
        offsetObj.stickyType = sctickyType;
        //push element to sticky element list
        stickyElements.push(offsetObj);
        element.setAttribute(dataStickyId, stickyId);
    }
}

//return offset value
function offset(el) {
    let rect = el.getBoundingClientRect();
    let scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    let scrollBottomStat =
        document.documentElement.scrollHeight -
        window.innerHeight -
        document.documentElement.scrollTop <=
        2;
    let top = 0;
    if (!scrollBottomStat) {
        let stickyId = el.getAttribute(dataStickyId);
        let stickyElement = getStickyElementFromList(stickyId);
        top = parseFloat(stickyElement?.orgOffsetTop || rect.top) + parseFloat(scrollTop);
    }

    return {
        top: top,
        left: rect.left + scrollLeft,
        width: rect.width + 0.3,
        height: rect.height,
    };
}

//set style for all clone element
const setAllCloneElementStyle = (show = false) => {
    let clones = document.querySelectorAll('[data-stickyclone="1"]');
    for (let index = 0; index < clones.length; index++) {
        const element = clones[index];
        element.style.display = show ? "" : "none";
    }
}


//listen document for change element
const observerElement = () => {
    // Select the node that will be observed for mutations
    const targetNode = document.documentElement || document.body;

    // Options for the observer (which mutations to observe)
    const config = {
        attributes: false,
        childList: true,
        subtree: true,
        characterData: false,
    };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        for (let i = 0; i < mutationList.length; i++) {
            let mutation = mutationList[i];
            if (mutation.type != "childList") continue;
            let classList = Array.from(mutation.target.classList);

            //stciky
            if (classList.some((f) => String(f).toLowerCase() == stickyElementClass.toLowerCase())
            ) {
                setTimeout(() => {
                    //createStickyElement(mutation.target);
                    createAllStickyElement();
                }, 1000);
            }

            //child nodes
            let childNodes = mutation.target.querySelectorAll(`.${stickyElementClass}`);
            if (childNodes.length > 0) {
                for (let index = 0; index < childNodes.length; index++) {
                    const childNode = childNodes[index];
                    //is replaced
                    let isReplaced = childNode.getAttribute("replaced");
                    if (isReplaced) continue;

                    let childNodeClasses = Array.from(childNode.classList);
                    if (
                        childNodeClasses?.length > 0 &&
                        !isReplaced &&
                        childNodeClasses.some(
                            (f) => String(f).toLowerCase() == stickyElementClass.toLowerCase()
                        )
                    ) {
                        //sticky
                        if (childNodeClasses.some((f) =>
                            String(f).toLowerCase() == stickyElementClass.toLowerCase())) {
                            setTimeout(() => {
                                //createStickyElement(childNode);
                                createAllStickyElement();
                            }, 1000);
                        }
                    }
                }
            }
        }
    }
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
};

//observer function
observerElement();

//create and add after dom
//observer function listen for this element
setTimeout(() => {
    let observerContainer = document.getElementById("observerContainer");

    let button = document.createElement('BUTTON');
    // creating text to be
    //displayed on button
    let text = document.createTextNode("Observer Button!");
    // appending text to button
    button.appendChild(text);
    //add sticky && other class
    button.classList.add('btn', 'btn-danger', 'stickyElement');
    //set styicky type attr
    button.setAttribute('data-stickyType', 'bottom');
    // appending button to div
    observerContainer.append(button);
}, 1000 * 5);

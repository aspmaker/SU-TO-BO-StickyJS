//sticky element class
const stickyElementClass = 'stickyElement';
//sticky elementattr name for id 
const dataStickyId = 'data-stickyId';
const stickyIdPre = 'sticky-';
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
    let stickyElementIndex = stickyElements.findIndex(f => f.Id == id);
    return stickyElementIndex;
}

//create all sticky element and required functions
const createAllStickyElement = ({
    elementSelector = `.${stickyElementClass}`,
} = {}) => {
    let elements = document.querySelectorAll(`.${stickyElementClass}`);
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        createStickyElement(element);
    }

    //first check and set position
    checkAndSetAllElementScroll();

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
            setAllOffset();
            checkAndSetAllElementScroll();
        }, stickyControlDelay);
    });
};

//create sticky element
const createStickyElement = (element) => {
    setElementForSticky(element);

    function setElementForSticky(element) {
        let stickyElementId = element.getAttribute(dataStickyId);
        if (stickyElementId) return;

        //get parent
        let parentAttr = element.getAttribute("data-stickyParent");
        let parentOffset = {};
        if (parentAttr) {
            let parentElement = document.getElementById(parentAttr);
            parentOffset = offset(parentElement, null);
        }

        //clone sticky element
        //#region
        let elClone = element.cloneNode(true);
        elClone.removeAttribute("id");
        elClone.removeAttribute("name");
        elClone.setAttribute("data-stickyClone", "1");
        let elParent = element.parentElement;
        elClone.classList.remove(stickyElementClass, "data-stickyParent");
        let cloneNode = elParent.insertBefore(elClone, element);
        cloneNode.style.opacity = "0";
        cloneNode.style.display = "none";
        //#endregion

        //set offset and add list
        setOffset(element, cloneNode, parentOffset);
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
function checkAndSetElementScroll(element, cloneNode, parentOffset) {
    //parse offset
    let stickyElementId = element.getAttribute(dataStickyId);
    let divOffset = getStickyElementFromList(stickyElementId);
    let scrollPos =
        (window.pageYOffSet || document.documentElement.scrollTop) - divOffset.height;
    let scrollBottomStat =
        document.documentElement.scrollHeight -
        window.innerHeight -
        document.documentElement.scrollTop <=
        2;
    if (
        (parseFloat(scrollPos - parseFloat(divOffset.height)) >= parseFloat(divOffset.offsetTop / 3) &&
            parseFloat(scrollPos) >= parseFloat(divOffset?.parentOffsetTop))
    ) {
        const newStyle = {
            position: "fixed",
            bottom: divOffset.stickyType == 'bottom' ? "3px" : "unset",
            top: divOffset.stickyType == 'top' ? "3px" : "unset",
            right: "unset",
            left: parseFloat(divOffset.offsetLeft) + "px",
            zIndex: 99999,
            width: parseFloat(divOffset.width) + "px",
        };
        Object.assign(element.style, newStyle);
    } else {
        const newStyle = {
            position: divOffset.poisiton || "inherit",
            bottom: divOffset.bottom,
            top: divOffset.top,
            right: divOffset.right,
            left: divOffset.left,
            zIndex: divOffset.zIndex,
        };
        Object.assign(element.style, newStyle);
    }
    //if bottom, go bottom
    if (scrollBottomStat) window.scrollTo(0, document.body.scrollHeight);
}

function setOffset(element, cloneNode, parentOffset) {
    //sticky element 
    let stickyElementIndex = undefined;

    //check for stciky id
    let stickyId = element.getAttribute(dataStickyId);

    //get element pos
    let elOffset = offset(element, cloneNode);

    //get sticky type
    let sctickyType = element.getAttribute("data-stickyType") || 'top';
    let offsetObj = {
        stickyElementId: stickyId,
        offsetLeft: elOffset.left,
        offsetTop: elOffset.top,
        parentOffsetLeft: parentOffset?.left || 0,
        parentOffsetTop: parentOffset?.top || 0,
        position: element.style.position || "inherit",
        left: element.style.left ? element.style.left : "unset",
        bottom: element.style.bottom ? element.style.bottom : "unset",
        top: element.style.top ? element.style.top : "unset",
        right: element.style.right ? element.style.right : "unset",
        zIndex: element.style.zIndex || 1,
        height: elOffset.height || 0,
        width: elOffset.width || 0,
        stickyType: sctickyType,
        cloneNode: cloneNode,
        element: element,
        parentOffset: parentOffset
    };
    //if sticky id exist in element attrs
    if (stickyId) {
        //check sticky element if exist or not
        stickyElementIndex = getStickyElementIndexFromList(stickyId);
        //if exist 
        if (stickyElementIndex > -1) {
            stickyElements[stickyElementIndex] = offsetObj;
        }
    } else {
        stickyId = stickyIdPre + randomNumber();
        offsetObj.id = stickyId;
        stickyElements.push(offsetObj);
        element.setAttribute(dataStickyId, stickyId);
    }
}

//return offset value
function offset(el, clone) {
    let rect = el.getBoundingClientRect();
    //if (clone) clone.style.display = "inline";
    let rectClone = clone?.getBoundingClientRect();
    //if (clone) clone.style.display = "none";
    let scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    let scrollBottomStat =
        document.documentElement.scrollHeight -
        window.innerHeight -
        document.documentElement.scrollTop <=
        2;
    let top = 0;
    if (!scrollBottomStat)
        top = parseFloat(rectClone?.top || rect.top) + parseFloat(scrollTop);

    return {
        top: top,
        left: rect.left + scrollLeft,
        width: rect.width + 0.3,
        height: rect.height,
    };
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
        console.log(mutationList);

        for (let i = 0; i < mutationList.length; i++) {
            let mutation = mutationList[i];
            if (mutation.type != "childList") continue;
            let classList = Array.from(mutation.target.classList);

            console.log(classList);

            //stciky
            if (classList.some((f) => String(f).toLowerCase() == stickyElementClass.toLowerCase())
            ) {
                setTimeout(() => {
                    createStickyElement(mutation.target);
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
                                createStickyElement(childNode);
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

//set style for all clone element
const setAllCloneElementStyle = (show = false) => {
    let clones = document.querySelectorAll('[data-stickyclone="1"]');
    for (let index = 0; index < clones.length; index++) {
        const element = clones[index];
        element.style.display = show ? "" : "none";
    }
}


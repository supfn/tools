import './scrolling-element.js';

const STYLE_ID = "modal-helper-style";
const BODY_CLASS = 'modal-open';
if(!document.querySelector(`#${STYLE_ID}`)){
    let styleContent = `body.modal-open { position: fixed; width: 100%; height: 100vh}`;
    let style = document.createElement('style');
    style.id = STYLE_ID;
    style.innerHTML = styleContent;
    document.head.appendChild(style);
}

/**
 * @example
 * ModalHelper.open()  // when you open modal
 * ModalHelper.close() // before you close modal
 */
export default class ModalHelper {
    /**
     * @param modalElem 包裹弹框的蒙层元素，若弹窗上含有输入框,呼出键盘时滚动穿透问题会依旧存在 加此参数来禁止所有滚动
     */
    static open(modalElem) {
        ModalHelper.scrollTop = document.scrollingElement.scrollTop;
        document.body.classList.add(BODY_CLASS);
        document.body.style.top = -ModalHelper.scrollTop + 'px';
        if (modalElem) {
            ModalHelper.modalElem = modalElem;
            ModalHelper.modalElem.addEventListener('touchmove', ModalHelper.preventFn, false);
        }
    }

    static close() {
        document.body.classList.remove(BODY_CLASS);
        // scrollTop lost after set position:fixed, restore it back.
        document.scrollingElement.scrollTop = ModalHelper.scrollTop;
        if (ModalHelper.modalElem) {
            ModalHelper.modalElem.removeEventListener('touchmove', ModalHelper.preventFn, false);
            ModalHelper.modalElem = null;
        }
    }
}

ModalHelper.preventFn = e => e.preventDefault();

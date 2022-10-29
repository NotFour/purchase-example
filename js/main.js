function hideContent(elem, animDuration) {
    if (animDuration) {
        elem.addClass('animation-hide');

        setTimeout(() => {
            elem.removeClass('toggled');
            elem.removeClass('animation-hide');
        }, animDuration)
    } else {
        elem.removeClass('toggled');
    }
}

function showContent(elem, animDuration) {
    elem.addClass('toggled');

    if (animDuration) {
        elem.addClass('animation-show');
        setTimeout(() => {
            elem.removeClass('animation-show')
        }, animDuration)
    }
}

function toggleContent(elem, animShowDur = 0, animHideDur = 0) {
    let show = true;

    if (elem.hasClass('toggled')) {
        hideContent(elem, animHideDur);
        show = false;
    } else {
        showContent(elem, animShowDur);
    }

    return show;
}

function checkElemVisible(target) {
    let targetPosition = {
            top: window.pageYOffset + target.getBoundingClientRect().top,
            left: window.pageXOffset + target.getBoundingClientRect().left,
            right: window.pageXOffset + target.getBoundingClientRect().right,
            bottom: window.pageYOffset + target.getBoundingClientRect().bottom
        },
        windowPosition = {
            top: window.pageYOffset,
            left: window.pageXOffset,
            right: window.pageXOffset + document.documentElement.clientWidth,
            bottom: window.pageYOffset + document.documentElement.clientHeight
        };

    if (targetPosition.bottom > windowPosition.top && // Если позиция нижней части элемента больше позиции верхней чайти окна, то элемент виден сверху
        targetPosition.top < windowPosition.bottom && // Если позиция верхней части элемента меньше позиции нижней чайти окна, то элемент виден снизу
        targetPosition.right > windowPosition.left && // Если позиция правой стороны элемента больше позиции левой части окна, то элемент виден слева
        targetPosition.left < windowPosition.right) { // Если позиция левой стороны элемента меньше позиции правой чайти окна, то элемент виден справа
        // Если элемент полностью видно, то запускаем следующий код
    } else {
        // Если элемент не видно, то запускаем этот код
        $(window).off('scroll', scrolledSummary);
        summarySection.addClass('fixed');
        summarySection.removeClass('toggled');
        $('.purchase').removeClass('purchase--no-fixed');
        $(window).on('scroll', scrolledSummary);
    }
}

function unScrolledSummary() {
    checkElemVisible(summarySection[0]);
}

function scrolledSummary() {
    const iPhoneFixOffset = 116;

    if($(window).scrollTop() + $(window).height() + iPhoneFixOffset >= $(document).height()) {
        $(window).off('scroll', scrolledSummary);
        summarySection.removeClass('fixed');
        summarySection.addClass('toggled');
        $('.purchase').addClass('purchase--no-fixed');
        $(window).on('scroll', unScrolledSummary);
    }
}

function generateError(text) {
    const error = document.createElement('span');
    error.className = 'contacts__error';
    error.innerHTML = text;
    return error;
}

function cleanValidation(elem) {
    let errorNotices;
    let errorClasses;

    if (elem) {
        if ($(elem).hasClass('error')) {
            $(elem).removeClass('error');
            elem.nextElementSibling?.remove();
        }
    } else {
        errorNotices = $('.contacts__error');
        errorClasses = $('.error');
        for (let i = 0; i < errorNotices.length; i++) {
            errorNotices[i].remove();
        }

        for (let i = 0; i < errorClasses.length; i++) {
            $(errorClasses[i]).removeClass('error');
        }
    }
}

function validateRegexp(field) {
    let isValid, errorMessage;
    const settings = validationSettings[field.name];
    const regexp = settings.regexp;

    if (field.value.length > settings.maxWidth) {
        isValid = false;
        errorMessage = `${settings.maxWidth} symbols max`;
    } else if (regexp) {
        isValid = regexp.test(field.value);

        errorMessage = isValid ? '' : `incorrect ${field.name}`;
    } else {
        isValid = true;
        errorMessage = '';
    }

    return {
        isValid,
        errorMessage,
    }
}

function validationField(field, needToggleBtn = false) {
    cleanValidation(field);

    if (!isFieldFilled(field)) {
        $(field).addClass('error');
    } else {
        const validationResult = validateRegexp(field);

        if (!validationResult.isValid) {
            $(field).addClass('error');
            const error = generateError(validationResult.errorMessage);
            field.parentElement.appendChild(error);
        }
    }

    if (needToggleBtn) {
        toggleBtnDisable();
    }
}

function isFieldFilled(field) {
    return field.value;
}

function isFormFilled() {
    let flag = 0;

    for (let i = 0; i < fields.length; i++) {
        if (!isFieldFilled(fields[i])) {
            flag += 1;
        }
    }

    return !Boolean(flag);
}

function isFormValid() {
    return !Boolean($('.contacts__field.error').length);
}

function toggleBtnDisable() {
    summaryBtn.removeClass('disabled');

    if (!isFormFilled()) {
        summaryBtn.addClass('disabled');
    }
}

function getDeviceTypeByResolution() {
    const screenWidth = document.body.clientWidth;

    if (screenWidth < 576) {
        return 'mobile';
    } else if (screenWidth < 768) {
        return 'mobile-landscape';
    } else if (screenWidth < 992) {
        return 'tablet';
    } else if (screenWidth < 1440) {
        return 'laptop';
    } else {
        return 'desktop';
    }
}

function isMobile() {
    const mobileDevices = ['mobile', 'mobile-landscape'];

    return mobileDevices.includes(getDeviceTypeByResolution());
}

function onCheckoutClick() {
    toggleContent(checkoutSection, 500, 500);
}

function onSummaryClick() {
    hideContent(notice, 500);
    toggleContent(summarySection, 1000, 500) ? showContent(body) : hideContent(body);
}

function onResize() {
    removeEventListeners();

    if (isMobile()) {
        addEventListeners();
    } else {
        hideContent(body);
    }
}

const validationSettings = {
    email: {
        regexp: new RegExp(/.+@.+\..+/),
        maxWidth: 256,
    },
    state: {
        maxWidth: 100,
    },
    city: {
        maxWidth: 100,
    },
    country: {
        maxWidth: 100,
    },
    address: {
        maxWidth: 400,
    },
    phone: {
        regexp: new RegExp(/^[+0-9][0-9]+$/),
        maxWidth: 20,
    },
    name: {
        regexp: new RegExp(/^[a-zA-Z0-9]+$/),
        maxWidth: 100,
    },
    surname: {
        regexp: new RegExp(/^[a-zA-Z0-9]+$/),
        maxWidth: 100,
    },
    zip: {
        regexp: new RegExp(/^[0-9]+$/),
        maxWidth: 20,
    }
};

const checkoutHeader = $('.checkout__header');
const checkoutSection = $('.checkout');
const summaryHeader = $('.summary__title');
const summarySection = $('.summary');
const summaryBtn = $('.summary__apply');
const body = $(document.body);
const notice = $('.notice');
const noticeBtn = $('.notice__close');
const form = $('.purchase__form');
const fields = $('.contacts__field');

function addEventListeners() {
    checkoutHeader.on('click', onCheckoutClick);
    summaryHeader.on('click', onSummaryClick);
    $(window).on('scroll', scrolledSummary);
}

function removeEventListeners() {
    checkoutHeader.off('click', onCheckoutClick);
    summaryHeader.off('click', onSummaryClick);
    $(window).off('scroll', scrolledSummary);
}



noticeBtn.on('click', () => {
    hideContent(notice, 500);
});

$('.checkout__list').on('scroll', (evt) => {
    const elem = evt.target;
    const parent = $(elem.parentNode);

    if (elem.scrollTop > 0) {
        parent.addClass('shadow-top');
    } else {
        parent.removeClass('shadow-top');
    }

    if (elem.scrollHeight - elem.offsetHeight - elem.scrollTop) {
        parent.addClass('shadow-bottom');
    } else {
        parent.removeClass('shadow-bottom');
    }
});



fields.on('focusout', (event) => validationField(event.target, true));

form.on('submit', function (event) {

    for (let i = 0; i < fields.length; i++) {
        validationField(fields[i]);
    }

    if (!isFormValid()) {
        event.preventDefault();
    }

    toggleBtnDisable();

    if (!isFormFilled()) {
        showContent(notice, 1500);
        setTimeout(() => hideContent(notice, 500), 2500);
    }

    if (isMobile()) {
        hideContent(body);
        hideContent(summarySection, 500);
    }
})

if (isMobile()) {
    addEventListeners();
}

$(window).on( "resize", onResize);

toggleBtnDisable();
